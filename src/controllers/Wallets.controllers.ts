import express from 'express'
import { Request, Response } from 'express'
import { prisma } from '../libs/db'
import { v4 as uuidv4 } from 'uuid';
import { IWallet } from '../interfaces/IWallet';
import { IUser } from '../interfaces/IUser';
import { IAsset } from '../interfaces/IAsset';
import { AssetEnum } from '../enums/asset.enum';
import { handleError } from '../libs/utils/handleError';


const router = express.Router()


router.post('/', async (req: Request, res: Response) => {
    try {
        const { userId }: { userId: string } = req.body
        !userId ? handleError(res, 400, "user is requised") : undefined
        // !(asset in AssetEnum) ? handleError(res, 400, "Asset not permitted") : undefined
        let returnUser: IUser | null = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })
        !returnUser ? handleError(res, 400, 'User not found') : undefined
        let newWalletId = uuidv4() as string
        const newWallet: IWallet = await prisma.wallet.create({
            data: {
                id: newWalletId,
                createdAt: new Date().toISOString(),
                userId: userId,
                assets: {
                    create: []
                }
            }
        })
        const walletReturn: IWallet | null = await prisma.wallet.findUnique({
            where: {
                id: newWalletId
            },
            include: {
                assets: true
            }
        })
        if (!walletReturn) {
            handleError(res, 404, 'wallet not found')
            return  // Adicione esta linha para interromper a execução do código
        }

        res.status(201).send(walletReturn)

    } catch (error) {
        console.error('Error', error)
        res.status(400).send({
            "message": "Error",
            error
        })

    }
})


router.get('/:walletId', async (req: Request, res: Response) => {
    try {
        const walletId: string = req.params.walletId
        !walletId ? handleError(res, 400, "walletId is required") : undefined
        const walletReturn : IWallet | null = await prisma.wallet.findUnique({
            where: {
                id: walletId
            },
            include: {
                assets: true
            }
        })
        res.status(200).send(walletReturn)
    } catch (error) {
        console.error('Error', error)
        res.status(400).send({
            'message': 'Error',
            error
        })
    }
})

router.put('/:id/asset', async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id
        const { assetId, isRootAsset }: { assetId: string, isRootAsset: string } = req.body
        //TODO: fazer validacoes
        const returnWallet = await prisma.wallet.findUnique({
            where: {
                id: id
            }
        })
        if (!returnWallet) {
            handleError(res, 404, 'wallet not found')
        }

    } //TRY
    catch (error) {
        console.error('Error', error)
        res.status(400).send({
            "message": "Error",
            error
        })
    }
})



router.get('/', async (req: Request, res: Response) => {
    try {
        const walletsReturn = await prisma.wallet.findMany({
            include: {
                assets: true
            }
        })
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