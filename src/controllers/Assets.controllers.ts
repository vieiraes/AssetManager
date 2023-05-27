import express from 'express'
import { Request, Response } from 'express'
import { prisma } from '../libs/db'
import { v4 as uuidv4 } from 'uuid';
import { IAsset } from '../interfaces/IAsset';
import { IWallet } from '../interfaces/IWallet';


enum AssetEnum {
    BTC = "BTC",
    BRL = 'BRL',
    USD = 'USD'
}

const router = express.Router()

router.post('/', async (req: Request, res: Response) => {
    try {
        const { ticker }: { ticker: string } = req.body
        const { walletId }: { walletId: string } = req.body
        
        let handleError = (res: Response, statusCode: number, message: string) => {
            res.status(statusCode).send({ message })
            console.error(message)
        }
        if (!ticker || !walletId) {
            handleError(res, 400, "walletId or ticker is required")
            return
        }
        if (!(ticker in AssetEnum)) {
            handleError(res, 400, "ticker is not valid")
            return
        }
        const walletReturn: IWallet | null = await prisma.wallet.findFirst({
            where: {
                id: walletId
            }
        })
        if ((walletReturn?.assets as string[])?.includes(ticker)) {
            handleError(res, 412, "asset already exists on the wallet")
            return
        }
        if (!walletReturn) {
            handleError(res, 404, "cannot create assset. walletId not found")
            return
        }


        const assetCreated: IAsset = await prisma.asset.create({
            data: {
                id: uuidv4(),
                ticker: ticker,
                balance: 0.00,
                createdAt: new Date().toISOString(),
                walletId: walletReturn.id as string,
                rootAsset: false
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