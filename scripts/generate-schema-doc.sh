JSON_SCHEMA_SCRIPT=$(cat <<-END
import fs from "fs";
import { zodToJsonSchema } from "zod-to-json-schema";
import { annotatedHearingOutcomeSchema } from "./src/schemas/annotatedHearingOutcome";
import { incomingMessageParsedXmlSchema } from "./src/schemas/spiResult";
fs.writeFileSync("aho.schema.json", JSON.stringify(zodToJsonSchema(annotatedHearingOutcomeSchema)));
fs.writeFileSync("spi.schema.json", JSON.stringify(zodToJsonSchema(incomingMessageParsedXmlSchema)));
END
)

echo $JSON_SCHEMA_SCRIPT | npx ts-node -T

if [[ "$(which generate-schema-doc 1>/dev/null 2>/dev/null || echo $?)x" == "1x" ]]; then
  echo "Installing json-schema-for-humans..."
  pip3 install json-schema-for-humans
fi

OUTPUT_DIR="docs/schema"
SCHEMA_DOC_CONFIG="--config expand_buttons=true --config collapse_long_descriptions=false --config template_name=js"
generate-schema-doc $SCHEMA_DOC_CONFIG aho.schema.json $OUTPUT_DIR/aho.schema.html
generate-schema-doc $SCHEMA_DOC_CONFIG spi.schema.json $OUTPUT_DIR/spi.schema.html
rm aho.schema.json
rm spi.schema.json

echo "View the generated AHO schema page at file://$(realpath $OUTPUT_DIR/aho.schema.html)"
echo "View the generated SPI Result schema page at file://$(realpath $OUTPUT_DIR/spi.schema.html)"