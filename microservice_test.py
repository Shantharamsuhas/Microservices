import psycopg2
import requests
import pytest
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to postgres sql database
def database_connection(database, user, password, host, port):
    conn = psycopg2.connect(database=database, user=user,
                            password=password, host=host, port=port)
    return conn.closed

#check if all the microservices are online
# visualiser microservice
"""
1. Collector:4321
2. Database:5432
3. Visualiser:8080
"""

def check_status(service ,url):
    status = False
    try:
       if service == "Database":
           if database_connection(os.getenv('DATABASE'), os.getenv('USER'), os.getenv('PASSWORD') ,os.getenv('HOST'), os.getenv('PORT')) == 0:
               status = True
       else:
        response = requests.get(url)
        if(response.status_code == 200):
            if(response.json()['status'] == 'success'):
                status = True
    except:
        status = False
    print(service, "is", "" if status else "Not", "Working" )
    return status


services = {"Collector" : "http://localhost:4321/api/check-status",
"Database" : "http://localhost:5432",
"Visualiser" : "http://localhost:8080/api/check-status"}


def test_microservices_status():
    running = True
    for service, url in services.items():
        if not check_status(service, url):
            running = False
    assert running

if __name__ == '__main__':
    pytest.main()
