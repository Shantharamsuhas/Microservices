import gzip
import wget
import pandas as pd
import os
import psycopg2
import flask
import multiprocessing

app = flask.Flask('__name__')


def API(Conf):
    print('In API selction')
    app.run(host='0.0.0.0', port=4321)


# Download rating data from IMDb website
def rating_download_data(url):
    rating_url = url
    print("Downloading data for ratings")
    rating_data = wget.download(rating_url)
    print("Download ratings data finished")
    with gzip.open(rating_data) as f:
        rating_dataset = pd.read_csv(f, sep="\t")
        # if os.path.exists(rating_data):
        #     # os.remove(rating_data)
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
def load_rating_table():
    conn = database_connection()
    cur = conn.cursor()
    rating_dataset = rating_download_data(
        "https://datasets.imdbws.com/title.ratings.tsv.gz")
    for row in rating_dataset[:100].itertuples():
        tconst = int(row.tconst[2:])
        averageRating = row.averageRating
        numVotes = row.numVotes
        cur.execute("""DELETE FROM rating_table""")
        cur.execute("""
            INSERT INTO rating_table
            VALUES (%s, %s, %s);
            """, (tconst, averageRating, numVotes))
        print("Inserting done")
        cur.execute("""SELECT * FROM rating_table""")
        is_data = cur.fetchall()
        conn.commit()
        return is_data


# Create movie table in database dummy
def create_movie_table():
    conn = database_connection()
    cursor = conn.cursor()
    cursor.execute("""CREATE TABLE IF NOT EXISTS movie_table
          (tconst INT PRIMARY KEY     NOT NULL,
          titleType TEXT,
          primaryTitle TEXT,
          originalTitle TEXT,
          startYear TEXT,
          endYear TEXT,
          genres TEXT
          );""")
    conn.commit()
    cursor.execute(
        """SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'movie_table'""")
    is_table = cursor.fetchall()
    print("Movie table created successfully in PostgreSQL ")
    conn.close()
    return is_table


# load data to movie table
def load_movie_table():
    conn = database_connection()
    cur = conn.cursor()
    movie_dataset = movies_download_data(
        "https://datasets.imdbws.com/title.basics.tsv.gz")
    for row in movie_dataset[:100].itertuples():
        tconst = int(row.tconst[2:])
        title_type = row.titleType
        primary_title = row.primaryTitle
        original_title = row.originalTitle
        start_year = row.startYear
        end_year = row.endYear
        genres = row.genres

        print(tconst, title_type, primary_title,
              original_title, start_year, end_year, genres)
        cur.execute("""DELETE FROM movie_table""")
        cur.execute("""
            INSERT INTO movie_table
            VALUES (%s, %s, %s, %s, %s, %s, %s);""",
                    (tconst, title_type, primary_title, original_title, start_year, end_year, genres))
        print("Inserting done")
        cur.execute("""SELECT * FROM movie_table""")
        has_data = cur.fetchall()
        conn.commit()
        return has_data


if __name__ == "__main__":
    config = {"Something": "SomethingElese"}
    p = multiprocessing.Process(target=API, args=(config))
    p.start()
    print("Server Started")
    create_rating_table()
    load_rating_table()
    create_movie_table()
    load_movie_table()
    p.terminate()
    p.join()
    print("Server Stopped")
