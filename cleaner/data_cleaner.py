import pandas as pd
import numpy as np
import psycopg2


# Establish connection with PostgreSQL SQL
def database_connection():
    conn = psycopg2.connect(database="dummy", user="admin",
                            password="admin", host="database", port="5432")
    return conn


# Get the data that needs preprocessing
def data_to_clean():
    conn = database_connection()
    cursor = conn.cursor()
    # cursor.execute(
    #     "SELECT m.primarytitle, m.titletype, r.votes, r.averagerating FROM movie_table m, rating_table r where "
    #     "r.tconst = m.tconst;")
    cursor.execute(
        "SELECT primarytitle, titletype, numvotes, averagerating FROM movie_table")
    data2clean = cursor.fetchall()
    print(data2clean)
    data = pd.DataFrame(data2clean)
    conn.commit()
    return data


# Create cleaned_movie_rating_table table in database dummy
def create_processed_movie_rating_table():
    conn = database_connection()
    cursor = conn.cursor()
    cursor.execute("""DROP TABLE IF EXISTS cleaned_movie_rating_table""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS cleaned_movie_rating_table
          (ID SERIAL PRIMARY KEY   NOT NULL,
          primaryTitle           TEXT    NOT NULL,
          titletype           TEXT    NOT NULL,
          votes         TEXT    NOT NULL,
          averagerating     TEXT    NOT NULL
          );""")
    conn.commit()
    cursor.execute("""SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 
    'cleaned_movie_rating_table'""")
    is_table = cursor.fetchall()
    print("cleaned_movie_rating_table created successfully in PostgreSQL ")
    conn.close()
    return is_table


# Load the data into the table
def load_processed_movie_rating_table():
    data = data_to_clean()
    conn = database_connection()
    cursor = conn.cursor()
    cursor.execute("""DELETE FROM cleaned_movie_rating_table""")
    for row in data.itertuples():
        # print(row)
        index = row[0]
        primarytitle = row[1]
        titletype = row[2]
        votes = row[4]
        averagerating = row[3]
        print(index, primarytitle, titletype, votes, averagerating)
        cursor.execute("""
            INSERT INTO cleaned_movie_rating_table
            VALUES (%s, %s, %s, %s, %s);
            """, (index, primarytitle, titletype, votes, averagerating))
<<<<<<< HEAD
    conn.commit()
    print("Inserting done")
    cursor.execute("""SELECT * FROM movie_table""")
    has_data = cursor.fetchall()
    cursor.close()
    return has_data
=======
        conn.commit()
        print("Inserting done")
        cursor.execute("""SELECT * FROM movie_table""")
        has_data = cursor.fetchall()
        cursor.close()
        return has_data
>>>>>>> f6e0a32224038c5a1b59d59cbae8f272f471b553


create_processed_movie_rating_table()
load_processed_movie_rating_table()
