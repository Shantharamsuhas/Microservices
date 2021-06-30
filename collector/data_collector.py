import gzip
from numpy.lib.function_base import average
import wget
import pandas as pd
from pandas import DataFrame as df
import os
import psycopg2
import flask
import multiprocessing
from collections import Counter
from datetime import datetime
import zipfile
app = flask.Flask('__name__')


def API(Conf):
    print('In API selction')
    app.run(host='0.0.0.0', port=4321)


# Download rating data from IMDb website
def rating_download_data(url):
    rating_url = url
    print("Downloading data")
    rating_data = wget.download(rating_url)
    print("Download finished")
    with gzip.open(rating_data) as f:
        rating_dataset = pd.read_csv(f, sep="\t")
    if os.path.exists(rating_data):
        os.remove(rating_data)
    return rating_dataset


# Download movies data from IMDb website
def movies_download_data(url):
    movie_url = url
    print("Downloading data for movie names")
    movie_data = wget.download(movie_url)
    print("Download movies data finished")
    with gzip.open(movie_data) as f:
        movie_dataset = pd.read_csv(f, sep="\t")
        # if os.path.exists(movie_data):
        #     os.remove(movie_data)
    return movie_dataset


# Connect to postgres sql database
def database_connection():
    conn = psycopg2.connect(database="dummy", user="admin",
                            password="admin", host="database", port="5432")
    return conn


# Create rating table in database dummy
def create_rating_table():
    conn = database_connection()
    cursor = conn.cursor()
    cursor.execute("""CREATE TABLE IF NOT EXISTS rating_table
             (tconst INT PRIMARY KEY     NOT NULL,
             averageRating    TEXT    NOT NULL,
             votes         TEXT    NOT NULL
             );""")
    conn.commit()
    cursor.execute(
        """SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rating_table'""")
    is_table = cursor.fetchall()
    print("rating_table created successfully in PostgreSQL ")
    conn.close()
    return is_table


# load with data to rating table
def load_rating_table(rating_dataset):
    conn = database_connection()
    cur = conn.cursor()
    # rating_dataset = rating_download_data(
    #     "https://datasets.imdbws.com/title.ratings.tsv.gz")
    cur.execute("""DELETE FROM rating_table""")
    t1 = datetime.now()
    for row in rating_dataset[:5000].itertuples():
        tconst = int(row.tconst[2:])
        averageRating = row.averageRating
        numVotes = row.numVotes
        cur.execute("""
            INSERT INTO rating_table
            VALUES (%s, %s, %s);
            """, (tconst, averageRating, numVotes))
    t2 = datetime.now()
    print(t2-t1)
    print("Inserting done")
    cur.execute("""SELECT * FROM rating_table""")
    is_data = cur.fetchall()
    conn.commit()
    return is_data

# loading movie lens data


def movielens_data_download(url):
    print("Downloading data")
    raw_data = wget.download(url)
    print("Download finished")
    path = "collector/data"
    with zipfile.ZipFile(raw_data, "r") as f:
        f.extractall(path)
    # with open("/".join([path, raw_data.split(".")[0], "movies.csv"]), "rb") as movies_file:
    #     movies_data = pd.read_csv(movies_file, header=0, encoding="utf-8")
    with open("/".join([path, raw_data.split(".")[0], "ratings.csv"]), "r") as ratings_file:
        ratings_data = pd.read_csv(ratings_file, header=0)
    with open("/".join([path, raw_data.split(".")[0], "links.csv"]), "r") as links_file:
        links_data = pd.read_csv(links_file, header=0)
    if os.path.exists(raw_data):
        os.remove(raw_data)
        print("file removed")
    result = pd.merge(left=ratings_data, right=links_data,
                      left_on='movieId', right_on='movieId')

    return result


# Create movie table in database dummy
def create_movie_table():
    conn = database_connection()
    cursor = conn.cursor()
    cursor.execute("""CREATE TABLE IF NOT EXISTS movie_table
          (tconst INT PRIMARY KEY     NOT NULL,
          titleType TEXT,
          primaryTitle TEXT,
          startYear TEXT,
          averageRating FLOAT,
          numVotes FLOAT
          );""")
    conn.commit()
    cursor.execute(
        """SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'movie_table'""")
    is_table = cursor.fetchall()
    print("Movie table created successfully in PostgreSQL ")
    conn.close()
    return is_table

