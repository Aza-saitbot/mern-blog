import express from 'express'
import mongoose from 'mongoose'
import { registerValidation, loginValidation, postCreateValidation } from './validations.js'
import checkAuth from './validators/checkAuth.js'
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'
import CheckAuth from './validators/checkAuth.js'

const PORT = 5000
mongoose.connect('mongodb+srv://root:root@cluster0.up6tdhi.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('Success connected DB'))
    .catch((err) => console.log('Reject connect DB', err))

const app = express()

app.use(express.json())


app.post('/auth/register', registerValidation, UserController.register)
app.post('/auth/login',loginValidation, UserController.login)
// middleware подключили
app.get('/auth/me', checkAuth, UserController.getMe)

// CRUD
app.get('/posts',PostController.getAll)

 app.post('/posts',CheckAuth,postCreateValidation,PostController.create)
app.get('/posts/:id',PostController.getOne)
app.delete('/posts/:id',CheckAuth,PostController.remove)
app.patch('/posts/:id',CheckAuth,PostController.update)



app.listen(PORT, (err) => {
    if (err) {
        return console.log('Ошибка при запуска проекта', err)
    }
    return console.log(`Server started on port ${PORT}`)
})