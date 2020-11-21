import pandas as pd
import numpy as np
import psycopg2

conn = psycopg2.connect(database="dummy", user="admin",
                        password="admin", host="database", port="5432")
cur = conn.cursor()

cur.execute("SELECT * FROM movie_table")

data2clean = cur.fetchall()

print(data2clean)

data = pd.DataFrame(data2clean)

conn.commit()


# data cleaning
arr = np.random.randn(len(data), 1)

data.insert(2, "dummy", arr)

print(data)


# saving cleaned data

create_table_query = '''CREATE TABLE IF NOT EXISTS cleaned_movie_table
          (ID INT PRIMARY KEY     NOT NULL,
          tconst           TEXT    NOT NULL,
          tconst1           TEXT    NOT NULL,
          tconst2          TEXT    NOT NULL
          ); '''

cur.execute(create_table_query)
conn.commit()
print("Table created successfully in PostgreSQL ")


for row in data.itertuples():
    tconst = row[0]
    averageRating = row[1]
    numVotes = row[2]
    dummy = row[3]

    print(tconst, averageRating, numVotes)

    cur.execute("""
        INSERT INTO cleaned_movie_table
        VALUES (%s, %s, %s, %s);
        """, (tconst, averageRating, numVotes, dummy))
    conn.commit()
cur.close()
print("DATABASE UPDATED")
