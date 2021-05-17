####################################################
#  Merge GCP/AWS schemas with your contracts file  #
####################################################
# This will produce a new file with the merged output
# You will need to have jq installed!
# Variable $1 will be the path to your contracts file
# Variable $2 will be the folder name of your generated schemas

function mergeSchemas() {
  echo "Merging schemas..."
  jq --slurp  'map(.[])' $1 $2 >> merged-schemas.json
}

if [ -z "$1" ] && [ -z "$2" ]; then
echo "ERROR! Please provide the path to your existing contracts file and the folder where your generated schemas reside, like this: `sh merge-schemas.sh existing-contracts-file.json generated-contracts-folder`";
else mergeSchemas $1 $2/*.json
fi