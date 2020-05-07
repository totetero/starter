FROM ubuntu:20.04

WORKDIR /root/project/opencv_python
COPY . /root/project/opencv_python

ENV DEBIAN_FRONTEND noninteractive

RUN \
apt-get update && \
apt-get install -y rsync && \
apt-get install -y wget && \
apt-get install -y python3 && \
apt-get install -y python3-pip && \
apt-get install -y python3-setuptools && \
apt-get install -y libopencv-dev && \
apt-get install -y cmake

RUN \
pip3 install numpy && \
pip3 install opencv-python && \
pip3 install dlib

RUN \
mkdir -p dat && \
cd dat && \
wget http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2 && \
bunzip2 shape_predictor_68_face_landmarks.dat.bz2