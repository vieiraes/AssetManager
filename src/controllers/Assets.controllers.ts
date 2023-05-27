import express from 'express'
import { Request, Response } from 'express'
import { prisma } from '../libs/db'
import { v4 as uuidv4 } from 'uuid';
import { IAsset } from '../interfaces/IAsset';
import { IWallet } from '../interfaces/IWallet';
import { AssetEnum } from '../enums/asset.enum';

const router = express.Router()

router.post('/', async (req: Request, res: Response) => {
    try {
        const { ticker, walletId }: { walletId: string, ticker: string } = req.body
        const { isRootAsset }: { isRootAsset: boolean } = req.body

        let handleError = (res: Response, statusCode: number, message: string) => {
            res.status(statusCode).send({ message })
            console.error(message)
        }
        // !isRootAsset ? handleError(res, 400, "isRootAsset is required") : undefined
        !ticker || !walletId ? handleError(res, 400, "walletId or ticker is required") : undefined
        !(ticker in AssetEnum) ? handleError(res, 400, "ticker is not valid") : undefined

        const walletReturn: IWallet | null = await prisma.wallet.findUnique({
            where: {
                id: walletId
            }
        })
        !walletReturn ? handleError(res, 404, "wallet not found") : undefined

        if ((walletReturn?.assets as string[])?.includes(ticker)) {
            handleError(res, 412, "asset already exists on the wallet")
            return
        }

        const assetCreated: IAsset = await prisma.asset.create({
            data: {
                id: uuidv4(),
                ticker: ticker,
                balance: 0.00,
                createdAt: new Date().toISOString(),
                walletId: walletReturn ? walletReturn.id as string | any : undefined,
                rootAsset: isRootAsset
            }
        })
        res.status(201).send(assetCreated)
    } catch (error) {
        console.error('Error', error)
        res.status(400).send({
            "message": "Error",
            error
        })
        throw Error
    }
})

export { router }