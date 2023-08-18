JSON_SCHEMA_SCRIPT=$(cat <<-END
import fs from "fs";
import { zodToJsonSchema } from "zod-to-json-schema";
import { annotatedHearingOutcomeSchema } from "./src/schemas/annotatedHearingOutcome";
fs.writeFileSync("aho.schema.json", JSON.stringify(zodToJsonSchema(annotatedHearingOutcomeSchema)));
END
)

echo $JSON_SCHEMA_SCRIPT | npx ts-node -T

if [[ "$(pip3 show json-schema-for-humans 1>/dev/null 2>/dev/null || echo $?)x" == "1x" ]]; then
  echo "Installing json-schema-for-humans..."
  pip3 install json-schema-for-humans
fi

generate-schema-doc aho.schema.json docs/aho.schema.html
rm aho.schema.json

echo "View the generated schema page at file://$(realpath docs/aho.schema.html)"