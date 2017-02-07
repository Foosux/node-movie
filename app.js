/**
 * 项目入口文件
 * @type {引入express,设置模板引擎jade,通过mongoose链接mongodb}
 */
var express = require('express')        // 引入express作为开发框架
// var path= require('path')            // 引入path，用于拼接路径
var mongoose = require('mongoose')      // 引入mongoose，用于链接mongodb数据库
var Movie = require('./models/movie')   // mongodb中的 实例化环节
var _ = require('underscore')           // extend方法可用于替换老的数据

var bodyParser= require('body-parser')  // express4之后，模块需单独引入
var port = process.env.PORT || 3000     // 通过环境变量获取端口号（PORT=5000 node app.js）| 默认为3000
var app = express()                     // 建立上下文

mongoose.connect('mongodb://127.0.0.1:12345/movie') // 链接数据库，需额外安装mongodb并启动

app.set('views','./views/pages')      // 设置视图根目录
app.set('view engine','jade')         // 设置默认模板引擎

// app.use(express.bodyParser())      // 表单数据格式化-老版处理方法
app.use(bodyParser.urlencoded())      // 表单数据格式化-express4之后，模块用法改变

// app.use(express.static(path.join(__dirname, 'bower_components'))) // 处理静态文件路径-老版处理方法
app.use('/static', express.static('public'))                         // 处理静态文件路径-新处理方式

app.locals.moment = require('moment') // 引入moment，处理日期的格式化

app.listen(port)                      // 启动
console.log('nodeMovie start on port' + port)

// 配置路由 index
app.get('/', function(req,res) {
  Movie.fetch(function(err,movies) {
    if(err) {
      console.log(err)
    }
    res.render('index', {
      title: 'nodeMovie 首页',
      movies: movies
    })
  })
  // 初期mock数据
  // res.render('index', {
  //   title: 'nodeMovie 首页',
  //   movies: [{
  //     title: '机械战警',
  //     _id : 1,
  //     poster: 'http://blogfile.ifeng.com/uploadfiles/blog_attachment/0911/40/638740_fc889be6e3b177d874873316cf26992f.jpg'
  //   },{
  //     title: '机械战警',
  //     _id : 2,
  //     poster: 'http://blogfile.ifeng.com/uploadfiles/blog_attachment/0911/40/638740_fc889be6e3b177d874873316cf26992f.jpg'
  //   }]
  // })
})
// 配置路由 detail
app.get('/movie/:id',function(req,res) {
  var id = req.params.id

  Movie.findById(id, function(err,movie) {
    res.render('detail', {
      title: 'nodeMovie' + movie.title,
      movie: movie
    })
  })
  // 初期mock数据
  // res.render('detail', {
  //   title: 'nodeMovie 详情页'
  // })
})
// 配置路由 admin
app.get('/admin/movie',function(req,res) {
  res.render('admin', {
    title: 'nodeMovie 后台录入页',
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
// 配置路由 admin修改更新
app.get('/admin/update/:id', function(req, res) {
  var id = req.params.id

  if (id) {
    Movie.findById(id, function(err, movie) {
      res.render('admin', {
        title: 'nodeMovie 后台更新页',
        movie: movie
      })
    })
  }
})
// 配置路由 提交时存储数据
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
})

// 配置路由 list
app.get('/admin/list',function(req,res) {
  Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err)
		}
		res.render('list', {
			title: 'nodeMovie 列表页',
			movies: movies
		})
	})
  // 初期mock数据
  // res.render('list', {
  //   title: 'nodeMovie 列表页',
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
  })

  // 配置路由 删除数据
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
