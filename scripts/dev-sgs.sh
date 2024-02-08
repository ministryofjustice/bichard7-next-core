#!/bin/bash

apply_dev_sgs() {
	echo "Applying dev sgs to $1"
	BUILD_ID=$(aws-vault exec bichard7-shared -- aws codebuild start-build --no-cli-pager --project-name apply-dev-sgs-to-$1 | jq ".build.id" -r)
	echo "Build ID: ${BUILD_ID}"

	for i in {1..60}; do
		STATUS=$(aws-vault exec bichard7-shared -- aws codebuild batch-get-builds --ids $BUILD_ID | jq ".builds[0].buildStatus" -r)
		echo $STATUS
		if [ "$STATUS" = "SUCCEEDED" ]; then
			exit
		fi
		sleep 5
	done

}

while true; do
	read -p "Choose an environment (1 = e2e, 2 = preprod, 3 = prod, 4 = uat): " env
	case $env in
	[1]*)
		apply_dev_sgs "e2e-test"
		break
		;;
	[2]*)
		apply_dev_sgs "preprod"
		break
		;;
	[3]*)
		apply_dev_sgs "prod"
		break
		;;
	[4]*)
		apply_dev_sgs "uat"
		break
		;;

	*) echo "Please choose 1, 2, 3 or 4" ;;
	esac
done
