declare class Gateway {
    constructor(gateway: string, accountAddress?: string, ethURI?: string);
    urlFromCid(ipfsHash: string): URL | null;
    urlFromJsonEntry(jsonList: any[], key: string): Promise<string>;
}
  
export = Gateway;