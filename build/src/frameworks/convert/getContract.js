"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContract = void 0;
function getContract(providerContracts, contractName, version) {
    if (!providerContracts || !contractName || !version)
        throw new Error('Missing required arguments!');
    try {
        const contract = providerContracts.filter((providerContract) => Object.keys(providerContract)[0] === contractName)[0];
        if (!contract) {
            return;
        }
        return contract[contractName][version];
    }
    catch (error) {
        console.error(error);
    }
}
exports.getContract = getContract;
//# sourceMappingURL=getContract.js.map