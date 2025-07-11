#!/usr/bin/env bash
set -e

LEGACY=${LEGACY:-"false"}
NOWORKER=${NOWORKER:-"false"}
SKIP_IMAGES=($SKIP_IMAGES)
SKIP_DOWNLOADS=${SKIP_DOWNLOADS:-"false"}
ENABLE_CORE_PHASE1=${ENABLE_CORE_PHASE1:-"false"}
BUILD_WORKER=${BUILD_WORKER:-"false"}

IMAGES=(beanconnect pncemulator)
SERVICES=$@

PLATFORM=$(uname -m)
if [ $PLATFORM != "arm64" ]; then
    IMAGES+=(bichard7-liberty conductor nginx-auth-proxy ui user-service)
fi

FILTERED_IMAGES=()
for image in "${IMAGES[@]}"; do
  found=false
  for skip_image in "${SKIP_IMAGES[@]}"; do
    if [[ "$image" == "$skip_image" ]]; then
      found=true
      break
    fi
  done

  if [[ "$found" == "false" ]]; then
    FILTERED_IMAGES+=("${image}")
  fi
done

IMAGES=("${FILTERED_IMAGES[@]}")

for image in "${IMAGES[@]}"; do
    if [[ $SKIP_DOWNLOADS == "false" && ("$CI" == "true" || "$(docker images -q $image 2> /dev/null)" == "") ]]; then
        echo "Fetching $image..."
        scripts/fetch-docker-image.sh $image
    fi
done


DOCKER_COMPOSE="docker compose --project-name bichard -f environment/docker-compose.yml"
if [ "$LEGACY" == "true" ]; then
    DOCKER_COMPOSE="ENABLE_CORE_PHASE1=false ${DOCKER_COMPOSE} -f environment/docker-compose-bichard.yml"
fi

# should run by default
if [ "$LEGACY" == "false" ] && [ "$NOWORKER" == "false" ]; then
    DOCKER_COMPOSE="ENABLE_CORE_PHASE1=$ENABLE_CORE_PHASE1 ${DOCKER_COMPOSE} -f environment/docker-compose-worker.yml"
    
    if [ "$BUILD_WORKER" == "true" ]; then
        eval "$DOCKER_COMPOSE build worker"
    fi
fi


[ "$CI" == "true" ] && ATTEMPTS=5 || ATTEMPTS=1
for i in $(seq 1 $ATTEMPTS); do
    echo "Setting up infrastructure"
    eval "$DOCKER_COMPOSE up -d --wait $SERVICES"

    SUCCESS=$?
    [ $SUCCESS ] && break

    if [ "$CI" == "true" ]; then
        eval "$DOCKER_COMPOSE down"
    fi
done;

if [ "$LEGACY" == "false" ] && [ $SUCCESS ]; then
    SUCCESS_CONDUCTOR="false"

    for i in $(seq 1 $ATTEMPTS); do
        if [ "$SUCCESS_CONDUCTOR" == "false" ]; then
            echo ""
            echo "Setting up conductor"

            npm run -w packages/conductor setup

            if [ $? -eq 0 ]; then
                echo ""
                echo "Success"
                SUCCESS_CONDUCTOR="true"
            fi

            sleep 5
        fi
    done;

    if [ "$SUCCESS_CONDUCTOR" == "false" ]; then
        echo ""
        echo "Failed to setup Conductor"
        exit 1
    fi
fi
