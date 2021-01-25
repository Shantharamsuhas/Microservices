import pytest
from data_cleaner import database_connection, create_processed_movie_rating_table, load_processed_movie_rating_table


# Test if db connected
def test_db_connection():
    conn = database_connection()
    assert conn is not None, 'Test passed connected to database successfully'


# Test if rating table is created
def test_rating_table_exists():
    is_table = create_processed_movie_rating_table()
    assert len(is_table) != 0, 'Test passed rating table exists'


# Test if rating table has data
def test_data_rating_table():
    has_data = load_processed_movie_rating_table()
    assert len(has_data) != 0, 'Test passed rating table has data'


# run the file
if __name__ == '__main__':
    # pytest.main()
