/**
 * mongodb的Model 层
 * @type {可以操作数据库，作为实例化的构造函数}
 */

var mongoose = require('mongoose')
var MovieSchema = require('../schemas/movie')
var Movie = mongoose.model('Movie',MovieSchema)

module.exports = Movie
