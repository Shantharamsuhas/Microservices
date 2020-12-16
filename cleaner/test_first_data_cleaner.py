import pytest
import psycopg2


# Test DB connection
def test_db_connection():
    connection = None
    assert connection is not None, 'Test failed db is not connected'


# Test if rating table is created
def test_processed_rating_table_exists():
    connection = psycopg2.connect(database="dummy", user="admin",
                                  password="admin", host="localhost", port="5432")
    cursor = connection.cursor()
    cursor.execute("""DROP TABLE IF EXISTS cleaned_movie_rating_table""")
    cursor.execute("""SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 
    'cleaned_movie_rating_table'""")
    is_table = cursor.fetchall()
    connection.close()
    assert len(is_table) != 0, 'Test failed cleaned_movie_rating_table does not exist'


# Test if rating table has data
def test_data_rating_table():
    connection = psycopg2.connect(database="dummy", user="admin",
                                  password="admin", host="localhost", port="5432")
    cursor = connection.cursor()
    cursor.execute("""DELETE FROM cleaned_movie_rating_table""")
    cursor.execute("""SELECT * FROM cleaned_movie_rating_table LIMIT 4""")
    is_data = cursor.fetchall()
    assert len(is_data) != 0, 'Test failed cleaned_movie_rating_table is empty'


# run the file
if __name__ == '__main__':
    pytest.main()
