#!/bin/bash

[ $# -eq 0 ] && sh $0 help && exit
[ $# -eq 1 ] && [ $1 = "setup" ] && sh $0 create start install put && exit

DOCKER_CONTAINER_NAME_01=docker-starter-phoenix-main
DOCKER_ELIXIR=elixir:1.5.3-slim
GIT_PHOENIX=https://github.com/phoenixframework/archives/raw/master/phoenix_new-1.2.5.ez
PROJECT=test

for ARG in "$@" ; do
	# 引数解釈
	case $ARG in
		status)
			docker images && echo '--------' && docker ps -a
			;;
		create)
			docker create --interactive --tty --publish 4000:4000 --name ${DOCKER_CONTAINER_NAME_01} ${DOCKER_ELIXIR} /bin/bash --login
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
			echo -------- install mix --------
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'yes | mix local.hex'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'yes | mix archive.install '${GIT_PHOENIX}
			echo -------- finish install --------
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
			echo create or status or start or install or put or get or bash or stop or clear
			;;
	esac
done

