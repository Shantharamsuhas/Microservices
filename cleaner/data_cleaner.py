import pandas as pd
import numpy as np
import psycopg2

conn = psycopg2.connect(database="dummy", user="admin",
                        password="admin", host="database", port="5432")
cur = conn.cursor()

cur.execute("select m.primarytitle, m.titletype, r.votes, r.averagerating from movie_table m, rating_table r where r.tconst = m.tconst;")

data2clean = cur.fetchall()

print(data2clean)

data = pd.DataFrame(data2clean)

conn.commit()


# # data cleaning
# arr = np.random.randn(len(data), 1)

# data.insert(2, "dummy", arr)

# print(data)


# saving cleaned data

create_table_query = '''CREATE TABLE IF NOT EXISTS cleaned_movie_rating_table
          (ID SERIAL PRIMARY KEY   NOT NULL,
          primaryTitle           TEXT    NOT NULL,
          titletype           TEXT    NOT NULL,
          votes         TEXT    NOT NULL,
          averagerating     TEXT    NOT NULL
          ); '''

cur.execute(create_table_query)
conn.commit()
print("Table created successfully in PostgreSQL ")
print(data.head())

for row in data.itertuples():
    # print(row)
    index = row[0]
    primarytitle = row[1]
    titletype = row[2]
    votes = row[3]
    averagerating = row[4]

    print(index, primarytitle, titletype, votes, averagerating)

    cur.execute("""
        INSERT INTO cleaned_movie_rating_table
        VALUES (%s, %s, %s, %s, %s);
        """, (index, primarytitle, titletype, votes, averagerating))
    conn.commit()
cur.close()
print("DATABASE UPDATED")
