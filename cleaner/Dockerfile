FROM ubuntu
ADD data_cleaner.py /
ADD requirements.txt /
ADD wait-for-it.sh /

RUN apt-get update
RUN apt-get -y install python3
RUN apt-get install -y python3-pip
RUN pip3 install -r requirements.txt


# ENTRYPOINT ["python3", "data_cleaner.py"]
RUN chmod +x /wait-for-it.sh