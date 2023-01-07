export type LoadedData = {
    consumerTests: {
        local: Record<string, unknown>[];
        remote: Record<string, unknown>[];
    };
    providerContracts: {
        local: Record<string, unknown>[];
        remote: Record<string, unknown>[];
    };
};
