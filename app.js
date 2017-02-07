/**
 * 项目入口文件
 * @type {引入express,设置模板引擎jade,通过mongoose链接mongodb}
 */
var express = require('express')
var path= require('path')
var mongoose = require('mongoose')
var Movie = require('./models/movie')
var _ = require('underscore')   // extend 方法可以替换老的数据

var bodyParser= require('body-parser')
var port = process.env.PORT || 3000   // 通过环境变量获取
var app = express()

mongoose.connect('mongodb://127.0.0.1:12345/movie')

app.set('views','./views/pages')      // 设置视图根目录
app.set('view engine','jade')   // 设置默认模板引擎

// app.use(express.bodyParser())   // 表单数据格式化-老版
app.use(bodyParser.urlencoded())   // 表单数据格式化-新版已经不再和express绑定

// app.use(express.static(path.join(__dirname, 'bower_components'))) // 处理静态文件路径
app.use('/static', express.static('public'))
app.locals.moment = require('moment')
app.listen(port)
console.log('imooc start on port' + port)

// 配置路由 index page
app.get('/', function(req,res) {
  Movie.fetch(function(err,movies) {
    if(err) {
      console.log(err)
    }

    res.render('index', {
      title: 'imooc 首页',
      movies: movies
    })
  })

  // res.render('index', {
    // title: 'imooc 首页',
    // movies: [{
    //   title: '机械战警',
    //   _id : 1,
    //   poster: 'http://blogfile.ifeng.com/uploadfiles/blog_attachment/0911/40/638740_fc889be6e3b177d874873316cf26992f.jpg'
    // },{
    //   title: '机械战警',
    //   _id : 2,
    //   poster: 'http://blogfile.ifeng.com/uploadfiles/blog_attachment/0911/40/638740_fc889be6e3b177d874873316cf26992f.jpg'
    // }]
  // })
})
// detail page
app.get('/movie/:id',function(req,res) {
  var id = req.params.id

  Movie.findById(id, function(err,movie) {
    res.render('detail', {
      title: 'imooc' + movie.title,
      movie: movie
    })
  })
  // res.render('detail', {
  //   title: 'imooc 详情页'
  // })
})
// admin page
app.get('/admin/movie',function(req,res) {
  res.render('admin', {
    title: 'imooc 后台录入页',
    movie: {
      title: '',
      doctor: '',
      country: '',
      year: '',
      poster: '',
      flash: '',
      summary: '',
      language:''
    }
  })
})
// admin update
app.get('/admin/update/:id', function(req, res) {
  var id = req.params.id

  if (id) {
    Movie.findById(id, function(err, movie) {
      res.render('admin', {
        title: 'imooc 后台更新页',
        movie: movie
      })
    })
  }
})
// 数据存储 admin post movie
app.post('/admin/movie/new', function(req, res) {
  var id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie

  if (id !== 'undefined') {
    Movie.findById(id, function(err,movie) {
      if (err) {
        console.log(err)
      }

      _movie = _.extend(movie, movieObj)  // 查询到的movie post的movie
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err)
        }

        res.redirect('/movie/' + movie._id) // 重定向
      })
    })
  } else {
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    })

    _movie.save(function(err, movie) {
      if (err) {
        console.log(err)
      }

      res.redirect('/movie/' + movie._id) // 重定向
    })
  }

  // var id = req.body.movie._id
	// var movieObj = req.body.movie
	// var _movie
	// if (id !== 'undefined') {
	// 	Movie.findById(id, function(err, movie) {
	// 		if (err) {
	// 			console.log(err)
	// 		}
	// 		_movie = _.extend(movie, movieObj)
	// 		_movie.save(function(err, movie) {
	// 			if (err) {
	// 				console.log(err)
	// 			}
	// 			res.redirect('/movie/' + movie._id)
	// 		})
	// 	})
	// } else {
	// 	_movie = new Movie({
	// 		doctor: movieObj.doctor,
	// 		title: movieObj.title,
	// 		country: movieObj.country,
	// 		language: movieObj.language,
	// 		poster: movieObj.poster,
	// 		summary: movieObj.summary,
	// 		flash: movieObj.flash
  //
  //
	// 	})
	// 	_movie.save(function(err, movie) {
	// 		if (err) {
	// 			console.log(err)
	// 		}
	// 		res.redirect('/movie/' + movie._id)
	// 	})
	// }
})


// index page
app.get('/admin/list',function(req,res) {
  Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err)
		}
		res.render('list', {
			title: 'imooc 列表页',
			movies: movies
		})
	})
  // Movie.findById(id, function(err,movies) {
  //   res.render('list', {
  //     title: 'imooc' + movie.title,
  //     movies: movies
  //   })
  // })


  // res.render('list', {
  //   title: 'imooc 列表页',
  //   movies: [{
  //     _id:1,
  //     _ud:3,
  //     title: '机械公敌',
  //     doctor: '汤姆汉克斯',
  //     country: '美国',
  //     year: '1998',
  //     poster: 'http://blogfile.ifeng.com/uploadfiles/blog_attachment/0911/40/638740_fc889be6e3b177d874873316cf26992f.jpg',
  //     flash: '',
  //     summary: '好看！大片！',
  //     language:'chinese'
  //   }]
  // })

  // list delete movie
  app.delete('/admin/list', function(req, res) {
    var id = req.query.id

    if (id) {
      Movie.remove({_id: id}, function(err, movie) {
        if (err) {
          console.log(err)
        } else {
          res.json({success: 1})
        }
      })
    }
  })
})
