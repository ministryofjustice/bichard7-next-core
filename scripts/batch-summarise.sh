#!/usr/bin/env bash

INPUT_FILE=$1
outdir="./summary"
cache_dir=/tmp/comparison

rm -rf $outdir
mkdir -p $outdir

while read line; do
  echo $line
  summary=${line/json/summary.txt}
  summary=${summary/s3:\/\/bichard-7-production-processing-validation\//}
  outfile=${summary//\//-}
  NO_OPEN=true npm run -w packages/core compare:summarise $line
  echo $'\n\nCore Comparison\n======================================================\n' >> $cache_dir/$summary
  echo $line >> $cache_dir/$summary
  npm run -w packages/core --silent compare -- -c -f $line > /dev/null
  COMPARISON_RESULT=$?
  if [ $COMPARISON_RESULT == 0 ]
  then
    echo "AHO XML Comparison matches" >>  $cache_dir/$summary
  else
    echo $'AHO XML Comparison does not match\n' >>  $cache_dir/$summary
    npm run -w packages/core --silent compare -- -c -x -f $line >> $cache_dir/$summary
  fi
  cp $cache_dir/$summary $outdir/$outfile
done < "$INPUT_FILE"
