/**
 * @description Get a single contract from contracts data blob/string.
 */
export function getContract(providerContracts: any, contractName: string, version: string): any {
  if (!providerContracts || !contractName || !version)
    throw new Error('Missing required arguments!');
  try {
    // Get the matching provider contract for the provided consumer name
    const contract = providerContracts.filter(
      (providerContract: any) => Object.keys(providerContract)[0] === contractName
    )[0];
    if (!contract) return;
    return contract[contractName][version];
  } catch (error) {
    console.error(error);
  }
}
