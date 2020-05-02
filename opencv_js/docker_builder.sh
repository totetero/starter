#!/bin/bash

[ ${#} -eq 0 ] && sh ${0} help && exit
[ ${#} -eq 1 ] && [ ${1} = "first" ] && sh ${0} create start setup put install && exit
[ ${#} -eq 1 ] && [ ${1} = "ts" ] && sh ${0} put build_ts && exit
[ ${#} -eq 1 ] && [ ${1} = "serve" ] && sh ${0} serve_address put build_pack serve_once && exit
[ ${#} -eq 1 ] && [ ${1} = "ssl" ] && sh ${0} serve_address put build_pack serve_once_ssl && exit
[ ${#} -eq 1 ] && [ ${1} = "last" ] && sh ${0} stop clear && exit

DOCKER_CONTAINER_NAME_01=docker-fuhaha-opencv-js
DOCKER_IMAGE_LINUX=ubuntu
DOCKER_IMAGE_LINUX_TAG=18.04
NODE_VERSION=12.14.1
PROJECT=/root/project/${PWD##*/}
PROFILE=/root/project/profile.sh
PROFILE_EM=/root/project/profile_em.sh

for ARG in "${@}" ; do
	echo -------- ${ARG} start --------
	# 引数解釈
	case ${ARG} in
		status)
			docker network ls
			echo '--------'
			REGEXP='/'${DOCKER_IMAGE_LINUX}'.*'${DOCKER_IMAGE_LINUX_TAG}'/'
			docker images | awk '{ if ($0 ~ '${REGEXP}') { print "\033[0;31m" $0 "\033[0;39m" } else { print } }' -
			echo '--------'
			REGEXP='/'${DOCKER_CONTAINER_NAME_01}'/'
			docker ps -a | awk '{ if ($0 ~ '${REGEXP}') { print "\033[0;31m" $0 "\033[0;39m" } else { print } }' -
			;;
		create)
			IMAGE=${DOCKER_IMAGE_LINUX}:${DOCKER_IMAGE_LINUX_TAG}
			docker create --name ${DOCKER_CONTAINER_NAME_01} --publish 8080:8080 --interactive --tty ${IMAGE} /bin/bash --login
			[ ${?} -gt 0 ] && exit
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
		setup_global|setup)
			echo -------------------------------- setup start --------------------------------
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'mkdir -p '${PROJECT}'/dist'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'mkdir -p $(dirname '${PROFILE}')'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'touch '${PROFILE}
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'echo "#!/bin/bash" >> '${PROFILE}
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'echo "source '${PROFILE}'" >> $HOME/.bashrc'
			echo -------------------------------- setup apt --------------------------------
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get update'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get install -y rsync'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get install -y curl'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get install -y wget'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get install -y build-essential'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get install -y cmake'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get install -y git'
			echo -------------------------------- setup node --------------------------------
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get install -y nodejs'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get install -y npm'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'npm cache clean'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'npm install n -g'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'n '${NODE_VERSION}
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt purge -y npm'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt purge -y nodejs'
			echo -------------------------------- setup emsdk --------------------------------
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'mkdir -p /root/project/git'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'cd /root/project/git && git clone https://github.com/emscripten-core/emsdk.git'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'cd /root/project/git/emsdk && ./emsdk update'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'cd /root/project/git/emsdk && ./emsdk install latest'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'cd /root/project/git/emsdk && ./emsdk activate latest'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'mkdir -p $(dirname '${PROFILE_EM}')'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'touch '${PROFILE_EM}
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'echo "#!/bin/bash" >> '${PROFILE_EM}
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'echo "source /root/project/git/emsdk/emsdk_env.sh" >> '${PROFILE_EM}
			echo -------------------------------- setup opencv --------------------------------
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'cd /root/project/git && git clone https://github.com/opencv/opencv.git'
			echo -------------------------------- setup finish --------------------------------
			;;
		sync_put|put)
			RSYNC_SRC=./
			RSYNC_DST=${DOCKER_CONTAINER_NAME_01}:${PROJECT}/
			RSYNC_COMMAND="rsync --blocking-io -e 'docker exec -i' --exclude='.git' --filter=':- .gitignore' -rltDv"
			eval ${RSYNC_COMMAND} ${RSYNC_SRC} ${RSYNC_DST}
			;;
		sync_get|get)
			RSYNC_SRC=${DOCKER_CONTAINER_NAME_01}:${PROJECT}/
			RSYNC_DST=./
			RSYNC_COMMAND="rsync --blocking-io -e 'docker exec -i' --exclude='.git' --filter=':- .gitignore' -rltDv"
			eval ${RSYNC_COMMAND} ${RSYNC_SRC} ${RSYNC_DST}
			;;
		setup_local|install)
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'source '${PROFILE}' && cd '${PROJECT}' && npm install'
			;;
		build_cv)
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'source '${PROFILE_EM}' && cd /root/project/git/opencv && python ./platforms/js/build_js.py --emscripten_dir=${EMSDK}/upstream/emscripten --build_wasm build_wasm'
			rsync --blocking-io -e 'docker exec -i' ${DOCKER_CONTAINER_NAME_01}:/root/project/git/opencv/build_wasm/bin/opencv.js ./src
			rsync --blocking-io -e 'docker exec -i' ${DOCKER_CONTAINER_NAME_01}:/root/project/git/opencv/data/haarcascades/haarcascade_frontalface_default.xml ./src
			rsync --blocking-io -e 'docker exec -i' ${DOCKER_CONTAINER_NAME_01}:/root/project/git/opencv/data/haarcascades/haarcascade_eye.xml ./src
			;;
		build_ts)
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'source '${PROFILE}' && cd '${PROJECT}' && npm run build_ts'
			;;
		build_pack)
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'source '${PROFILE}' && cd '${PROJECT}' && npm run build_pack'
			# TODO ビルド失敗したらここで止めたい google先生「docker exec 返値」 https://qiita.com/udzura/items/cf0fb8322bb616a733a2
			;;
		serve_once)
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'source '${PROFILE}' && cd '${PROJECT}' && npm run serve_once'
			;;
		serve_once_ssl)
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'source '${PROFILE}' && cd '${PROJECT}' && npm run serve_once_ssl'
			;;
		serve_watch)
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'source '${PROFILE}' && cd '${PROJECT}' && npm run serve_watch'
			;;
		serve_address)
			DOCKER_IP=$(docker inspect -f '{{.NetworkSettings.IPAddress}}' ${DOCKER_CONTAINER_NAME_01})
			DOCKER_HOSTIP=$(docker inspect -f '{{(index (index .NetworkSettings.Ports "8080/tcp") 0).HostIp}}' ${DOCKER_CONTAINER_NAME_01})
			DOCKER_HOSTPORT=$(docker inspect -f '{{(index (index .NetworkSettings.Ports "8080/tcp") 0).HostPort}}' ${DOCKER_CONTAINER_NAME_01})
			echo http://${DOCKER_HOSTIP}:${DOCKER_HOSTPORT}
			;;
		clean)
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'source '${PROFILE}' && cd '${PROJECT}' && rm -rf src'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'source '${PROFILE}' && cd '${PROJECT}' && rm -rf node_modules'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'source '${PROFILE}' && cd '${PROJECT}' && rm -rf dist'
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
