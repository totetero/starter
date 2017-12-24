#!/bin/bash

[ $# -eq 0 ] && sh $0 help && exit
[ $# -eq 1 ] && [ $1 = "first" ] && sh $0 create start install put setup && exit
[ $# -eq 1 ] && [ $1 = "last" ] && sh $0 stop clear && exit

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
			echo -------- install apt-get --------
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get update'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends rsync'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends nodejs npm'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends mysql-client'
			echo -------- install mix --------
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'yes | mix local.hex'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'yes | mix local.rebar'
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
		setup)
			echo -------- setup --------
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} bash -c 'cd /root/'${PROJECT}' && mix deps.get'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} bash -c 'cd /root/'${PROJECT}' && npm install'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} bash -c 'cd /root/'${PROJECT}' && npm install ./deps/phoenix'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} bash -c 'cd /root/'${PROJECT}' && npm install ./deps/phoenix_html'
			echo -------- finish setup --------
			;;
		serve)
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} bash -c 'cd /root/'${PROJECT}' && mix phoenix.server'
			;;
		browse)
			DOCKER_IP=$(docker inspect -f '{{.NetworkSettings.IPAddress}}' ${DOCKER_CONTAINER_NAME_01})
			DOCKER_HOSTIP=$(docker inspect -f '{{(index (index .NetworkSettings.Ports "4000/tcp") 0).HostIp}}' ${DOCKER_CONTAINER_NAME_01})
			DOCKER_HOSTPORT=$(docker inspect -f '{{(index (index .NetworkSettings.Ports "4000/tcp") 0).HostPort}}' ${DOCKER_CONTAINER_NAME_01})
			open http://${DOCKER_HOSTIP}:${DOCKER_HOSTPORT}
			;;
		help)
			echo create or status or start or install or put or get or setup or serve or browse or bash or stop or clear
			;;
	esac
done

