#FROM nodeintegration/nginx-modsecurity
FROM nginx

RUN apt-get update && apt-get -y upgrade
RUN apt-get -y install python python-pip curl
RUN curl -sL https://deb.nodesource.com/setup_11.x | bash -
RUN apt-get install -y nodejs
RUN pip install staticjinja

COPY minizoo.conf /etc/nginx/conf.d/
COPY ./minizoo /usr/share/nginx
WORKDIR /usr/share/nginx

RUN mkdir output output-min
RUN npm i
RUN ./build.sh -m
