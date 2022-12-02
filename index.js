import express from 'express'
import mongoose from 'mongoose'
import { registerValidation, loginValidation, postCreateValidation } from './validations.js'
import multer from 'multer'
import {PostController,UserController} from './controllers/index.js'
import {handleValidationErrors,checkAuth} from './utils/index.js'

const PORT = 5000
mongoose.connect('mongodb+srv://root:root@cluster0.up6tdhi.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('Success connected DB'))
    .catch((err) => console.log('Reject connect DB', err))

const app = express()
// логика связано с сохранением изображения
// создаем хранилища
const storage = multer.diskStorage({
    // когда любой файл будет загружаться, выполниться функция, к-й вернет путь этого файла
    destination:(_,__, cb)=>{
        cb(null,'uploads')
    },
    // перед тем как сохранить, нужно указать названия файла
    filename:(_,file, cb)=>{
        cb(null,file.originalname)
    }
})
app.use(express.json())
// настройка отправки статичного файла, если придет
// get запрос c урлом /uploads, то верни статику с этой файла
app.use('/uploads',express.static('uploads'))

// создаем ф-ю с хранилищем
const upload = multer({ storage })

// middleware: если есть ошибки при валидации, то парсим их и возвращаем, иначе все ок, регистрируем/логинимся
app.post('/auth/register', registerValidation,handleValidationErrors, UserController.register)
app.post('/auth/login',loginValidation,handleValidationErrors, UserController.login)
// middleware подключили
app.get('/auth/me', checkAuth, UserController.getMe)

// роут для загрузки изображения,
// подключаем middleware - на проверку свойства - image, если придет image, то успешно возвращаем ссылку на картинку
app.post('/upload', checkAuth, upload.single('image'),(req,res)=>{
  console.log('req',req)
    res.json({
        url:`/uploads/${req.file.originalname}`
    })
})

// CRUD
app.get('/posts',PostController.getAll)

// middleware: авторизованы ?, провалидированы ? если есть ошибки возвращаем эти ошибки
app.post('/posts',checkAuth,postCreateValidation,handleValidationErrors,PostController.create)
app.get('/posts/:id',PostController.getOne)
app.delete('/posts/:id',checkAuth,PostController.remove)
app.patch('/posts/:id',checkAuth,postCreateValidation,handleValidationErrors,PostController.update)



app.listen(PORT, (err) => {
    if (err) {
        return console.log('Ошибка при запуска проекта', err)
    }
    return console.log(`Server started on port ${PORT}`)
})