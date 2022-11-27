import userModel from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'


export const register = async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        // если нет ошибок - создаем user и сохраняем

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new userModel({
            email: req.body.email,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,
            fullName: req.body.fullName,
        })

        // подготовили - сохраняем, возвращает р-т сохранения из db
        const user = await doc.save()

        const token = jwt.sign(
            {
                _id: user._id
            },
            'secret123',
            // token будет жить 30 дней
            {
                expiresIn: '30d'
            }
        )

        // не нужно клиенту passwordHash и другие поля, только возвращаем объект user
        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (e) {
        console.log('Ошибка при регистрации', e)
        res.status(500).json({
            message: 'Ошибка при регистрации'
        })
    }

}
export const login = async (req, res) => {
    try {
        const user = await userModel.findOne({
            email: req.body.email
        })
        if (!user) {
            return res.status(404).json({
                // такое сообщения только для личного разработки
                message: 'Пользователь не найден'
            })
        }
        // если пользователь найден с таким email, дальше сравниваем пароли c db

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!isValidPassword) {
            return res.status(400).json({
                message: 'Неверный логин или пароль'
            })
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            'secret123',
            // token будет жить 30 дней
            {
                expiresIn: '30d'
            }
        )

        // не нужно клиенту passwordHash и другие поля, только возвращаем объект user
        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })

    } catch (e) {
        console.log('Ошибка при авторизации', e)
        res.status(500).json({
            message: 'Ошибка при авторизации'
        })
    }
}
export const getMe = async (req, res) => {
    try {
        const user = await userModel.findOne(req.userId)
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        const {passwordHash, ...userData} = user._doc

        res.json(userData)

    } catch (e) {
        console.log('Ошибка при запроса user', e)
        res.status(500).json({
            message: 'Ошибка при запроса user'
        })
    }
}