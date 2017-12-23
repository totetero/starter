#!/bin/bash

[ $# -eq 0 ] && sh $0 help && exit
[ $# -eq 1 ] && [ $1 = "setup" ] && sh $0 create start install put && exit

DOCKER_CONTAINER_NAME_01=docker-starter-elixir-main
DOCKER_ELIXIR=elixir:1.5.3-slim
PROJECT=src

for ARG in "$@" ; do
	# 引数解釈
	case $ARG in
		status)
			docker images && echo '--------' && docker ps -a
			;;
		create)
			docker create --interactive --tty --name ${DOCKER_CONTAINER_NAME_01} ${DOCKER_ELIXIR} /bin/bash --login
			[ $? -gt 0 ] && exit
			;;
		start)
			docker start ${DOCKER_CONTAINER_NAME_01}
			;;
		bash)
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash
			;;
		stop)
			docker stop ${DOCKER_CONTAINER_NAME_01}
			;;
		clear)
			docker rm ${DOCKER_CONTAINER_NAME_01}
			;;
		install)
			echo -------- install init --------
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get update'
			echo -------- install rsync --------
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y rsync'
			echo -------- install make --------
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y build-essential'
			echo -------- finish install --------
			;;
		make)
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'cd /root/'${PROJECT}' && make'
			;;
		sync_put|put)
			echo -------- rsync --------
			rsync --blocking-io -e 'docker exec -i' -rltDv ${PROJECT}/ ${DOCKER_CONTAINER_NAME_01}:/root/${PROJECT}/
			echo -------- finish sync put --------
			;;
		sync_get|get)
			echo -------- rsync --------
			rsync --blocking-io -e 'docker exec -i' -rltDv ${DOCKER_CONTAINER_NAME_01}:/root/${PROJECT}/ ${PROJECT}/
			echo -------- finish sync get --------
			;;
		help)
			echo create or status or start or install or put or get or bash or make or stop or clear
			;;
	esac
done

