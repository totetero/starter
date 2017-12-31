#!/bin/bash

[ $# -eq 0 ] && sh $0 help && exit
[ $# -eq 1 ] && [ $1 = "first" ] && sh $0 create start install put setup && exit
[ $# -eq 1 ] && [ $1 = "last" ] && sh $0 stop clear && exit

DOCKER_NETWORK_NAME=docker-starter-phoenix-network
DOCKER_CONTAINER_NAME_01=docker-starter-phoenix-main
DOCKER_CONTAINER_NAME_02=docker-starter-phoenix-db
DOCKER_ELIXIR=elixir:1.5.3-slim
DOCKER_MYSQL=mysql:5.7.20
GIT_PHOENIX=https://github.com/phoenixframework/archives/raw/master/phoenix_new-1.2.5.ez
MYSQL_DATABASE=test_dev
MYSQL_ROOT_PASSWORD=mysql
PROJECT=test

for ARG in "$@" ; do
	# 引数解釈
	case $ARG in
		status)
			docker network ls && echo '--------' && docker images && echo '--------' && docker ps -a
			;;
		create)
			docker network create ${DOCKER_NETWORK_NAME}
			docker create --network ${DOCKER_NETWORK_NAME} --name ${DOCKER_CONTAINER_NAME_01} --publish 4000:4000 --interactive --tty ${DOCKER_ELIXIR} /bin/bash --login
			docker create --network ${DOCKER_NETWORK_NAME} --name ${DOCKER_CONTAINER_NAME_02} --publish 3306:3306 --env MYSQL_DATABASE=${MYSQL_DATABASE} --env MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} ${DOCKER_MYSQL}
			[ $? -gt 0 ] && exit
			;;
		start)
			docker start ${DOCKER_CONTAINER_NAME_01}
			docker start ${DOCKER_CONTAINER_NAME_02}
			;;
		bash)
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash
			;;
		mysql)
			DOCKER_HOSTIP=$(docker inspect -f '{{(index (index .NetworkSettings.Ports "3306/tcp") 0).HostIp}}' ${DOCKER_CONTAINER_NAME_02})
			mysql -h ${DOCKER_HOSTIP} -uroot -p${MYSQL_ROOT_PASSWORD}
			;;
		stop)
			docker stop ${DOCKER_CONTAINER_NAME_01}
			docker stop ${DOCKER_CONTAINER_NAME_02}
			;;
		clear)
			docker network rm ${DOCKER_NETWORK_NAME}
			docker rm ${DOCKER_CONTAINER_NAME_01}
			docker rm ${DOCKER_CONTAINER_NAME_02}
			;;
		install)
			echo -------- install apt-get --------
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get update'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends wget'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends rsync'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends mysql-client'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends inotify-tools'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends nodejs npm'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'npm cache clean'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'npm install n -g'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'n v9.3.0'
			docker exec -i -t ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'ln -s /usr/local/bin/node /usr/bin/node'
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
			echo create or status or start or install or put or get or setup or serve or browse or bash or mysql or stop or clear
			;;
	esac
done

