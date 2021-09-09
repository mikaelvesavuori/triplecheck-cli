"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clean = void 0;
function clean(data, include) {
    let included = [];
    const cleanedData = {};
    include.forEach((includeService) => {
        const obj = {};
        data.forEach((item) => {
            const service = Object.keys(item)[0];
            if (service === includeService || service === includeService.split('@')[0]) {
                const versions = Object.keys(item[service]);
                versions.forEach((version) => {
                    const currentServiceVersion = `${service}@${version}`;
                    if (!included.includes(currentServiceVersion)) {
                        const includeServiceVersion = includeService.includes('@')
                            ? includeService.split('@')[1].replace('^', '')
                            : '';
                        if (!version.startsWith(includeServiceVersion))
                            return;
                        const requestedVersion = includeService.includes('^')
                            ? includeService.split('^')[1]
                            : version;
                        if (version >= requestedVersion) {
                            if (!cleanedData[service])
                                cleanedData[service] = {};
                            cleanedData[service][version] = item[service][version];
                            included.push(currentServiceVersion);
                        }
                    }
                });
            }
        });
    });
    return [cleanedData];
}
exports.clean = clean;
//# sourceMappingURL=clean.js.map