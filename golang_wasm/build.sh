#!/bin/bash

echo -------- build client
GOOS=js GOARCH=wasm go build -o dist/test.wasm src/main.go
echo -------- start server
go run serve.go
echo -------- finish
