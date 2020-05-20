#!/bin/bash

[ ${#} -eq 0 ] && sh ${0} help && exit
[ ${#} -eq 1 ] && [ ${1} = "first" ] && sh ${0} create start && exit
[ ${#} -eq 1 ] && [ ${1} = "second" ] && sh ${0} serve_address put build_pack serve_once && exit
[ ${#} -eq 1 ] && [ ${1} = "ssl" ] && sh ${0} serve_address put build_pack serve_once_ssl && exit
[ ${#} -eq 1 ] && [ ${1} = "ts" ] && sh ${0} put build_ts && exit
[ ${#} -eq 1 ] && [ ${1} = "last" ] && sh ${0} stop clear && exit

BASE_NAME=fuhaha
TARGET1_NAME=starter-opencv-js
TARGET1_CONTAINER=${BASE_NAME}-ctr-${TARGET1_NAME}
TARGET1_IMAGE=${BASE_NAME}-img-${TARGET1_NAME}
TARGET1_IMAGE_TAG=1.0.0
TARGET1_PORT_OUTER=8080
TARGET1_PORT_INNER=8080

for ARG in "${@}" ; do
	echo -------- ${ARG} start --------
	# 引数解釈
	case ${ARG} in
		status)
			docker network ls
			echo '--------'
			REGEXP='/'${TARGET1_IMAGE}'.*'${TARGET1_IMAGE_TAG}'/'
			docker images | awk '{ if ($0 ~ '${REGEXP}') { print "\033[0;31m" $0 "\033[0;39m" } else { print } }' -
			echo '--------'
			REGEXP='/'${TARGET1_CONTAINER}'/'
			docker ps -a | awk '{ if ($0 ~ '${REGEXP}') { print "\033[0;31m" $0 "\033[0;39m" } else { print } }' -
			;;
		create)
			docker build --tag ${TARGET1_IMAGE}:${TARGET1_IMAGE_TAG} --force-rm .
			[ ${?} -gt 0 ] && exit
			docker create --name ${TARGET1_CONTAINER} --publish ${TARGET1_PORT_OUTER}:${TARGET1_PORT_INNER} --interactive --tty ${TARGET1_IMAGE}:${TARGET1_IMAGE_TAG} /bin/bash --login
			[ ${?} -gt 0 ] && exit
			;;
		start)
			docker start ${TARGET1_CONTAINER}
			;;
		bash)
			docker exec -it ${TARGET1_CONTAINER} /bin/bash
			;;
		stop)
			docker stop ${TARGET1_CONTAINER}
			;;
		clear)
			docker rm ${TARGET1_CONTAINER}
			docker rmi ${TARGET1_IMAGE}:${TARGET1_IMAGE_TAG}
			;;
		sync_put|put)
			RSYNC_SRC=./
			RSYNC_DST=${TARGET1_CONTAINER}:/root/project/workspace/
			RSYNC_COMMAND="rsync --blocking-io -e 'docker exec -i' --exclude='.git' --filter=':- .gitignore' -rltDv"
			eval ${RSYNC_COMMAND} ${RSYNC_SRC} ${RSYNC_DST}
			;;
		sync_get|get)
			RSYNC_SRC=${TARGET1_CONTAINER}:/root/project/workspace/
			RSYNC_DST=./
			RSYNC_COMMAND="rsync --blocking-io -e 'docker exec -i' --exclude='.git' --filter=':- .gitignore' -rltDv"
			eval ${RSYNC_COMMAND} ${RSYNC_SRC} ${RSYNC_DST}
			;;
		install)
			docker exec -it ${TARGET1_CONTAINER} /bin/bash -c 'source bin/profile.sh && npm install'
			;;
		build_cv)
			docker exec -it ${TARGET1_CONTAINER} /bin/bash -c 'source bin/profile_em.sh && cd /root/project/git/opencv && python3 ./platforms/js/build_js.py --emscripten_dir=${EMSDK}/upstream/emscripten --build_wasm build_wasm'
			rsync --blocking-io -e 'docker exec -i' ${TARGET1_CONTAINER}:/root/project/git/opencv/build_wasm/bin/opencv.js ./src
			rsync --blocking-io -e 'docker exec -i' ${TARGET1_CONTAINER}:/root/project/git/opencv/data/haarcascades/haarcascade_frontalface_default.xml ./src
			rsync --blocking-io -e 'docker exec -i' ${TARGET1_CONTAINER}:/root/project/git/opencv/data/haarcascades/haarcascade_eye.xml ./src
			;;
		build_ts)
			docker exec -it ${TARGET1_CONTAINER} /bin/bash -c 'source bin/profile.sh && npm run build_ts'
			;;
		build_pack)
			docker exec -it ${TARGET1_CONTAINER} /bin/bash -c 'source bin/profile.sh && npm run build_pack'
			# TODO ビルド失敗したらここで止めたい google先生「docker exec 返値」 https://qiita.com/udzura/items/cf0fb8322bb616a733a2
			;;
		serve_once)
			docker exec -it ${TARGET1_CONTAINER} /bin/bash -c 'source bin/profile.sh && npm run serve_once'
			;;
		serve_once_ssl)
			docker exec -it ${TARGET1_CONTAINER} /bin/bash -c 'source bin/profile.sh && npm run serve_once_ssl'
			;;
		serve_watch)
			docker exec -it ${TARGET1_CONTAINER} /bin/bash -c 'source bin/profile.sh && npm run serve_watch'
			;;
		serve_address)
			DOCKER_IP=$(docker inspect -f '{{.NetworkSettings.IPAddress}}' ${TARGET1_CONTAINER})
			DOCKER_HOSTIP=$(docker inspect -f '{{(index (index .NetworkSettings.Ports "'${TARGET1_PORT_INNER}'/tcp") 0).HostIp}}' ${TARGET1_CONTAINER})
			DOCKER_HOSTPORT=$(docker inspect -f '{{(index (index .NetworkSettings.Ports "'${TARGET1_PORT_INNER}'/tcp") 0).HostPort}}' ${TARGET1_CONTAINER})
			echo http://${DOCKER_HOSTIP}:${DOCKER_HOSTPORT}
			;;
		clean)
			docker exec -it ${TARGET1_CONTAINER} /bin/bash -c 'source bin/profile.sh && rm -rf src'
			docker exec -it ${TARGET1_CONTAINER} /bin/bash -c 'source bin/profile.sh && rm -rf node_modules'
			docker exec -it ${TARGET1_CONTAINER} /bin/bash -c 'source bin/profile.sh && rm -rf dist'
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
