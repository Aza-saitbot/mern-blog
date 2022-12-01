import jwt from 'jsonwebtoken'


export default (req,res,next)=>{
    // дай мне токен без слово Bearer или пустую строку
    const token = (req.headers.authorization || '').replace(/Bearer\s?/,'')

    if (token){
        try {
            // расшифруй токен
            const decoded = jwt.verify(token,'secret123')
            //если все хорошо, то сохрани айди
            req.userId = decoded._id
            // выполняй след функцию/дальше
            next()

        }catch (e) {
            return res.status(403).json({
                message:'Нет доступа'
            })
        }

    }else {
       return res.status(403).json({
            message:'Нет доступа'
        })
    }
}