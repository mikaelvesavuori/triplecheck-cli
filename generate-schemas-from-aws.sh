#####################################
# Sync schemas from AWS EventBridge #
#####################################
# Expects to be called like: sh generate-schemas-from-aws.sh my-registry-name
# Variable $1 will be the registry name
# You will need to have AWS CLI v2 installed for this to work

function generateSchemasFromAwsEventbridge() {
  # Get all schemas
  aws schemas list-schemas --registry-name demo-registry >> aws-schemas.json

  # Create schema files for all schemas stored in EventBridge
  for schema in $(jq '.Schemas[].SchemaName' -r aws-schemas.json); do
    _SCHEMA_NAME_=$(echo $schema)
    echo "--> Generating contract for schema: $_SCHEMA_NAME_"

    aws schemas describe-schema --registry-name $1 --schema-name $_SCHEMA_NAME_ > __temp__.json

    _SCHEMA_NAME_=$(jq '.SchemaName' -r __temp__.json)
    _SCHEMA_VERSION_=$(jq '.SchemaVersion' -r __temp__.json)
    _SCHEMA_CONTENT_=$(jq '.Content' -r __temp__.json)
    rm __temp__.json

    jq --null-input \
      --arg name "$_SCHEMA_NAME_" \
      --arg version "$_SCHEMA_VERSION_" \
      --argjson content "$_SCHEMA_CONTENT_" \
      '[{($name): {"\($version).0.0": ($content) }}]' >> $_SCHEMA_NAME_@$_SCHEMA_VERSION_.0.0.contract.json
  done

  rm aws-schemas.json
}

if [ -z "$1" ];
then echo "ERROR! Please provide a registry name, like this: `sh generate-schemas-from-aws.sh my-registry-name`";
else generateSchemasFromAwsEventbridge $1
fi