# for year frequency


def create_year_freq_table(year_frequency):
    conn = database_connection()
    cursor = conn.cursor()
    cursor.execute("""CREATE TABLE IF NOT EXISTS year_table
          (year INT,
          movies_made INT
          );""")
    conn.commit()
    print("Year table created successfully in PostgreSQL ")
    cursor.execute("""DELETE FROM year_table""")
    for item in year_frequency:
        year = int(item)
        movies_made = int(year_frequency[item])
        cursor.execute("""
            INSERT INTO year_table
            VALUES (%s, %s);""",
                       (year, movies_made))
    conn.commit()
    conn.close()


# for genre frequency
def create_genre_freq_table(genre_frequency):
    conn = database_connection()
    cursor = conn.cursor()
    cursor.execute("""CREATE TABLE IF NOT EXISTS genre_table
          (genre TEXT,
          year TEXT
          );""")
    conn.commit()
    print("Genre table created successfully in PostgreSQL ")
    cursor.execute("""DELETE FROM genre_table""")
    for item in genre_frequency.itertuples():
        genre = item.genres
        year = item.startYear
        cursor.execute("""
            INSERT INTO genre_table
            VALUES (%s, %s);""",
                       (genre, year))
    conn.commit()

# load data to movie table


def load_movie_table():
    conn = database_connection()
    cur = conn.cursor()
    rating_dataset = rating_download_data(
        "https://datasets.imdbws.com/title.ratings.tsv.gz")
    movie_dataset = rating_download_data(
        "https://datasets.imdbws.com/title.basics.tsv.gz")
    movielens_dataset = movielens_data_download(
        "http://files.grouplens.org/datasets/movielens/ml-latest-small.zip")
    # with open("data.tsv", encoding='utf8') as file:
    #     movie_dataset = pd.read_csv(file, sep="/t")
    # merging two dataset
    t2 = datetime.now()

    # cleaning movielens
    ml_df1 = movielens_dataset.groupby(['imdbId']).count()
    ml_df2 = movielens_dataset.groupby(['imdbId']).mean()
    merged_movies = pd.merge(left=ml_df1, right=ml_df2, left_on=[
                             'imdbId'], right_on=['imdbId'])
    ml_df3 = merged_movies[['userId_x', 'rating_y']].reset_index(level=0)
    ml_df3 = ml_df3.rename(
        columns={'imdbId': 'tconst', 'userId_x': 'numVotes', 'rating_y': 'averageRating'})
    ml_df3['averageRating'] = ml_df3['averageRating']*2

    print("Movie lens")
    # print(ml_df3.head())

    # imdb datset
    result = pd.merge(left=movie_dataset, right=rating_dataset,
                      left_on='tconst', right_on='tconst')

    # taking movies only from dataset
    df1 = result[(result["titleType"] == "movie")]

    # deleting extra columns
    useless_columns = ["originalTitle", "isAdult", "endYear", "runtimeMinutes"]
    df1.drop(useless_columns, inplace=True, axis=1)

    # print(df1)

    # taking last 20 years movies only
    # print(df1.dtypes)
    df1 = df1[(df1['startYear'] != '\\N')]
    df1 = df1[(df1['genres'] != '\\N')]
    df1['startYear'] = pd.to_numeric(df1['startYear'])
    df1 = df1.dropna(subset=['averageRating'])
    df1['numVotes'] = pd.to_numeric(df1['numVotes'])

    # values for other two charts
    year_df = df1[['startYear', 'genres']].copy()

    df1 = df1[(df1['numVotes'] > 499)]
    # df.replace()

    # print(result.head())
    # sorted by rating
    df1 = df1.sort_values(by=['averageRating'], ascending=False)

    
    year_df['genres'] = year_df['genres'].apply(lambda x: x.split(","))
    # year_df = year_df.explode('genres')

    genre_year = year_df[year_df.startYear > 2015]
    genre_year = genre_year[genre_year.startYear < 2021]
    genre_year = genre_year.explode('genres')
    # print(year_df.explode('genres'))
    genre_frequency = Counter(
        g for genres in year_df['genres'] for g in genres)
    year_df[["yearStr"]] = year_df[["startYear"]].astype(str)
    year_df['yearStr'] = year_df['yearStr'].apply(lambda x: x.split(","))
    year_frequency = Counter(
        g for genres in year_df['yearStr'] for g in genres)
    # genre_by_year = year_df.groupby(["startYear"])['genres'].apply(list).reset_index(name = 'genres')
    # genre_by_year = genre_by_year.explode('genres') # it creates so many rows

    # print(df1)
    # print(genre_frequency)
    # print(year_frequency)
    # pd.merge()

    # merging two data source
    df1['tconst'] = df1['tconst'].str.split('tt').str[1]
    df1['tconst'] = pd.to_numeric(df1['tconst'])

    # adding ratings from imdb to movie lens
    rating_dataset['tconst'] = rating_dataset['tconst'].str.split('tt').str[1]
    rating_dataset['tconst'] = pd.to_numeric(rating_dataset['tconst'])
    ml_df3 = pd.merge(left=rating_dataset, right=ml_df3, on=['tconst'])

    # combining both
    #ml_df3 = movielens, df1 = imdb
    ml_df3['totalRating'] = ((ml_df3['averageRating_x']*ml_df3['numVotes_x']) + (
        ml_df3['averageRating_y']*ml_df3['numVotes_y'])) / (ml_df3['numVotes_x'] + ml_df3['numVotes_y'])
    ml_df3['totalVotes'] = ml_df3['numVotes_x'] + ml_df3['numVotes_y']

    # merging with main dataset df1
    df1 = pd.merge(left=df1, right=ml_df3, left_on=[
                   'tconst'], right_on=['tconst'], how='outer')

    # filling NA values with already given
    df1.totalRating.fillna(df1.averageRating, inplace=True)
    df1.totalVotes.fillna(df1.numVotes, inplace=True)

    # removing useless columns
    df1.drop(['averageRating', 'numVotes', 'averageRating_x', 'numVotes_x',
              'numVotes_y', 'averageRating_y'], inplace=True, axis=1)

    # renaming columns
    df1 = df1.rename(columns={'totalVotes': 'numVotes',
                              'totalRating': 'averageRating'})

    df1 = df1.dropna(subset=["primaryTitle"])

    df1 = df1[(df1['numVotes'] > 100000)]

    t1 = datetime.now()
    # print(df1)
    print(t1-t2)

    # load_rating_table(rating_df)

    # print(result.shape)
    cur.execute("""DELETE FROM movie_table""")
    tt1 = datetime.now()
    for row in df1.itertuples():
        tconst = row.tconst
        title_type = row.titleType
        primary_title = row.primaryTitle
        # original_title = row.originalTitle
        start_year = row.startYear
        # end_year = row.endYear
        # genres = row.genres
        average_rating = row.averageRating
        num_votes = row.numVotes

        # print(tconst, title_type, primary_title,
        #       original_title, start_year, end_year, genres)
        cur.execute("""
            INSERT INTO movie_table
            VALUES (%s, %s, %s, %s, %s, %s);""",
                    (tconst, title_type, primary_title, start_year, average_rating, num_votes))
    tt2 = datetime.now()
    print(tt2-tt1)
    print("Inserting done")
    print(df1.head())
    print(df1.tail())
    print(df1.dtypes)
    cur.execute("""SELECT * FROM movie_table""")
    has_data = cur.fetchall()
    conn.commit()
    cur.close()
    create_year_freq_table(year_frequency)
    create_genre_freq_table(genre_year)
    return has_data


if __name__ == "__main__":
    config = {"Something": "SomethingElese"}
    p = multiprocessing.Process(target=API, args=(config))
    p.start()
    print("Server Started")
    create_rating_table()
    # load_rating_table()
    create_movie_table()
    load_movie_table()
    p.terminate()
    p.join()
    print("Server Stopped")
