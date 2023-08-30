# pull official base image
FROM python:3.11.5-slim-bookworm

# set work directory
RUN mkdir -p /home/app/webapp
WORKDIR /home/app/webapp

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY . /home/app/webapp
RUN pip install -r /home/app/webapp/ead_api/requirements.txt

# setup and start django server
WORKDIR /home/app/webapp/ead_api
RUN python manage.py makemigrations
RUN python manage.py migrate
EXPOSE 8000
CMD python manage.py runserver 0.0.0.0:8000
