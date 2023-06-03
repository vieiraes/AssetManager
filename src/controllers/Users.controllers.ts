import express from 'express'
import { Request, Response } from 'express'
import { prisma } from '../libs/db'
import { v4 as uuidv4 } from 'uuid';
import { handleError } from '../libs/utils/handleError';
import { IUser } from '../interfaces/IUser'

const router = express.Router()


router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, taxId }: { name: string, taxId: string } = req.body
        const { setWallet }: { setWallet: boolean } = req.body

        !name || !taxId ? handleError(res, 400, "some params are missing") : undefined
        let newUserId: string = uuidv4() as string
        const newUser: IUser = await prisma.user.create({
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
                        create: []
                    }
                }
            })
            returnWallet = await prisma.wallet.findFirst({
                where: {
                    userId: newUserId
                },
                include: {
                    assets: true
                }
            })
        }

        const returnUser: IUser | null = await prisma.user.findUnique({
            where: {
                id: newUserId
            },
            include: {
                wallets: {
                    include: {
                        assets: true
                    }
                }
            }
        })
        res.status(201).send(returnUser)

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
        const resolver : IUser[]  = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                wallets: {
                    include: {
                        assets: true
                    }
                }
            }
        })
        res.status(200).send(resolver)
    } catch (error) {
        res.status(400).send({
            "message": "Error",
            error
        })
    }
})


router.get('/:id', async (req: Request, res: Response) => {
    try {
        //TODO: falta fazer as validacoes
        const id: string = req.params.id
        const returnUser : IUser | null = await prisma.user.findUnique({
            where: {
                id: id
            },
            include: {
                wallets: {
                    include: {
                        assets: true
                    }
                }
            }
        })
        res.status(200).send(returnUser)
    } catch (error) {
        console.error(error)
        res.status(400).send({
            'message': "error",
            error
        })       
    }
})




export { router }