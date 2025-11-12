#!/usr/bin/env bash
set -e

echo "Skipping images: $SKIP_IMAGES"

LEGACY=${LEGACY:-"false"}
NOWORKER=${NOWORKER:-"false"}
SKIP_IMAGES=($SKIP_IMAGES)
SKIP_DOWNLOADS=${SKIP_DOWNLOADS:-"false"}
BUILD_WORKER=${BUILD_WORKER:-"false"}
SKIP_CONDUCTOR_SETUP=${SKIP_CONDUCTOR_SETUP:-"false"}

SERVICES_TO_RUN=($@)
IMAGES_TO_PULL=()

ALL_ECR_IMAGES=(beanconnect pncemulator)
PLATFORM=$(uname -m)
if [ $PLATFORM != "arm64" ]; then
    ALL_ECR_IMAGES+=(bichard7-liberty conductor nginx-auth-proxy ui)
fi

if [ ${#SERVICES_TO_RUN[@]} -eq 0 ]; then
    echo "No specific services requested, preparing to fetch all ECR images..."
    IMAGES_TO_PULL=("${ALL_ECR_IMAGES[@]}")
else
    echo "Services requested: ${SERVICES_TO_RUN[*]}"
    for service in "${SERVICES_TO_RUN[@]}"; do
        if [ "$service" == "pnc" ]; then
            IMAGES_TO_PULL+=("pncemulator")
            continue
        fi

        for ecr_image in "${ALL_ECR_IMAGES[@]}"; do
            if [ "$service" == "$ecr_image" ]; then
                IMAGES_TO_PULL+=("$service")
                break
            fi
        done
    done
fi

FILTERED_IMAGES=()
for image in "${IMAGES_TO_PULL[@]}"; do
  found=false
  for skip_image in "${SKIP_IMAGES[@]}"; do
    if [[ "$image" == "$skip_image" ]]; then
      echo "Skipping $image..."
      found=true
      break
    fi
  done

  if [[ "$found" == "false" ]]; then
    FILTERED_IMAGES+=("${image}")
  fi
done

IMAGES=("${FILTERED_IMAGES[@]}") # This is the final list

for image in "${IMAGES[@]}"; do
    if [[ $SKIP_DOWNLOADS == "false" && ("$CI" == "true" || "$(docker images -q $image 2> /dev/null)" == "") ]]; then
        echo "Fetching $image..."
        scripts/fetch-docker-image.sh $image
    fi
done

DOCKER_COMPOSE="docker compose --project-name bichard -f environment/docker-compose.yml"

if [ "$CI" == "true" ]; then
    if [ -f "environment/docker-compose.ci.yml" ]; then
        echo "CI environment detected, using environment/docker-compose.ci.yml override."
        DOCKER_COMPOSE="$DOCKER_COMPOSE -f environment/docker-compose.ci.yml"
    else
        echo "CI environment detected, but environment/docker-compose.ci.yml not found. Skipping."
    fi
fi

if [ "$LEGACY" == "true" ] || [ ${#SERVICES_TO_RUN[@]} -eq 0 ]; then

    if [ "$LEGACY" == "true" ]; then
        echo "LEGACY flag detected."
    else
        echo "No specific services requested ('all')."
    fi

    if [ -f "environment/docker-compose-bichard.yml" ]; then
         DOCKER_COMPOSE="${DOCKER_COMPOSE} -f environment/docker-compose-bichard.yml"
    fi

elif [ -f "environment/docker-compose-bichard.yml" ]; then
     if [ "$LEGACY" == "true" ]; then
        DOCKER_COMPOSE="${DOCKER_COMPOSE} -f environment/docker-compose-bichard.yml"
    fi
fi


# should run by default
if [ "$LEGACY" == "false" ] && [ "$NOWORKER" == "false" ]; then
    DOCKER_COMPOSE="${DOCKER_COMPOSE} -f environment/docker-compose-worker.yml"

    if [ "$BUILD_WORKER" == "true" ]; then
        eval "$DOCKER_COMPOSE build worker"
    fi
fi


echo "Setting up infrastructure"
eval "$DOCKER_COMPOSE up -d --wait $@"

SUCCESS=$?

if [ $SUCCESS -gt 0 ]; then
    echo ""
    echo "Failed to start"
    exit $SUCCESS
fi

if [ "$LEGACY" == "false" ] && [ $SUCCESS ] && [ "$SKIP_CONDUCTOR_SETUP" == "false" ]; then
    SUCCESS_CONDUCTOR="false"

    echo ""
    echo "Setting up conductor"

    npm run -w packages/conductor setup

    if [ $? -eq 0 ]; then
        echo ""
        echo "Success"
        SUCCESS_CONDUCTOR="true"
    fi

    if [ "$SUCCESS_CONDUCTOR" == "false" ]; then
        echo ""
        echo "Failed to setup Conductor"
        exit 1
    fi
fi
