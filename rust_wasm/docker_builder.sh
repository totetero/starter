#!/bin/bash

[ ${#} -eq 0 ] && sh ${0} help && exit
[ ${#} -eq 1 ] && [ ${1} = "first" ] && sh ${0} create start setup put install && exit
[ ${#} -eq 1 ] && [ ${1} = "second" ] && sh ${0} put build serve && exit
[ ${#} -eq 1 ] && [ ${1} = "last" ] && sh ${0} stop clear && exit

DOCKER_CONTAINER_NAME_01=docker-fuhaha-node-rust
DOCKER_IMAGE_LINUX=ubuntu
DOCKER_IMAGE_LINUX_TAG=18.04
PROJECT=${PWD##*/}

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
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'mkdir $HOME/project'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'touch $HOME/project/set.sh'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'echo "#!/bin/bash" >> $HOME/project/set.sh'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'echo "source $HOME/project/set.sh" >> $HOME/.bashrc'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get update'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get install -y rsync'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get install -y curl'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get install -y wget'
			echo -------------------------------- setup node --------------------------------
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get install -y nodejs'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get install -y npm'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'npm cache clean'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'npm install n -g'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'n v12.14.1'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt purge -y npm'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt purge -y nodejs'
			echo -------------------------------- setup rust --------------------------------
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'apt-get install -y build-essential'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'curl https://sh.rustup.rs -sSf | sh -s -- -y'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'echo "source $HOME/.cargo/env" >> $HOME/project/set.sh'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'source $HOME/project/set.sh && curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh -s -- -y'
			echo -------------------------------- setup finish --------------------------------
			;;
		sync_put|put)
			RSYNC_SRC=./
			RSYNC_DST=${DOCKER_CONTAINER_NAME_01}:/root/project/${PROJECT}/
			RSYNC_COMMAND="rsync --blocking-io -e 'docker exec -i' --exclude='.git' --filter=':- .gitignore' -rltDv"
			eval ${RSYNC_COMMAND} ${RSYNC_SRC} ${RSYNC_DST}
			;;
		sync_get|get)
			RSYNC_SRC=${DOCKER_CONTAINER_NAME_01}:/root/project/${PROJECT}/
			RSYNC_DST=./
			RSYNC_COMMAND="rsync --blocking-io -e 'docker exec -i' --exclude='.git' --filter=':- .gitignore' -rltDv"
			eval ${RSYNC_COMMAND} ${RSYNC_SRC} ${RSYNC_DST}
			;;
		setup_local|install)
			echo -------------------------------- install start --------------------------------
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'source $HOME/project/set.sh && cd $HOME/project/'${PROJECT}' && npm install'
			echo -------------------------------- install finish --------------------------------
			;;
		build)
			PACKAGE=$(awk -F "\"" '/name/{ print $2 }' crate/Cargo.toml) # Cargo.tomlにnameが複数あると困る
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'source $HOME/project/set.sh && cd $HOME/project/'${PROJECT}'/crate && wasm-pack build --dev'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'source $HOME/project/set.sh && cd $HOME/project/'${PROJECT}' && [ -e /node_modules/'${PACKAGE}' ] || ( cd crate/pkg && npm link )'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'source $HOME/project/set.sh && cd $HOME/project/'${PROJECT}' && [ -e /node_modules/'${PACKAGE}' ] || ( npm link '${PACKAGE}' )'
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'source $HOME/project/set.sh && cd $HOME/project/'${PROJECT}' && npm run build'
			;;
		serve)
			DOCKER_IP=$(docker inspect -f '{{.NetworkSettings.IPAddress}}' ${DOCKER_CONTAINER_NAME_01})
			DOCKER_HOSTIP=$(docker inspect -f '{{(index (index .NetworkSettings.Ports "8080/tcp") 0).HostIp}}' ${DOCKER_CONTAINER_NAME_01})
			DOCKER_HOSTPORT=$(docker inspect -f '{{(index (index .NetworkSettings.Ports "8080/tcp") 0).HostPort}}' ${DOCKER_CONTAINER_NAME_01})
			echo http://${DOCKER_HOSTIP}:${DOCKER_HOSTPORT}
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'source $HOME/project/set.sh && cd $HOME/project/'${PROJECT}' && npm run serve'
			;;
		clean)
			docker exec -it ${DOCKER_CONTAINER_NAME_01} /bin/bash -c 'rm -rf $HOME/project/'${PROJECT}'/src'
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
