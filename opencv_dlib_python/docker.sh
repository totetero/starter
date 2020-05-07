#!/bin/bash

[ ${#} -eq 0 ] && sh ${0} help && exit
[ ${#} -eq 1 ] && [ ${1} = "first" ] && sh ${0} create start && exit
[ ${#} -eq 1 ] && [ ${1} = "serve" ] && sh ${0} serve_address put serve && exit
[ ${#} -eq 1 ] && [ ${1} = "last" ] && sh ${0} stop clear && exit

DOCKER_CONTAINER=docker-fuhaha-opencv-python
DOCKER_IMAGE=docker-fuhaha-opencv-python
DOCKER_IMAGE_TAG=1
PROJECT=/root/project/opencv_python

for ARG in "${@}" ; do
	echo -------- ${ARG} start --------
	# 引数解釈
	case ${ARG} in
		status)
			docker network ls
			echo '--------'
			REGEXP='/'${DOCKER_IMAGE}'.*'${DOCKER_IMAGE_TAG}'/'
			docker images | awk '{ if ($0 ~ '${REGEXP}') { print "\033[0;31m" $0 "\033[0;39m" } else { print } }' -
			echo '--------'
			REGEXP='/'${DOCKER_CONTAINER}'/'
			docker ps -a | awk '{ if ($0 ~ '${REGEXP}') { print "\033[0;31m" $0 "\033[0;39m" } else { print } }' -
			;;
		create)
			docker build --tag ${DOCKER_IMAGE}:${DOCKER_IMAGE_TAG} .
			docker create --name ${DOCKER_CONTAINER} --publish 8080:8080 --interactive --tty ${DOCKER_IMAGE}:${DOCKER_IMAGE_TAG} /bin/bash --login
			[ ${?} -gt 0 ] && exit
			;;
		start)
			docker start ${DOCKER_CONTAINER}
			;;
		bash)
			docker exec -it ${DOCKER_CONTAINER} /bin/bash
			;;
		stop)
			docker stop ${DOCKER_CONTAINER}
			;;
		clear)
			docker rm ${DOCKER_CONTAINER}
			docker rmi ${DOCKER_IMAGE}:${DOCKER_IMAGE_TAG}
			;;
		sync_put|put)
			RSYNC_SRC=./
			RSYNC_DST=${DOCKER_CONTAINER}:${PROJECT}/
			RSYNC_COMMAND="rsync --blocking-io -e 'docker exec -i' --exclude='.git' --filter=':- .gitignore' -rltDv"
			eval ${RSYNC_COMMAND} ${RSYNC_SRC} ${RSYNC_DST}
			;;
		sync_get|get)
			RSYNC_SRC=${DOCKER_CONTAINER}:${PROJECT}/
			RSYNC_DST=./
			RSYNC_COMMAND="rsync --blocking-io -e 'docker exec -i' --exclude='.git' --filter=':- .gitignore' -rltDv"
			eval ${RSYNC_COMMAND} ${RSYNC_SRC} ${RSYNC_DST}
			;;
		serve)
			docker exec -it ${DOCKER_CONTAINER} /bin/bash -c 'source bin/profile.sh && python3 src/server.py'
			;;
		serve_address)
			DOCKER_IP=$(docker inspect -f '{{.NetworkSettings.IPAddress}}' ${DOCKER_CONTAINER})
			DOCKER_HOSTIP=$(docker inspect -f '{{(index (index .NetworkSettings.Ports "8080/tcp") 0).HostIp}}' ${DOCKER_CONTAINER})
			DOCKER_HOSTPORT=$(docker inspect -f '{{(index (index .NetworkSettings.Ports "8080/tcp") 0).HostPort}}' ${DOCKER_CONTAINER})
			echo http://${DOCKER_HOSTIP}:${DOCKER_HOSTPORT}
			;;
		clean)
			docker exec -it ${DOCKER_CONTAINER} /bin/bash -c 'source bin/profile.sh && rm -rf src'
			;;
		test)
			;;
		help)
			echo no help
			;;
		*)
			echo nothing to do
			;;
	esac
	echo -------- ${ARG} exit --------
done
