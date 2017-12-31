#!/bin/bash

[ $# -eq 0 ] && sh $0 help && exit
[ $# -eq 1 ] && [ $1 = "setup" ] && sh $0 create start install put && exit
[ $# -eq 1 ] && [ $1 = "last" ] && sh $0 stop clear && exit

DOCKER_CONTAINER_NAME_01=docker-starter-elixir-main
DOCKER_ELIXIR=elixir:1.5.3-slim
PROJECT=src

for ARG in "$@" ; do
	echo -------- $ARG start --------
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
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get update'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y rsync'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y build-essential'
			;;
		make)
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'cd /root/'${PROJECT}' && make'
			;;
		sync_put|put)
			rsync --blocking-io -e 'docker exec -i' -rltDv ${PROJECT}/ ${DOCKER_CONTAINER_NAME_01}:/root/${PROJECT}/
			;;
		sync_get|get)
			rsync --blocking-io -e 'docker exec -i' -rltDv ${DOCKER_CONTAINER_NAME_01}:/root/${PROJECT}/ ${PROJECT}/
			;;
		help)
			echo create or status or start or install or put or get or bash or make or stop or clear
			;;
		*)
			echo nothing to do
	esac
	echo -------- $ARG exit --------
done

