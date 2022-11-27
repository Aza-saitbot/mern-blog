import { body } from 'express-validator'

export const registerValidation=[
    body('fullName','Необходимо указать имя').isLength({min:3}),
    body('avatarUrl','Неверная ссылка').optional().isURL(),
    body('email','Некорректный email').isEmail(),
    body('password','Пароль должен быть минимум 5 символов').isLength({min:5}),
]