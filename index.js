import express from 'express'
import mongoose from 'mongoose'
import { registerValidation } from './validators/auth.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controllers/UserController.js'

const PORT = 5000
mongoose.connect('mongodb+srv://root:root@cluster0.up6tdhi.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('Success connected DB'))
    .catch((err) => console.log('Reject connect DB', err))

const app = express()

app.use(express.json())


app.post('/auth/register', registerValidation, UserController.register)
app.post('/auth/login', UserController.login)
// middleware подключили
app.get('/auth/me', checkAuth, UserController.getMe)


app.listen(PORT, (err) => {
    if (err) {
        return console.log('Ошибка при запуска проекта', err)
    }
    return console.log(`Server started on port ${PORT}`)
})