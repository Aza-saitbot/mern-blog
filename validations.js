import { body } from 'express-validator'

export const registerValidation=[
    body('fullName','Необходимо указать имя').isLength({min:3}),
    body('avatarUrl','Неверная ссылка').optional().isURL(),
    body('email','Некорректный email').isEmail(),
    body('password','Пароль должен быть минимум 5 символов').isLength({min:5}),
]

export const loginValidation=[
    body('email','Некорректный email').isEmail(),
    body('password','Пароль должен быть минимум 5 символов').isLength({min:5}),
]

export const postCreateValidation=[
    body('title','Введите заголовок статьи').isLength({min:3}).isString(),
    body('text','Введите текст статьи').isLength({min:3}).isString(),
    body('tags','Неверный формат тэгов (укажите массив)').optional().isString(),
    body('imageUrl','Неверная ссылка на изображение').optional().isString(),
]