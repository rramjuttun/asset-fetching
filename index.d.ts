export declare class Gateway {
    constructor(gateway: Location, accountAddress?: string, ethURI?: string);
    urlFromCid(ipfsHash: string): string;
    urlFromJsonEntry(jsonList: any, key: string): Promise<string>;
}