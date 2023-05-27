import express from 'express'
import { Request, Response } from 'express'
import { prisma } from '../libs/db'
import { v4 as uuidv4 } from 'uuid';
import { IWallet } from '../interfaces/IWallet';
import { IUser } from '../interfaces/IUser';
import { IAsset } from '../interfaces/IAsset';
import { AssetEnum } from '../enums/asset.enum';

const router = express.Router()


router.post('/', async (req: Request, res: Response) => {
    try {
        const { userId, asset }: { asset: string, userId: string } = req.body
        const { isRootAsset }: { isRootAsset: boolean } = req.body

        let handleError = (res: Response, statusCode: number, message: string) => {
            res.status(statusCode).send({ message })
            console.error(message)
        }
        !userId ? handleError(res, 400, "user is requised") : undefined
        !asset ? handleError(res, 400, "asset is required") : undefined
        !isRootAsset ? handleError(res, 400, "rootAsset is required") : undefined
        !(asset in AssetEnum) ? handleError(res, 400, "Asset not permitted") : undefined

        let returnUser: IUser | null = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })
        !returnUser ? handleError(res, 400, 'User not found') : undefined

        let newWalletId = uuidv4() as string
        let newAssetId = uuidv4() as string

        // const assetRoot: IAsset = await prisma.asset.create({
        //     data: {
        //         id: newAssetId,
        //         ticker: asset,
        //         balance: 0.00,
        //         createdAt: new Date().toISOString(),
        //         rootAsset: isRootAsset
        //     }
        // })
        // const findAsset = await prisma.asset.findUniqueOrThrow({
        //     where: {
        //         id: newAssetId
        //     }
        // })
        // if (!findAsset) {
        //     handleError(res, 400, 'Error creating asset')
        //     return
        // }

        //FUNCIONAL
        const newWallet: IWallet = await prisma.wallet.create({
            data: {
                id: newWalletId,
                createdAt: new Date().toISOString(),
                userId: userId,
                assets: {
                    create: {
                        id: newAssetId,
                        ticker: asset,
                        balance: 0.00,
                        createdAt: new Date().toISOString(),
                        rootAsset: isRootAsset
                    }
                }
            }
        })


        // const newWallet: IWallet = await prisma.wallet.create({
        //     data: {
        //         id: newWalletId,
        //         createdAt: new Date().toISOString(),
        //         user: {
        //             connect: {
        //                 id: userId
        //             }
        //         },
        //         assets: {
        //             create: {
        //                 id: newAssetId,
        //                 ticker: asset,
        //                 balance: 0.00,
        //                 createdAt: new Date().toISOString(),
        //                 rootAsset: isRootAsset
        //             }
        //         }
        //     }
        // })


        let assetReturn: IAsset | null = await prisma.asset.findUnique({
            where: {
                id: newAssetId
            }
        })
        !assetReturn ? handleError(res, 404, 'Error to find the new asset created') : undefined

        res.status(201).send({
            ...await newWallet,
            assets: [{ ...await assetReturn }]
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