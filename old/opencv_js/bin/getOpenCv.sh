#!/bin/bash

DIR=$(cd $(dirname $0)/../src; pwd)
curl https://docs.opencv.org/3.4.0/opencv.js > ${DIR}/opencv.js
curl https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml > ${DIR}/haarcascade_frontalface_default.xml
curl https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_eye.xml > ${DIR}/haarcascade_eye.xml

