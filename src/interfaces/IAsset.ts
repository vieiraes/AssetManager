import { IWallet } from "./IWallet"

export interface IAsset{
    id?: string,
    ticker: string,
    balance: number,
    createdAt?: Date | string,
    walletId: string
}