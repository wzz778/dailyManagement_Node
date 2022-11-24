const express = require('express');
const router = express.Router();//创建路由
const multer = require('multer');//引用中间件
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "\public/img");
    },//上传后的文件路径
    filename: function (req, file, cb) {
        let e = file.originalname.split('.')[1];//获取后缀
        const uniqueSuffix = Date.now()
        cb(null, `${uniqueSuffix}.${e}`)
    }//指定文件名
})
const upload = multer({ storage: storage });
router.post('/api/updataimg', upload.single('img'), (req, res) => {
    
    let { size, mimetype, path, filename } = req.file;
    let types = ['jpg', 'jpeg', 'png', 'gif'];//格式判断（上传图片的）
    let tmptype = mimetype.split('/')[1];
    if (size > 500000) {
        res.send({ status: 0, msg: '图片上传尺寸过大！' });//传输大小限制
    } else if (types.indexOf(tmptype) == -1) {
        res.send({ status: 0, msg: '图片上传格式错误！' });//格式判断（上传图片的）
    } else {
        let imgurl = `/public/img/${filename}`;
        res.send({ status: 1, msg: '图片上传成功！', url: imgurl });
    }
})
module.exports = router;