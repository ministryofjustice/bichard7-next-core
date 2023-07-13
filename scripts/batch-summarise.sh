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
  NO_OPEN=true npm run compare:summarise $line
  echo $'\n\nCore Comparison\n======================================================' >> $cache_dir/$summary
  npm run --silent compare -- -c -x -f $line >> $cache_dir/$summary
  cp $cache_dir/$summary $outdir/$outfile
done < "$INPUT_FILE"
