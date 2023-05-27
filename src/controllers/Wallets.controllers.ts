import express from 'express'
import { Request, Response } from 'express'
import { prisma } from '../libs/db'
import { v4 as uuidv4 } from 'uuid';
import { IWallet } from '../interfaces/IWallet';

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
        const returnUser = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!returnUser) {
            handleError(res, 400, 'User not found')
            return
        }

        const newWallet: IWallet = await prisma.wallet.create({
            data: {
                id: uuidv4(),
                createdAt: new Date().toISOString(),
                userId: returnUser.id,
                assets: {
                    connectOrCreate: []
                }
            },

        })

        res.status(201).send({
            "message": "Wallet created",
            newWallet
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