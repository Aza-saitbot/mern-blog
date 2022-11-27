import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const PORT=5000
mongoose.connect('mongodb+srv://root:root@cluster0.up6tdhi.mongodb.net/?retryWrites=true&w=majority')
    .then(()=>console.log('Success connected DB'))
    .catch((err)=>console.log('Reject connect DB',err))

const app =express()

app.use(express.json())

app.get('/',(req,res)=>{
    res.send('Привет')
})

app.post('/auth/login',(req,res)=>{
    const {email,password}=req.body
    console.log('email,password',email,password)
    const token=jwt.sign({
        email,
        password
    },'secretKey_dsffsdfsdfsf')

    res.json({
        name:"Azamat",
        token
    })

})

app.listen(PORT,(err)=>{
    if (err){
        return console.log('Ошибка при запуска проекта',err)
    }
    return console.log(`Server started on port ${PORT}`)
})