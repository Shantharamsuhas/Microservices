FROM ubuntu
ADD data_collector.py /
ADD test_data_collector.py /
ADD requirements.txt /


RUN apt-get update
RUN apt-get -y install python3
RUN apt-get install -y python3-pip
RUN pip3 install -r requirements.txt

ENV PORT 1111

EXPOSE 1111

ENTRYPOINT ["python3", "data_collector.py"]