import gzip
from numpy.lib.function_base import average
import wget
import pandas as pd
from pandas import DataFrame as df
import os
import psycopg2
import flask
from flask_cors import CORS, cross_origin
from flask import jsonify
from collections import Counter
from datetime import datetime
import zipfile
app = flask.Flask('__name__')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
PASSWORD = 'MOVIES'
processing = False


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
    # t2 = datetime.now()

    # cleaning movielens
    ml_df1 = movielens_dataset.groupby(['imdbId']).count()
    ml_df2 = movielens_dataset.groupby(['imdbId']).mean()
    merged_movies = pd.merge(left=ml_df1, right=ml_df2, left_on=[
                             'imdbId'], right_on=['imdbId'])
    rating_df = merged_movies[['userId_x', 'rating_y']].reset_index(level=0)
    rating_df = rating_df.rename(
        columns={'imdbId': 'tconst', 'userId_x': 'numVotes', 'rating_y': 'averageRating'})
    rating_df['averageRating'] = rating_df['averageRating']*2

    print("Movie lens")

    # imdb datset
    result = pd.merge(left=movie_dataset, right=rating_dataset,
                      left_on='tconst', right_on='tconst')

    # taking only movies from dataset
    movies_df = result[(result["titleType"] == "movie")]

    # deleting extra columns
    useless_columns = ["originalTitle", "isAdult", "endYear", "runtimeMinutes"]
    movies_df.drop(useless_columns, inplace=True, axis=1)

    # cleaning
    movies_df = movies_df[(movies_df['startYear'] != '\\N')]
    movies_df = movies_df[(movies_df['genres'] != '\\N')]
    movies_df['startYear'] = pd.to_numeric(movies_df['startYear'])
    movies_df = movies_df.dropna(subset=['averageRating'])
    movies_df['numVotes'] = pd.to_numeric(movies_df['numVotes'])

    # values for other two charts
    year_df = movies_df[['startYear', 'genres']].copy()
    movies_df = movies_df[(movies_df['numVotes'] > 499)]

    # sorted by rating
    movies_df = movies_df.sort_values(by=['averageRating'], ascending=False)

    year_df['genres'] = year_df['genres'].apply(lambda x: x.split(","))
    # year_df = year_df.explode('genres')

    # limit for genre frequency can be changed here
    genre_year = year_df[year_df.startYear > 2000]
    genre_year = genre_year[genre_year.startYear < 2022]
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


    # merging two data source
    movies_df['tconst'] = movies_df['tconst'].str.split('tt').str[1]
    movies_df['tconst'] = pd.to_numeric(movies_df['tconst'])

    # adding ratings from imdb to movie lens
    rating_dataset['tconst'] = rating_dataset['tconst'].str.split('tt').str[1]
    rating_dataset['tconst'] = pd.to_numeric(rating_dataset['tconst'])
    rating_df = pd.merge(left=rating_dataset, right=rating_df, on=['tconst'])

    # combining both
    #ml_df3 = movielens, df1 = imdb
    rating_df['totalRating'] = ((rating_df['averageRating_x']*rating_df['numVotes_x']) + (
        rating_df['averageRating_y']*rating_df['numVotes_y'])) / (rating_df['numVotes_x'] + rating_df['numVotes_y'])
    rating_df['totalVotes'] = rating_df['numVotes_x'] + rating_df['numVotes_y']

    # merging with main dataset df1
    movies_df = pd.merge(left=movies_df, right=rating_df, left_on=[
                   'tconst'], right_on=['tconst'], how='outer')

    # filling NA values with already given
    movies_df.totalRating.fillna(movies_df.averageRating, inplace=True)
    movies_df.totalVotes.fillna(movies_df.numVotes, inplace=True)

    # removing useless columns
    movies_df.drop(['averageRating', 'numVotes', 'averageRating_x', 'numVotes_x',
              'numVotes_y', 'averageRating_y'], inplace=True, axis=1)

    # renaming columns
    movies_df = movies_df.rename(columns={'totalVotes': 'numVotes',
                              'totalRating': 'averageRating'})

    movies_df = movies_df.dropna(subset=["primaryTitle"])

    movies_df = movies_df[(movies_df['numVotes'] > 100000)]

    # t1 = datetime.now()
    # print(df1)
    # print(t1-t2)

    # load_rating_table(rating_df)

    # print(result.shape)
    cur.execute("""DELETE FROM movie_table""")
    # tt1 = datetime.now()
    for row in movies_df.itertuples():
        tconst = row.tconst
        title_type = row.titleType
        primary_title = row.primaryTitle
        # original_title = row.originalTitle
        start_year = row.startYear
        # end_year = row.endYear
        # genres = row.genres
        average_rating = row.averageRating
        num_votes = row.numVotes

        cur.execute("""
            INSERT INTO movie_table
            VALUES (%s, %s, %s, %s, %s, %s);""",
                    (tconst, title_type, primary_title, start_year, average_rating, num_votes))
    # tt2 = datetime.now()
    # print(tt2-tt1)
    print("Inserting done")
    cur.execute("""SELECT * FROM movie_table""")
    has_data = cur.fetchall()
    conn.commit()
    cur.close()
    create_year_freq_table(year_frequency)
    create_genre_freq_table(genre_year)
    return has_data


# function to clean data
@app.route("/api/load-data/<password>", methods=['GET', 'POST'])
def clean_data(password):
    global processing
    if not processing:
        processing = True
        try:
            if password == PASSWORD:
                print("Data loading process started")
                create_rating_table()
                # load_rating_table()
                create_movie_table()
                load_movie_table()
                print("Data loaded successfully")
                processing = False
                return jsonify({"status": "success"})
            else:
                print("Wrong password")
                processing = False
                return jsonify({"status": "Invalid Password"})
        except:
            processing = False
            return jsonify({"status": "Internal Error"})
    else:
        return {"status": "Wait for process to finish"}

# check if application is running
@app.route("/api/check-status", methods=['GET'])
def check_status():
    return flask.jsonify({"status": "success"})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=4321, threaded=True)
