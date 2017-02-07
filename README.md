# node-movie
node+mongodb+jade+express

## 1.环境依赖
* node+npm
* mongodb

## 2.下载依赖包
clone项目后执行以下命令下载依赖包

	npm i
	bower i

## 3.启动项目
启动前需先在本地启动mongobd，并确保路径和端口号匹配

	node app.js
	PROT=5000 node app.js   // 修改启动端口号

## 3.教程中的坑
### mongoose.connect('mongodb://127.0.0.1:12345/movie')
连接数据库时需要先在本地安装和运行mongodb，安装教程自行百度。

### express4改版引起的问题
除去 `static` 模块外，其它不再集成在`express`中，本案例中受影响的模块有

* express.bodyParser
* express.static

> app.js 中已注释说明
