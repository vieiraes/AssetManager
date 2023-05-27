require('dotenv').config()
import express from 'express'
import * as controllers from './controllers'


const app = express()
const router = express.Router()
app.use(router)
app.use(express.json()) // para aceitar response JSON


async function bootstrap() {
    const server = await app.listen(process.env.PORT, () => {
    })
    if(!server){
        console.error('Server error')
        throw Error
    }
    if(server){
        console.log(`🚀 Server is connected port: ${process.env.PORT}`)
    }
}

app.use('/users', controllers.UserController)
app.use('/wallets', controllers.WalletController)
app.use('/assets', controllers.AssetController)



bootstrap()