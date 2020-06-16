const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Movies = require('../models/movies') 

const movieRouter = express.Router()

movieRouter.use(bodyParser.json())

movieRouter.route('/')
.get((req,res,next) => {
    Movies.find({})
    .then((movies) => {
        res.statusCode = 200 
        res.setHeader('Content-Type', 'application/json') 
        res.json(movies) 
    }, (err) => next(err))
    .catch((err) => next(err)) 
})
.post((req, res, next) => {
    Movies.create(req.body)
    .then((movie) => {
        console.log('Movie Created ', movie) 
        res.statusCode = 200 
        res.setHeader('Content-Type', 'application/json') 
        res.json(movie) 
    }, (err) => next(err))
    .catch((err) => next(err)) 
})
.put((req, res, next) => {
    res.statusCode = 403 
    res.end('PUT operation not supported on /movies') 
})
.delete((req, res, next) => {
    Movies.remove({})
    .then((resp) => {
        res.statusCode = 200 
        res.setHeader('Content-Type', 'application/json') 
        res.json(resp) 
    }, (err) => next(err))
    .catch((err) => next(err))     
}) 

movieRouter.route('/:movieId')
.get((req,res,next) => {
    Movies.findById(req.params.movieId)
    .then((movie) => {
        res.statusCode = 200 
        res.setHeader('Content-Type', 'application/json') 
        res.json(movie) 
    }, (err) => next(err))
    .catch((err) => next(err)) 
})
.post((req, res, next) => {
    res.statusCode = 403 
    res.end('POST operation not supported on /movies/'+ req.params.movieId) 
})
.put((req, res, next) => {
    Movies.findByIdAndUpdate(req.params.movieId, {
        $set: req.body
    }, { new: true })
    .then((movie) => {
        res.statusCode = 200 
        res.setHeader('Content-Type', 'application/json') 
        res.json(movie) 
    }, (err) => next(err))
    .catch((err) => next(err)) 
})
.delete((req, res, next) => {
    Movies.findByIdAndRemove(req.params.movieId)
    .then((resp) => {
        res.statusCode = 200 
        res.setHeader('Content-Type', 'application/json') 
        res.json(resp) 
    }, (err) => next(err))
    .catch((err) => next(err)) 
}) 

movieRouter.route('/:movieId/comments')
.get((req,res,next) => {
    moviees.findById(req.params.movieId)
    .then((movie) => {
        if (movie != null) {
            res.statusCode = 200 
            res.setHeader('Content-Type', 'application/json') 
            res.json(movie.comments) 
        }
        else {
            err = new Error('movie ' + req.params.movieId + ' not found') 
            err.status = 404 
            return next(err) 
        }
    }, (err) => next(err))
    .catch((err) => next(err)) 
})
.post((req, res, next) => {
    Movies.findById(req.params.movieId)
    .then((movie) => {
        if (movie != null) {
            movie.comments.push(req.body) 
            movie.save()
            .then((movie) => {
                res.statusCode = 200 
                res.setHeader('Content-Type', 'application/json') 
                res.json(movie)                 
            }, (err) => next(err)) 
        }
        else {
            err = new Error('movie ' + req.params.movieId + ' not found') 
            err.status = 404 
            return next(err) 
        }
    }, (err) => next(err))
    .catch((err) => next(err)) 
})
.put((req, res, next) => {
    res.statusCode = 403 
    res.end('PUT operation not supported on /movies/'
        + req.params.movieId + '/comments') 
})
.delete((req, res, next) => {
    Movies.findById(req.params.movieId)
    .then((movie) => {
        if (movie != null) {
            for (var i = (movie.comments.length -1) ; i >= 0 ; i--) {
                movie.comments.id(movie.comments[i]._id).remove() 
            }
            movie.save()
            .then((movie) => {
                res.statusCode = 200 
                res.setHeader('Content-Type', 'application/json') 
                res.json(movie)                 
            }, (err) => next(err)) 
        }
        else {
            err = new Error('movie ' + req.params.movieId + ' not found') 
            err.status = 404 
            return next(err) 
        }
    }, (err) => next(err))
    .catch((err) => next(err))     
}) 

movieRouter.route('/:movieId/comments/:commentId')
.get((req,res,next) => {
    Movies.findById(req.params.movieId)
    .then((movie) => {
        if (movie != null && movie.comments.id(req.params.commentId) != null) {
            res.statusCode = 200 
            res.setHeader('Content-Type', 'application/json') 
            res.json(movie.comments.id(req.params.commentId)) 
        }
        else if (movie == null) {
            err = new Error('movie ' + req.params.movieId + ' not found') 
            err.status = 404 
            return next(err) 
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found') 
            err.status = 404 
            return next(err)             
        }
    }, (err) => next(err))
    .catch((err) => next(err)) 
})
.post((req, res, next) => {
    res.statusCode = 403 
    res.end('POST operation not supported on /movies/'+ req.params.movieId
        + '/comments/' + req.params.commentId) 
})
.put((req, res, next) => {
    Movies.findById(req.params.movieId)
    .then((movie) => {
        if (movie != null && movie.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                movie.comments.id(req.params.commentId).rating = req.body.rating 
            }
            if (req.body.comment) {
                movie.comments.id(req.params.commentId).comment = req.body.comment                 
            }
            movie.save()
            .then((movie) => {
                res.statusCode = 200 
                res.setHeader('Content-Type', 'application/json') 
                res.json(movie)                 
            }, (err) => next(err)) 
        }
        else if (movie == null) {
            err = new Error('movie ' + req.params.movieId + ' not found') 
            err.status = 404 
            return next(err) 
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found') 
            err.status = 404 
            return next(err)             
        }
    }, (err) => next(err))
    .catch((err) => next(err)) 
})
.delete((req, res, next) => {
    Movies.findById(req.params.movieId)
    .then((movie) => {
        if (movie != null && movie.comments.id(req.params.commentId) != null) {
            movie.comments.id(req.params.commentId).remove() 
            movie.save()
            .then((movie) => {
                res.statusCode = 200 
                res.setHeader('Content-Type', 'application/json') 
                res.json(movie)                 
            }, (err) => next(err)) 
        }
        else if (movie == null) {
            err = new Error('movie ' + req.params.movieId + ' not found') 
            err.status = 404 
            return next(err) 
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found') 
            err.status = 404 
            return next(err)             
        }
    }, (err) => next(err))
    .catch((err) => next(err)) 
}) 

module.exports = movieRouter