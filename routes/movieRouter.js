const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Movies = require('../models/movie');

const movieRouter = express.Router()

movieRouter.use(bodyParser.json())

movieRouter.route('/')
.get((req,res,next) => {
    Movies.find({})
    .then((movies) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(movies);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Movies.create(req.body)
    .then((movie) => {
        console.log('Movie Created ', movie);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(movie);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /movies');
})
.delete((req, res, next) => {
    Movies.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

movieRouter.route('/:movieId')
.get((req,res,next) => {
    Movies.findById(req.params.movieId)
    .then((movie) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(movie);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /movies/'+ req.params.movieId);
})
.put((req, res, next) => {
    Movies.findByIdAndUpdate(req.params.movieId, {
        $set: req.body
    }, { new: true })
    .then((movie) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(movie);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Movies.findByIdAndRemove(req.params.movieId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = movieRouter