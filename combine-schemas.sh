####################################################
# Combine GCP/AWS schemas with your contracts file #
####################################################
# sh combine-schemas.sh existing-contracts-file.json generated-contracts-folder
# You will need to have jq installed!
# Variable $1 will be the path to your contracts file
# Variable $1 will be the folder name of your generated schemas

function combineSchemas() {
  echo "Combining schemas..."
  jq --slurp  'map(.[])' $1 $2 >> combined-schemas.json
}

if [ -z "$1" ] && [ -z "$2" ]; then
echo "ERROR! Please provide the path to your existing contracts file and the folder where your generated schemas reside, like this: `sh combine-schemas.sh existing-contracts-file.json generated-contracts-folder`";
else combineSchemas $1 $2/*.json
fi