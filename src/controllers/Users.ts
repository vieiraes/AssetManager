import express from 'express'
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { IUser } from '../interfaces/IUser'
import { v4 as uuidv4 } from 'uuid';

const router = express.Router()
const prisma = new PrismaClient()

router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, cpf }: { name: string, cpf: string } = req.body
        let handleError = (res: Response, statusCode: number, message: string) => {
            res.status(statusCode).send({ message })
            console.error(message)
        }
        if (!name || !cpf) {
            return handleError(res, 400, "some params are missing")
        }
        let object: IUser = {
            id: uuidv4(),
            name: name,
            cpf: cpf,
            createdAt: new Date().toISOString(),
            wallets: uuidv4()
        }

        const resolver = await prisma.user.create({ data: object })
        res.status(201).send(resolver)
    } catch (error) {
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
