import { IWallet } from "./IWallet"

export interface IUser {
    id?: string,
    name: string,
    taxId: string,
    createdAt?: Date | string,
    wallets?: IWallet[]
}