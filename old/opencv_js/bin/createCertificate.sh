#!/bin/bash

COMMON_NAME=ssl_fuhaha_starter_opencv_js
DIR=$(cd $(dirname $0); pwd)/../dist
FILENAME1=${DIR}/${COMMON_NAME}.key
FILENAME2=${DIR}/${COMMON_NAME}.csr
FILENAME3=${DIR}/${COMMON_NAME}.crt

mkdir -p $DIR
openssl genrsa -out ${FILENAME1} 2048
openssl req -new -key ${FILENAME1} -out ${FILENAME2} -subj "/CN="${COMMON_NAME}
openssl x509 -req -signkey ${FILENAME1} -in ${FILENAME2} -out ${FILENAME3} -days 3650
rm ${FILENAME2}
