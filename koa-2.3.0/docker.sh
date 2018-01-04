#!/bin/bash

[ $# -eq 0 ] && sh $0 help && exit
[ $# -eq 1 ] && [ $1 = "first" ] && sh $0 create start install put setup && exit
[ $# -eq 1 ] && [ $1 = "last" ] && sh $0 stop clear && exit

DOCKER_CONTAINER_NAME_01=docker-starter-koa-main
DOCKER_NODE=node:9.3.0
PROJECT=test01

for ARG in "$@" ; do
	echo -------- $ARG start --------
	# 引数解釈
	case $ARG in
		status)
			docker network ls && echo '--------' && docker images && echo '--------' && docker ps -a
			;;
		create)
			docker create --name ${DOCKER_CONTAINER_NAME_01} --publish 8080:8080 --interactive --tty ${DOCKER_NODE} /bin/bash --login
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
		install)
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get update'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y rsync'
			;;
		sync_put|put)
			rsync --blocking-io -e 'docker exec -i' --exclude='.git' --filter=':- .gitignore' -rltDv ${PROJECT}/ ${DOCKER_CONTAINER_NAME_01}:/root/${PROJECT}/
			;;
		sync_get|get)
			rsync --blocking-io -e 'docker exec -i' --exclude='.git' --filter=':- .gitignore' -rltDv ${DOCKER_CONTAINER_NAME_01}:/root/${PROJECT}/ ${PROJECT}/
			;;
		setup)
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'cd /root/'${PROJECT}' && npm install'
			;;
		serve)
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'cd /root/'${PROJECT}' && npm run build && npm start'
			;;
		browse)
			DOCKER_IP=$(docker inspect -f '{{.NetworkSettings.IPAddress}}' ${DOCKER_CONTAINER_NAME_01})
			DOCKER_HOSTIP=$(docker inspect -f '{{(index (index .NetworkSettings.Ports "8080/tcp") 0).HostIp}}' ${DOCKER_CONTAINER_NAME_01})
			DOCKER_HOSTPORT=$(docker inspect -f '{{(index (index .NetworkSettings.Ports "8080/tcp") 0).HostPort}}' ${DOCKER_CONTAINER_NAME_01})
			open http://${DOCKER_HOSTIP}:${DOCKER_HOSTPORT}
			;;
		help)
			echo create or status or start or install or put or get or setup or serve or browse or bash or stop or clear
			;;
		*)
			echo nothing to do
	esac
	echo -------- $ARG exit --------
done

