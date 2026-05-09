#!/bin/bash

[ $# -eq 0 ] && sh $0 help && exit
[ $# -eq 1 ] && [ $1 = "first" ] && sh $0 create start put && exit
[ $# -eq 1 ] && [ $1 = "last" ] && sh $0 stop clear && exit

DOCKER_CONTAINER_NAME_01=docker-starter-tensorflow-main
DOCKER_TENSORFLOW=tensorflow/tensorflow:1.4.1
PROJECT=test02

# makeコマンド このコマンドだけはオプションをつけることができる
[ ${#} -ge 1 ] && [ ${1} = "make" ] && {
	sh ${0} put
	MAKE_COMMAND="cd /root/${PROJECT}"
	MAKE_COMMAND+=" && make ${@:$((1 + 1))}"
	docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c "${MAKE_COMMAND}"
	exit
}

for ARG in "$@" ; do
	echo -------- $ARG start --------
	# 引数解釈
	case $ARG in
		status)
			docker network ls && echo '--------' && docker images && echo '--------' && docker ps -a
			;;
		create)
			docker create --name ${DOCKER_CONTAINER_NAME_01} --publish 8080:8080 --publish 8888:8888 --interactive --tty ${DOCKER_TENSORFLOW}
			[ $? -gt 0 ] && exit
			;;
		start)
			docker start ${DOCKER_CONTAINER_NAME_01}
			;;
		bash)
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash
			;;
		stop)
			docker stop ${DOCKER_CONTAINER_NAME_01}
			;;
		clear)
			docker rm ${DOCKER_CONTAINER_NAME_01}
			;;
		make)
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'cd /root/'${PROJECT}' && make'
			;;
		sync_put|put)
			rsync --blocking-io -e 'docker exec -i' --exclude='.git' --filter=':- .gitignore' -rltDv ${PROJECT}/ ${DOCKER_CONTAINER_NAME_01}:/root/${PROJECT}/
			;;
		sync_get|get)
			rsync --blocking-io -e 'docker exec -i' --exclude='.git' --filter=':- .gitignore' -rltDv ${DOCKER_CONTAINER_NAME_01}:/root/${PROJECT}/ ${PROJECT}/
			;;
		help)
			echo create or status or start or put or get or bash or make or stop or clear
			;;
		*)
			echo nothing to do
	esac
	echo -------- $ARG exit --------
done

