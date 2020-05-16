#!/bin/bash

[ ${#} -eq 0 ] && sh ${0} help && exit
[ ${#} -eq 1 ] && [ ${1} = "first" ] && sh ${0} create start && exit
[ ${#} -eq 1 ] && [ ${1} = "second" ] && sh ${0} serve_address put build_pack serve_once && exit
[ ${#} -eq 1 ] && [ ${1} = "ts" ] && sh ${0} put build_ts && exit
[ ${#} -eq 1 ] && [ ${1} = "rs" ] && sh ${0} put build_rs && exit
[ ${#} -eq 1 ] && [ ${1} = "last" ] && sh ${0} stop clear && exit

NAME1=fuhaha
NAME2=starter-rust-wasm
DOCKER_CONTAINER=${NAME1}-ctr-${NAME2}
DOCKER_IMAGE=${NAME1}-img-${NAME2}
DOCKER_IMAGE_TAG=1.0.0
PORT_OUTER=8080
PORT_INNER=8080

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
			docker build --tag ${DOCKER_IMAGE}:${DOCKER_IMAGE_TAG} --force-rm .
			[ ${?} -gt 0 ] && exit
			docker create --name ${DOCKER_CONTAINER} --publish ${PORT_OUTER}:${PORT_INNER} --interactive --tty ${DOCKER_IMAGE}:${DOCKER_IMAGE_TAG} /bin/bash --login
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
			RSYNC_DST=${DOCKER_CONTAINER}:/root/project/workspace/
			RSYNC_COMMAND="rsync --blocking-io -e 'docker exec -i' --exclude='.git' --filter=':- .gitignore' -rltDv"
			eval ${RSYNC_COMMAND} ${RSYNC_SRC} ${RSYNC_DST}
			;;
		sync_get|get)
			RSYNC_SRC=${DOCKER_CONTAINER}:/root/project/workspace/
			RSYNC_DST=./
			RSYNC_COMMAND="rsync --blocking-io -e 'docker exec -i' --exclude='.git' --filter=':- .gitignore' -rltDv"
			eval ${RSYNC_COMMAND} ${RSYNC_SRC} ${RSYNC_DST}
			;;
		install)
			docker exec -it ${DOCKER_CONTAINER} /bin/bash -c 'source bin/profile.sh && npm install'
			;;
		build_ts)
			docker exec -it ${DOCKER_CONTAINER} /bin/bash -c 'source bin/profile.sh && npm run build_ts'
			;;
		build_rs)
			docker exec -it ${DOCKER_CONTAINER} /bin/bash -c 'source bin/profile.sh && npm run build_rs'
			;;
		build_pack)
			docker exec -it ${DOCKER_CONTAINER} /bin/bash -c 'source bin/profile.sh && npm run build_pack'
			# TODO ビルド失敗したらここで止めたい google先生「docker exec 返値」 https://qiita.com/udzura/items/cf0fb8322bb616a733a2
			;;
		serve_once)
			docker exec -it ${DOCKER_CONTAINER} /bin/bash -c 'source bin/profile.sh && npm run serve_once'
			;;
		serve_watch)
			docker exec -it ${DOCKER_CONTAINER} /bin/bash -c 'source bin/profile.sh && npm run serve_watch'
			;;
		serve_address)
			DOCKER_IP=$(docker inspect -f '{{.NetworkSettings.IPAddress}}' ${DOCKER_CONTAINER})
			DOCKER_HOSTIP=$(docker inspect -f '{{(index (index .NetworkSettings.Ports "'${PORT_INNER}'/tcp") 0).HostIp}}' ${DOCKER_CONTAINER})
			DOCKER_HOSTPORT=$(docker inspect -f '{{(index (index .NetworkSettings.Ports "'${PORT_INNER}'/tcp") 0).HostPort}}' ${DOCKER_CONTAINER})
			echo http://${DOCKER_HOSTIP}:${DOCKER_HOSTPORT}
			;;
		clean)
			docker exec -it ${DOCKER_CONTAINER} /bin/bash -c 'source bin/profile.sh && rm -rf src'
			docker exec -it ${DOCKER_CONTAINER} /bin/bash -c 'source bin/profile.sh && rm -rf crate/src'
			docker exec -it ${DOCKER_CONTAINER} /bin/bash -c 'source bin/profile.sh && rm -rf node_modules'
			docker exec -it ${DOCKER_CONTAINER} /bin/bash -c 'source bin/profile.sh && rm -rf crate/target'
			docker exec -it ${DOCKER_CONTAINER} /bin/bash -c 'source bin/profile.sh && rm -rf crate/pkg'
			docker exec -it ${DOCKER_CONTAINER} /bin/bash -c 'source bin/profile.sh && rm -rf dist'
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
