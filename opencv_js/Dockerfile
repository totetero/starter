FROM ubuntu:20.04

WORKDIR /root/project/opencv_js
COPY . /root/project/opencv_js

ENV DEBIAN_FRONTEND noninteractive

RUN \
apt-get update && \
apt-get install -y rsync && \
apt-get install -y curl && \
apt-get install -y wget && \
apt-get install -y build-essential && \
apt-get install -y python3 && \
apt-get install -y cmake && \
apt-get install -y git

RUN \
apt-get install -y nodejs && \
apt-get install -y npm && \
npm install n -g && \
n 12.14.1 && \
apt-get purge -y npm && \
apt-get purge -y nodejs

RUN \
mkdir -p /root/project/git && \
cd /root/project/git && \
git clone https://github.com/emscripten-core/emsdk.git && \
cd /root/project/git/emsdk && \
git checkout refs/tags/1.39.14 && \
./emsdk update-tags && \
./emsdk install 1.39.14 && \
./emsdk activate 1.39.14

RUN \
mkdir -p /root/project/git && \
cd /root/project/git && \
git clone https://github.com/opencv/opencv.git && \
cd /root/project/git/opencv && \
git checkout refs/tags/4.3.0

RUN \
npm install
