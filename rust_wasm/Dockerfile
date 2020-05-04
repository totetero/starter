FROM ubuntu:20.04

WORKDIR /root/project/rust_wasm
COPY . /root/project/rust_wasm

ENV DEBIAN_FRONTEND noninteractive

RUN \
apt-get update && \
apt-get install -y rsync && \
apt-get install -y curl && \
apt-get install -y wget && \
apt-get install -y build-essential

RUN \
apt-get install -y nodejs && \
apt-get install -y npm && \
npm install n -g && \
n 12.14.1 && \
apt-get purge -y npm && \
apt-get purge -y nodejs

RUN \
curl https://sh.rustup.rs -sSf | sh -s -- -y && \
. $HOME/.cargo/env && \
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh -s -- -y

RUN \
npm install
