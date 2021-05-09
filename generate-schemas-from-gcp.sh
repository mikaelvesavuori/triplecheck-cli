#################################
# Sync schemas from GCP Pub/Sub #
#################################
# Expects to be called like: sh generate-schemas-from-gcp.sh
# You will need to have a recent gcloud CLI installed for this to work

function generateSchemasFromGcpPubSub() {
  # Get all schemas
  gcloud beta pubsub schemas list --format=json >> gcp-schemas.json

  echo "There is currently no way to get versions from GCP Pub/Sub schemas, so all schema versions will be set to 1.0.0..."

  # Create folder to contain generated schemas
  SCHEMA_FOLDER="generated-schemas-gcp"
  mkdir -p $SCHEMA_FOLDER

  # Create schema files for all schemas stored in Pub/Sub
  for schema in $(jq '.[].name' -r gcp-schemas.json); do
    _SCHEMA_VERSION_="1.0.0"
    _SCHEMA_NAME_=$(echo $schema | sed 's@.*/@@')
    echo "--> Generating contract for schema: $_SCHEMA_NAME_"

    gcloud beta pubsub schemas describe $schema --format=json | jq '.definition' -r >> __temp-data__.json

    _SCHEMA_CONTENT_=$(jq '.fields' __temp-data__.json)
    _SCHEMA_PROPERTY_NAMES_=$(echo $_SCHEMA_CONTENT_ | jq '[.[].name]')
    rm __temp-data__.json

    echo $_SCHEMA_CONTENT_ >> __temp-content__.json
    jq 'map({ (.name): . }) | add' __temp-content__.json >> __temp-mapped__.json
    jq 'walk(if type == "object" and has("name") then del(.name) else . end)' __temp-mapped__.json >> __temp-cleaned__.json
    _SCHEMA_PROPERTIES_=$(cat __temp-cleaned__.json)
    rm __temp-content__.json
    rm __temp-mapped__.json
    rm __temp-cleaned__.json

    jq --null-input \
      --arg name "$_SCHEMA_NAME_" \
      --arg version "$_SCHEMA_VERSION_" \
      --argjson propertyNames "$_SCHEMA_PROPERTY_NAMES_" \
      --argjson properties "$_SCHEMA_PROPERTIES_" \
      '[{($name): {($version): { required: ($propertyNames), properties: ($properties) }}}]' >> $SCHEMA_FOLDER/$_SCHEMA_NAME_@$_SCHEMA_VERSION_.contract.json
  done

  rm gcp-schemas.json
}

generateSchemasFromGcpPubSub