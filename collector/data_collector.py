import wget
import gzip
import pandas as pd
import os
import psycopg2

# downloading the data
url = "https://datasets.imdbws.com/title.ratings.tsv.gz"
data = wget.download(url)

# extracting the data
with gzip.open(data) as f:
    dataset = pd.read_csv(f, sep="\t")
if os.path.exists(data):
    os.remove(data)

print(dataset.head())

conn = psycopg2.connect(database="dummy", user="admin",
                        password="admin", host="database", port="5432")
cur = conn.cursor()

create_table_query = '''CREATE TABLE IF NOT EXISTS movie_table
          (ID INT PRIMARY KEY     NOT NULL,
          tconst           TEXT    NOT NULL,
          tconst1           TEXT    NOT NULL,
          tconst2          TEXT    NOT NULL
          ); '''

cur.execute(create_table_query)
conn.commit()
print("Table created successfully in PostgreSQL ")


index = 0

for row in dataset.head().itertuples():
    tconst = row.tconst
    averageRating = row.averageRating
    numVotes = row.numVotes

    print(tconst, averageRating, numVotes)

    cur.execute("""
        INSERT INTO movie_table
        VALUES (%s, %s, %s, %s);
        """, (index, tconst, averageRating, numVotes))
    conn.commit()
    index += 1
cur.close()
print("DATABASE UPDATED")
