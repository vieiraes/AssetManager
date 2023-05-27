import { Decimal } from "@prisma/client/runtime"
import { IWallet } from "./IWallet"

export interface IAsset{
    id?: string,
    ticker: string,
    balance: Decimal,
    createdAt?: Date | string,
    walletId?: string,
    rootAsset?: boolean
}