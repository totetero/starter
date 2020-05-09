FROM ubuntu:20.04

WORKDIR /root/project/workspace
COPY . /root/project/workspace

ENV DEBIAN_FRONTEND noninteractive

RUN \
apt-get update && \
apt-get install -y rsync && \
apt-get install -y curl && \
apt-get install -y wget

RUN \
apt-get install -y nodejs && \
apt-get install -y npm && \
npm install n -g && \
n 12.14.1 && \
apt-get purge -y npm && \
apt-get purge -y nodejs

RUN \
mkdir -p /root/project/golang && \
cd /root/project/golang && \
wget https://dl.google.com/go/go1.14.2.linux-amd64.tar.gz && \
tar -zxvf go1.14.2.linux-amd64.tar.gz

RUN \
npm install
