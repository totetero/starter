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
MYSQL_DATABASE=test01_dev
MYSQL_ROOT_PASSWORD=mysql
PROJECT=test01

for ARG in "$@" ; do
	echo -------- $ARG start --------
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
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash
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
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get update'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends wget'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends rsync'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends mysql-client'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends inotify-tools'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends nodejs npm'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'npm cache clean'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'npm install n -g'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'n v9.3.0'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'ln -s /usr/local/bin/node /usr/bin/node'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'yes | mix local.hex'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'yes | mix local.rebar'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'yes | mix archive.install '${GIT_PHOENIX}
			;;
		sync_put|put)
			rsync --blocking-io -e 'docker exec -i' --exclude='.git' --filter=':- .gitignore' -rltDv ${PROJECT}/ ${DOCKER_CONTAINER_NAME_01}:/root/${PROJECT}/
			;;
		sync_get|get)
			rsync --blocking-io -e 'docker exec -i' --exclude='.git' --filter=':- .gitignore' -rltDv ${DOCKER_CONTAINER_NAME_01}:/root/${PROJECT}/ ${PROJECT}/
			;;
		setup)
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'cd /root/'${PROJECT}' && mix deps.get'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'cd /root/'${PROJECT}' && npm install'
			;;
		serve)
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'cd /root/'${PROJECT}' && mix phoenix.server'
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
		*)
			echo nothing to do
	esac
	echo -------- $ARG exit --------
done

