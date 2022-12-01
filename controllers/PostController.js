import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
    try {
        const post = await PostModel.find().populate('user').exec()
        res.json(post)
    } catch (e) {
        console.log('Ошибка при создание статьи', e)
        res.status(500).json({
            message: 'Ошибка при создание статьи'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: {viewsCount: 1}
            },
            {
                returnDocument: 'after'
            },
            // если при получение с обновлением статьи произошла ошибка, что сделать?
            // вернуть ошибку или если успешно, то верни обновленную статью ?
            (err, doc) => {
                if (err) {
                    console.log('Не удалось вернуть статью', err)
                    return res.status(500).json({
                        message: 'Не удалось вернуть статью'
                    })
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найден'
                    })
                }

                res.json(doc)
            }
        )
    } catch (e) {
        console.log('Не удалось вернуть статью', e)
        res.status(500).json({
            message: 'Не удалось вернуть статью'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndDelete(
            {
                _id: postId,
            },
            (err, doc) => {
                if (err) {
                    console.log('Ошибка при удалении статьи', err)
                    return res.status(500).json({
                        message: 'Ошибка при удалении статьи'
                    })
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найден'
                    })
                }

                res.json({
                    success:true
                })
            }
        )
    } catch (e) {
        console.log('Не удалось удалить статью', e)
        res.status(500).json({
            message: 'Не удалось удалить статью'
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        const post = await doc.save()
        res.json(post)
    } catch (e) {
        console.log('Ошибка при создание статьи', e)
        res.status(500).json({
            message: 'Ошибка при создание статьи'
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId
            },
            {
              returnDocument:'after'
            },
            (err, doc) => {
                if (err) {
                    console.log('Ошибка при обновлении статьи', err)
                    return res.status(500).json({
                        message: 'Ошибка при обновлении статьи'
                    })
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найден'
                    })
                }

                res.json(doc)
            }
        )
    } catch (e) {
        console.log('Не удалось удалить статью', e)
        res.status(500).json({
            message: 'Не удалось удалить статью'
        })
    }
}