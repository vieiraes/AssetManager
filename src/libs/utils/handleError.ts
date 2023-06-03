import { Response } from "express"

export let handleError = (res: Response, statusCode: number, message: string) => {
    res.status(statusCode).send({ message })
    console.error(message)
}