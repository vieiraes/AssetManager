import { IUser } from './IUser'
import { IAsset } from './IAsset'

export interface IWallet {
    id?: string,
    createdAt?: Date | string,
    userId: string,
    assets?: [] | IAsset[]
}
