import express from 'express'
import { Request, Response } from 'express'
import { prisma } from '../libs/db'
import { v4 as uuidv4 } from 'uuid';

const router = express.Router()


router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, taxId }: { name: string, taxId: string } = req.body
        const { setWallet }: { setWallet: boolean } = req.body

        let handleError = (res: Response, statusCode: number, message: string) => {
            res.status(statusCode).send({ message })
            console.error(message)
        }
        if (!name || !taxId) {
            return handleError(res, 400, "some params are missing")
        }

        let newUserId: string = uuidv4() as string
        const newUser = await prisma.user.create({
            data: {
                id: newUserId,
                name: name,
                taxId: taxId,
            }
        })

        let returnWallet
        if (setWallet) {
            await prisma.wallet.create({
                data: {
                    userId: newUserId,
                    assets: {
                        connectOrCreate: []
                    }
                }
            })
            returnWallet = await prisma.wallet.findFirst({
                where: {
                    userId: newUserId
                }
            })
        }

        const returnUser = await prisma.user.findUnique({
            where: {
                id: newUserId
            }
        })

        let resolver
        if (setWallet) {
            resolver = {
                ...await returnUser,
                "wallets": await {
                    ...returnWallet,
                    "assets": [returnWallet.assets]
                }
            }
        } else {
            resolver = {
                ...await returnUser,
            }
        }
        res.status(201).send(resolver)

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
        let handleError = (res: Response, statusCode: number, message: string) => {
            res.status(statusCode).send({ message })
            console.error(message)
        }
        const resolver = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
        if (resolver.length == 0) {
            return handleError(res, 404, 'registers not found')
        }

        res.status(200).send(resolver)
    } catch (error) {
        res.status(400).send({
            "message": "Error",
            error
        })
        throw Error
    }
})






export { router }
