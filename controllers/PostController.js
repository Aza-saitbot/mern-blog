import PostModel from '../models/Post.js'

export const create = async (req,res) => {
  try{
      const doc = new PostModel({
          title:req.body.title,
          text:req.body.text,
          imageUrl:req.body.imageUrl,
          tags:req.body.tags,
          user:req.userId
      })

      const post = await doc.save()
      res.json(post)
  }catch (e) {
      console.log('Ошибка при создание статьи', e)
      res.status(500).json({
          message: 'Ошибка при создание статьи'
      })
  }
}