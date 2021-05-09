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
            if (service === includeService.split('@')[0]) {
                const versions = Object.keys(item[service]);
                versions.forEach((version) => {
                    const currentServiceVersion = `${service}@${version}`;
                    if (includeService === currentServiceVersion &&
                        !included.includes(currentServiceVersion)) {
                        if (!cleanedData[service])
                            cleanedData[service] = {};
                        cleanedData[service][version] = item[service][version];
                        included.push(currentServiceVersion);
                    }
                });
            }
        });
    });
    return [cleanedData];
}
exports.clean = clean;
//# sourceMappingURL=clean.js.map