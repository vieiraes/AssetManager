import express from 'express'
import { Request, Response } from 'express'
import { prisma } from '../libs/db'
import { v4 as uuidv4 } from 'uuid';
import { IAsset } from '../interfaces/IAsset';
import { IWallet } from '../interfaces/IWallet';
import { AssetEnum } from '../enums/asset.enum';
import { handleError } from '../libs/utils/handleError';

const router = express.Router()

router.post('/', async (req: Request, res: Response) => {
    try {
        const { ticker, walletId }: { walletId: string, ticker: string } = req.body
        const { isRootAsset }: { isRootAsset: boolean } = req.body
        !ticker || !walletId ? handleError(res, 400, "walletId or ticker is required") : undefined
        !(ticker in AssetEnum) ? handleError(res, 400, "ticker is not valid") : undefined

        const walletReturn: IWallet | null = await prisma.wallet.findUnique({
            where: {
                id: walletId
            }
        })
        !walletReturn ? handleError(res, 404, "wallet not found") : undefined


        const checkAsset: IAsset | null = await prisma.asset.findFirst({
            where: {
                walletId: walletId,
                ticker: ticker
            }
        })

        if (checkAsset) {
            handleError(res, 412, "asset already exists on the wallet")
            return
        }

        if (!checkAsset && walletReturn) {
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
            assetCreated
            res.status(201).send(assetCreated)
        }
    } catch (error) {
        console.error('Error', error)
        res.status(400).send({
            "message": "Error",
            error
        })
    }
})


router.get('/', async (req: Request, res: Response) => {
    try {
        const assetReturn = await prisma.asset.findMany()
        res.status(200).send(assetReturn)
    } catch (error) {
        console.error(error)
        res.status(400).send({
            "message": "Error",
            error,
        })
        throw Error
    }
})


router.get("/:assetTicker", async (req: Request, res: Response) => {
    const assetTicker: string = req.params.assetTicker

    const assetReturn = await prisma.asset.findMany({
        where: {
            ticker: assetTicker
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    let totalBalance = assetReturn.reduce((accumulator, asset) => accumulator + (asset.balance).toNumber(), 0);
    // let formattedBalance: number = (totalBalance as any).toFixed(2) // vai ser necessario em breve para retirar as multiplas casas decimais

    const object = {
        ticker: assetTicker,
        totalBalance,
        assetReturn
    }

    res.status(200).send(object)
})
export { router }