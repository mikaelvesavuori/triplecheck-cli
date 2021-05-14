"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = void 0;
const messages_1 = require("../../frameworks/text/messages");
function validateConfig(config) {
    if (!config)
        throw new Error('Missing config!');
    const isIdentityValid = validateIdentity(config.identity);
    if (!isIdentityValid) {
        console.error(messages_1.errorInvalidIdentity);
        return false;
    }
    if (!config.resources.local)
        console.warn(messages_1.warnPublishingWithNoLocals);
    if (config.resources.local) {
        const { contractsPath, testsPath } = config.resources.local;
        if (!contractsPath)
            console.warn(messages_1.warnMissingPathToLocalContracts);
        if (!testsPath)
            console.warn(messages_1.warnMissingPathToLocalTests);
    }
    if (!config.resources.remote)
        console.warn(messages_1.warnPublishingWithNoEndpoint);
    return true;
}
exports.validateConfig = validateConfig;
const validateIdentity = (identity) => {
    const nameRegex = /^[a-z]+(-[a-z]+)*$/;
    const versionRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    if (identity.name.match(nameRegex) && identity.version.match(versionRegex))
        return true;
    else
        return false;
};
//# sourceMappingURL=validateConfig.js.map