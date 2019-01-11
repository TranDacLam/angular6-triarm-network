export class JSONResponse {

    success: boolean;
    result?: any;
    error?: {
        errorCode: number,
        errorMessage: string
    };
    extra?: any;
    issuerLatestRequest?: any;
    totalUser?: number;
    firstWallet?: boolean;
    assetCode?: string;
    qrData?: string;

    constructor({extra, firstWallet, issuerLatestRequest, totalUser, assetCode, qrData, success, result, error}: { extra?: any, firstWallet?: boolean, issuerLatestRequest?: any, totalUser?: number, assetCode?: string, qrData?: string, success: boolean, result?: any, error?: any }) {
        this.success = success;
        this.result = result;
        this.error = error;
        this.extra = extra;
        this.issuerLatestRequest = issuerLatestRequest;
        this.totalUser = totalUser;
        this.firstWallet = firstWallet;
        this.assetCode = assetCode;
        this.qrData = qrData;
    }
}
