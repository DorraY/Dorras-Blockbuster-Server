let createError = require('http-errors')
let express = require('express')
let path = require('path')
let cookieParser = require('cookie-parser')
let logger = require('morgan')

let mongoose = require('mongoose')

let Movies = require('./models/movies')

let url = 'mongodb://localhost:27017/Blockbuster'
let connect = mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true})

let session = require('express-session');
let FileStore = require('session-file-store')(session);

connect.then((db) => {
  console.log("Connected correctly to database server")  
}, (err) => { console.log(err)   })

let indexRouter = require('./routes/index')
let usersRouter = require('./routes/users')
let movieRouter = require('./routes/movieRouter')
let promoRouter = require('./routes/promoRouter')
let leaderRouter = require('./routes/leaderRouter')

let app = express()

app.use(cookieParser('12345-67890-09876-54321'))

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}))

let auth = (req, res, next) => {
  console.log(req.session)

  if(!req.session.user) {
    let err = new Error('You are not authenticated!')
    err.status = 403
    return next(err)
  }
  else {
  if (req.session.user === 'authenticated') {
    next()
  }
  else {
    var err = new Error('You are not authenticated!')
    err.status = 403
    return next(err)
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

app.use('/', indexRouter)
app.use('/users', usersRouter)

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
