import psycopg2
import pytest

''' TEST DRIVEN DEVELOPMENT 
    Unit test scripts for test_data_collector.py '''


# Test if data has been successfully downloaded from IMDb website
def test_data_download():
    data = None
    assert data is not None, 'Test failed data not downloaded'


# Test if db connection is successfully established or not
def test_db_connection():
    connection = None
    assert connection is not None, 'Test failed db is not connected'


# Test if rating table is created
def test_rating_table_exists():
    connection = psycopg2.connect(database="dummy", user="admin",
                                  password="admin", host="localhost", port="5432")
    cursor = connection.cursor()
    cursor.execute("""DROP TABLE IF EXISTS rating_table""")
    cursor.execute("""SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rating_table'""")
    is_table = cursor.fetchall()
    connection.close()
    assert len(is_table) != 0, 'Test failed rating table does not exist'


# Test if rating table has data
def test_data_rating_table():
    connection = psycopg2.connect(database="dummy", user="admin",
                                  password="admin", host="localhost", port="5432")
    cursor = connection.cursor()
    cursor.execute("""DELETE FROM rating_table""")
    cursor.execute("""SELECT * FROM rating_table LIMIT 4""")
    is_data = cursor.fetchall()
    assert len(is_data) != 0, 'Test failed rating table is empty'


# Test if movie table is created
def test_movie_table_exists():
    connection = psycopg2.connect(database="dummy", user="admin",
                                  password="admin", host="localhost", port="5432")
    cursor = connection.cursor()
    cursor.execute("""DROP TABLE IF EXISTS movie_table""")
    cursor.execute("""SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'movie_table'""")
    is_table = cursor.fetchall()
    connection.close()
    assert len(is_table) != 0, 'Test failed movie table does not exist'


# Test if move table exists
def test_data_movie_table():
    connection = psycopg2.connect(database="dummy", user="admin",
                                  password="admin", host="localhost", port="5432")
    cursor = connection.cursor()
    cursor.execute("""DELETE FROM movie_table""")
    cursor.execute("""SELECT * FROM movie_table LIMIT 4""")
    is_data = cursor.fetchall()
    assert len(is_data) != 0, 'Test failed movie table is empty'


if __name__ == '__main__':
    pytest.main()
