export declare class Gateway {
    constructor(gateway: Location, accountAddress?: string, ethURI?: string);
    urlFromCid(ipfsHash: string): URL | null;
    urlFromJsonEntry(jsonList: any, key: string): Promise<string>;
}