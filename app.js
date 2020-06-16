let createError = require('http-errors')
let express = require('express')
let path = require('path')
let cookieParser = require('cookie-parser')
let logger = require('morgan')

let mongoose = require('mongoose')

let Movies = require('./models/movies')

let url = 'mongodb://localhost:27017/Blockbuster'
let connect = mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true})



connect.then((db) => {
  console.log("Connected correctly to database server")  
}, (err) => { console.log(err)   })

// let indexRouter = require('./routes/index')
// let usersRouter = require('./routes/users')
let movieRouter = require('./routes/movieRouter')
let promoRouter = require('./routes/promoRouter')
let leaderRouter = require('./routes/leaderRouter')

let app = express()

app.use(cookieParser('12345-67890-09876-54321'))

auth = (req, res, next) => {
  if (!req.signedCookies.user) {
      let authHeader = req.headers.authorization 
    if (!authHeader) {
          let err = new Error('You are not authenticated!') 
        res.setHeader('WWW-Authenticate', 'Basic')               
        err.status = 401 
        next(err) 
        return 
    }
      let auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':') 
      let user = auth[0] 
      let pass = auth[1] 
    if (user == 'admin' && pass == 'password') {
        res.cookie('user','admin',{signed: true}) 
        next()  // authorized
    } else {
          let err = new Error('You are not authenticated!') 
        res.setHeader('WWW-Authenticate', 'Basic')               
        err.status = 401 
        next(err) 
    }
  }
  else {
      if (req.signedCookies.user === 'admin') {
          next() 
      }
      else {
          let err = new Error('You are not authenticated!') 
          err.status = 401 
          next(err) 
      }
  }
}

app.use(auth)  

app.use('/movies',movieRouter)
app.use('/promotions',promoRouter)
app.use('/leaders',leaderRouter)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// app.use('/', indexRouter)
// app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
