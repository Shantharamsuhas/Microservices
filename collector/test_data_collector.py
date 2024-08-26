import pytest
import requests
from data_collector import rating_download_data, movies_download_data, database_connection, create_rating_table, load_rating_table, create_movie_table, load_movie_table

''' TEST DRIVEN DEVELOPMENT 
    Unit test scripts for data_Collector.py '''


# Test if data has been successfully downloaded from IMDb website
def test_rating_data_download():
    rating_data = rating_download_data(
        "https://datasets.imdbws.com/title.ratings.tsv.gz")
    assert rating_data is not None, 'Test passed: Data successfully downloaded'

# Check the connection
def test_imdb_connection():
    res = requests.get("https://datasets.imdbws.com/title.ratings.tsv.gz").status_code
    return res == 200

def test_movielens_connection():
    res = requests.get("http://files.grouplens.org/datasets/movielens/ml-latest-small.zip").status_code
    return res == 200


# Test if data has been successfully downloaded from IMDb website
def test_movies_data_download():
    movie_data = movies_download_data(
        "https://datasets.imdbws.com/title.basics.tsv.gz")
    assert movie_data is not None, 'Test passed: Data successfully downloaded'


# # Test if db connection is successfully established or not
def test_db_connection():
    try:
        conn = database_connection()
        return conn.closed == 0
    except:
        return False

# # Test if rating table is created
def test_rating_table_exists():
    is_table = create_rating_table()
    assert len(is_table) != 0, 'Test passed rating table exists'


# # Test if rating table has data
def test_data_rating_table():
    has_data = load_rating_table()
    assert len(has_data) != 0, 'Test passed rating table has data'


# Test if movie table is created
def test_movie_table_exists():
    is_table = create_movie_table()
    assert len(is_table) != 0, 'Test passed rating table exists'


# Test if movie table has data
def test_data_movie_table():
    is_data = load_movie_table()
    assert len(is_data) != 0, 'Test passed rating table has data'

def unit_test():
    tests = {}
    tests["IMDB Connection:"] = test_imdb_connection()
    tests["MovieLens Connection:"] = test_movielens_connection()
    tests["Database Connection:"] = test_db_connection()
    print("Found", len(tests), "tests..." )
    for test, result in tests.items():
        print(test, "PASSED" if result else "FAILED")
    print(sum(tests.values()), "out of", len(tests.values()), "tests passed." )
    return all(tests.values())


if __name__ == '__main__':
    pytest.main()
