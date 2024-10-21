#!/usr/bin/env bash

IGNORED_FILES=('.js' '.ts' '.sh' '.pdf' '.map' '.yml' '.sql' '.py' '.tsx' '.snap' '.feature' '.html' '.md')
SUSPICIOUS_DATA_PATTERN="AnnotatedHearingOutcome|PNCUpdateDataset|CXE01|CXU0|ResultedCaseMessage|PersonName|DeliverRequest"

STAGED_FILES=($(git --no-pager diff --cached --name-only --diff-filter=d HEAD))

BAD_FILES=()

is_ignored () {
  for IGNORE_PATTERN in ${IGNORED_FILES[*]}; do
    if [[ $1 == *"${IGNORE_PATTERN}" ]]; then
      return 0
    fi
  done
  if [[ $1 == *".mock."* ]]; then
    return 0
  fi
  return 1
}

has_suspicious_data () {
  grep -q -E $SUSPICIOUS_DATA_PATTERN $1
  return $?
}

for STAGED_FILE in ${STAGED_FILES[*]}; do
  if ! is_ignored $STAGED_FILE; then
    if has_suspicious_data $STAGED_FILE; then
      BAD_FILES+=($STAGED_FILE)
    fi
  fi
done
  
COUNT=${#BAD_FILES[@]}
if (( $COUNT > 0 )); then
  echo "Warning: Potentially sensitive data found in files:"

  for BAD_FILE in ${BAD_FILES[*]}; do
    echo $BAD_FILE;
  done
  exit 1
fi

echo "No potentially sensitive data found"
exit 0
