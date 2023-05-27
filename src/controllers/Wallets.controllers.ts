import express from 'express'
import { Request, Response } from 'express'
import { prisma } from '../libs/db'
import { v4 as uuidv4 } from 'uuid';
import { IWallet } from '../interfaces/IWallet';
import { IUser } from '../interfaces/IUser';
import { IAsset } from '../interfaces/IAsset';

const router = express.Router()


router.post('/', async (req: Request, res: Response) => {
    try {
        const { userId }: { userId: string } = req.body
        let handleError = (res: Response, statusCode: number, message: string) => {
            res.status(statusCode).send({ message })
            console.error(message)
        }
        if (!userId) {
            handleError(res, 400, "user reqeuired")
            return
        }
        const returnUser: IUser | null = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!returnUser) {
            handleError(res, 400, 'User not found')
            return
        }

        let newWalltId = uuidv4() as string
        let newAssetId = uuidv4() as string

        // const assetRoot: IAsset = await prisma.asset.create({
        //     data: {
        //         id: newAssetId,
        //         ticker: "BRL",
        //         balance: 0.00,
        //         createdAt: new Date().toISOString(),
        //         walletId: newWalltId,
        //         rootAsset: true
        //     }
        // })
        const findAsset = await prisma.asset.findFirst({
            where: {
                id: newAssetId
            }
        })
        // if (!findAsset) {
        //     handleError(res, 400, 'Error creating asset')
        //     return
        // }
        //TODO: continuar com a criacao de wallet
        const newWallet: IWallet = await prisma.wallet.create({
            data: {
                id: newWalltId,
                createdAt: new Date().toISOString(),
                userId: userId,
                assets: {
                    create: {
                        id: newAssetId,
                        ticker: "BRL",
                        balance: 0.00,
                        createdAt: new Date().toISOString(),
                        rootAsset: true
                    }
                }
            }
        })

        res.status(201).send({
            "message": "Wallet created",
            ...newWallet
        })
    } catch (error) {
        console.error('Error', error)
        res.status(400).send({
            "message": "Error",
            error
        })
        throw Error
    }
})

router.get('/', async (req: Request, res: Response) => {
    try {
        const walletsReturn = await prisma.wallet.findMany()
        res.status(200).send(walletsReturn)
    } catch (error) {
        res.status(400).send({
            "message": "Error",
            error
        })
        throw Error
    }
})

export { router }