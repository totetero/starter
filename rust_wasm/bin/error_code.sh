#!/bin/bash

ARRAY_LENGTH=${1:-1}

node -e '{
	console.log(Array('${ARRAY_LENGTH}').fill(0).map(_ => {
		const code = Math.floor(Math.random() * 0x10000).toString(16).toUpperCase();
		return `0000${code}`.slice(-4);
	}));
}'
