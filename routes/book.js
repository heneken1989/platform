var express = require('express');
var router = express.Router();
var bookModel = require('../models/bookModel');
const multer = require('multer');

const storageDish =multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,'./public/images');
    },
    filename: (req,file,cb)=>{
      cb(null,file.fieldname + '-' + Date.now() + '.jpg');
    },
});

const upload =multer({storage:storageDish});

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const books = await bookModel.find()
  res.render('book/index',{books:books})
});

router.get('/create',function(req, res, next) {
   return res.render('book/create');
});

router.post('/create',upload.single('image') ,async function(req, res, next) {
   let body = req.body;
   let file = req.file;
   let book = new bookModel({
      title:body.title,
      price:body.price,
      image:file.filename
   });

   await book.save();
   return res.redirect('/book')
});

router.get('/edit/:id', function(req, res, next) {
  res.render('book/edit');
});


router.post('/edit', function(req, res, next) {
  res.redirect('/book');
});


router.get('/search', async function(req, res, next) {
  let title = req.query.title;
  let boo = await bookModel.find({'title': new RegExp(title,'i')})
  console.log(boo);
  res.render('book/index',{books:boo});
});

module.exports = router;
