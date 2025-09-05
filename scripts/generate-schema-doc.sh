#!/bin/bash

set -ex

JSON_SCHEMA_SCRIPT=$(cat <<-END
import * as z from "zod";
import { unvalidatedHearingOutcomeSchemaJson } from "./packages/common/schemas/unvalidatedHearingOutcomeJson";
import { incomingMessageParsedXmlSchema } from "./packages/common/schemas/spiResult";
const fs = require("fs");
fs.writeFileSync("aho.schema.json", JSON.stringify(z.toJSONSchema(unvalidatedHearingOutcomeSchemaJson)));
fs.writeFileSync("spi.schema.json", JSON.stringify(z.toJSONSchema(incomingMessageParsedXmlSchema)));
END
)

echo $JSON_SCHEMA_SCRIPT | npx ts-node -T

if [[ "$(command -v generate-schema-doc 1>/dev/null 2>/dev/null || echo $?)x" == "1x" ]]; then
  echo "Installing json-schema-for-humans..."
  pip3 install json-schema-for-humans
fi

AHO_OUTPUT_DIR="docs/schema/aho"
SPI_OUTPUT_DIR="docs/schema/spi"
mkdir -p $AHO_OUTPUT_DIR
mkdir -p $SPI_OUTPUT_DIR

SCHEMA_DOC_CONFIG="--config expand_buttons=true --config collapse_long_descriptions=false --config template_name=js"
generate-schema-doc $SCHEMA_DOC_CONFIG aho.schema.json $AHO_OUTPUT_DIR/index.html
generate-schema-doc $SCHEMA_DOC_CONFIG spi.schema.json $SPI_OUTPUT_DIR/index.html
rm aho.schema.json
rm spi.schema.json

echo "View the generated AHO schema page at file://$(realpath $AHO_OUTPUT_DIR/index.html)"
echo "View the generated SPI Result schema page at file://$(realpath $SPI_OUTPUT_DIR/index.html)"
