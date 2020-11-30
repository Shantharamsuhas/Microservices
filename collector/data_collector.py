import wget
import gzip
import pandas as pd
import os
import psycopg2


# to show top 10 movies by ratings

# downloading the data
rating_url = "https://datasets.imdbws.com/title.ratings.tsv.gz"
movie_url = "https://datasets.imdbws.com/title.basics.tsv.gz"

# extracting the rating data
print("Downloading data for ratings")
rating_data = wget.download(rating_url)
print("Download finished")
with gzip.open(rating_data) as f:
    rating_dataset = pd.read_csv(f, sep="\t")
if os.path.exists(rating_data):
    os.remove(rating_data)


# extracting the movie name data
print("Downloading data for movie names")
movie_data = wget.download(movie_url)
print("Download finished")
with gzip.open(movie_data) as f:
    movie_dataset = pd.read_csv(f, sep="\t")
if os.path.exists(movie_data):
    os.remove(movie_data)

print(rating_dataset.shape)
print(movie_dataset.shape)

conn = psycopg2.connect(database="dummy", user="admin",
                        password="admin", host="localhost", port="5432")
cur = conn.cursor()
# creating table for ratings
rating_table_query = '''CREATE TABLE IF NOT EXISTS rating_table
          (tconst INT PRIMARY KEY     NOT NULL,
          averageRating    TEXT    NOT NULL,
          votes         TEXT    NOT NULL
          ); '''

cur.execute(rating_table_query)
conn.commit()
print("Rating table created successfully in PostgreSQL ")

# adding values to rating table
for row in rating_dataset[:100].itertuples():
    tconst = int(row.tconst[2:])
    averageRating = row.averageRating
    numVotes = row.numVotes

    print(tconst, averageRating, numVotes)

    cur.execute("""
        INSERT INTO rating_table
        VALUES (%s, %s, %s);
        """, (tconst, averageRating, numVotes))
    conn.commit()

# creating table for movie names
movie_table_query = '''CREATE TABLE IF NOT EXISTS movie_table
          (tconst INT PRIMARY KEY     NOT NULL,
          titleType TEXT,
          primaryTitle TEXT,
          originalTitle TEXT,
          startYear TEXT,
          endYear TEXT,
          genres TEXT
          ); '''

cur.execute(movie_table_query)
conn.commit()
print("Movie table created successfully in PostgreSQL ")


# adding values to movie table
for row in movie_dataset[:100].itertuples():
    tconst = int(row.tconst[2:])
    titleType = row.titleType
    primaryTitle = row.primaryTitle
    originalTitle = row.originalTitle
    startYear = row.startYear
    endYear = row.endYear
    genres = row.genres

    print(tconst, titleType, primaryTitle,
          originalTitle, startYear, endYear, genres)

    cur.execute("""
        INSERT INTO movie_table
        VALUES (%s, %s, %s, %s, %s, %s, %s);
        """, (tconst, titleType, primaryTitle, originalTitle, startYear, endYear, genres))
    conn.commit()

# adding values to movie table
cur.close()
print("DATABASE UPDATED")
