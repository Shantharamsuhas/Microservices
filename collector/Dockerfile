FROM ubuntu
ADD data_collector.py /
ADD requirements.txt /


RUN apt-get update
RUN apt-get -y install python3
RUN apt-get install -y python3-pip
RUN pip3 install -r requirements.txt

ENV PORT 4321

EXPOSE 4321

ENTRYPOINT ["python3", "data_collector.py"]