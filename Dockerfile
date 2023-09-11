# pull official base image
FROM python:3.11.5-slim-bookworm

RUN apt-get update && apt install -y build-essential python3-dev supervisor nginx
RUN apt install -y --fix-missing && apt install -y curl
RUN pip install uwsgi

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

# Supervisor and uWSGI setup
RUN cp /home/app/webapp/config/supervisor.conf /etc/supervisor/conf.d
RUN service supervisor stop
RUN service supervisor start

EXPOSE 8000

# Frontend and Nodejs
WORKDIR /home/app/webapp/dashboard
RUN apt-get update && apt-get install -y ca-certificates curl gnupg
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get install nodejs -y
RUN npm install
EXPOSE 4173
RUN npm run build
CMD npm run preview

# nginx
#EXPOSE 80
#RUN cp /home/app/webapp/config/localhost /etc/nginx/sites-enabled
#RUN service nginx stop
#RUN service nginx start
