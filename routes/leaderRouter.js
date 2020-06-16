const express = require('express')
const bodyParser = require('body-parser')

const leaderRouter = express.Router()

const Leaders = require('../models/leaders')

leaderRouter.use(bodyParser.json())

leaderRouter.route('/').all(
    (req,res,next) => {
        res.statusCode = 200
        res.setHeader('Content-Type','text/plain')
        next()
    }
).get((req,res,next) => {
    Leaders.find({}).then(
        (leaderses) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(Leaders)
        }, (err) => next(err)).catch(
            (err) => next(err)
        )
}).post(
    (req,res,next)=> {
    Leaders.create(req.body).then(
        (leaders) => {
            console.log('leaders created', leaders)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(leaders)
        }, (err) => next(err)).catch((err) => next(err))
}).put(
    (req,res,next) => {
        res.statusCode = 403
        res.end('PUT operation not supported on /Leaders')
}).delete((req,res,next)=>  {
        Leaders.remove({}).then((resp) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(resp)
        }, (err) => next(err)).catch((err) => next(err)) 
    })

leaderRouter.route('/:leaderId').all(
    (req,res,next) => {
        res.statusCode = 200
        res.setHeader('Content-Type','text/plain')
        next()
    }
).get(
    (req,res,next) => {
        Leaders.findById(req.params.leaderId).then(
            (leaders) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(leaders)
            }, (err) => next(err)).catch((err) => next(err)).catch((err) => next(err)) 
    }).post(
        (req,res,next) => {
            res.statusCode = 403
            res.end('POST operation not supported on /Leaders/' + req.params.leaderId)
}).put(
    (req,res,next) => {
        Leaders.findByIdAndUpdate(req.params.leaderId, {
            $set:req.body
        }, {new:true}).then((leaders) => {
            res.statusCode = 200
            res.setHeader('Content-Type','application/json')
            res.json(leaders)
        }, (err) =>next(err)).catch(
            (err) => next(err)
        ).catch((err) => next(err))
    }
).delete(
    (req,res,next) => {
        Leaders.findByIdAndRemove(req.params.leaderId).then((resp) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(leaders)
        }, (err) => next(err)).catch((err) => next(err))

    })

    leaderRouter.route('/:leadersId/comments') // mounting an express router at /
    // .all((req,res,next) => {
    //     res.statusCode = 200
    //     res.setHeader('Content-Type', 'text/plain')
    //     next()
    // })
    .get((req,res,next) => {
        // res.end('Will send all the Leaders to you!')
        Leaders.findById(req.params.leadersId).then( // accessing mongodb from express server
            (leaders) => {
                if (leaders !=null) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(leaders.comments)
                }
                else {
                    err = new Error('leaders ' + req.params.leadersId + ' not found')
                    err.status = 404
                    return next(err)
                }
            }, (err) => next(err)).catch(
                (err) => next(err))
    })
    .post((req, res, next) => {
        // res.end('Will add the leaders: ' + req.body.name + ' with details: ' + req.body.description)
        Leaders.findById(req.params.leadersId).then(
            (leaders) => {
                if (leaders !=null) {
                    leaders.comments.push(req.body)
                    leaders.save().then(
                        (leaders) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(leaders)
                        } , (err) => next(err))
                                }
                else {
                    err = new Error('leaders ' + req.params.leadersId + ' not found')
                    err.status = 404
                    return next(err)
                }
            }, (err) => next(err)).catch((err) => next(err))
    })
    .put((req, res, next) => {
        res.statusCode = 403
        res.end('PUT operation not supported on /Leaders/' +
         req.params.leadersId + '/comments')
    })
    .delete((req, res, next) => {
        Leaders.findById(req.params.leadersId).then((leaders) => {
            if (leaders !=null) {
                leaders.comments.push(req.body)
                leaders.save().then(
                    (leaders) => {
                        for (let i=(leaders.comments.length -1);i>=0;i--) {
                            leaders.comments.id(leaders.comments[i]._id).remove()
                        }
                        leaders.save().then( // .save() saves the document
                            (leaders) => {
                                res.statusCode = 200
                                res.setHeader('Content-Type','application/json')
                                 res.json(leaders)
                            }
                        )
                    } , (err) => next(err)
                    )            }
            else {
                err = new Error('leaders ' + req.params.leadersId + ' not found')
                err.status = 404
                return next(err)
            }
        },(err) => next(err)).catch((err) => next(err))
    })
    
leaderRouter.route('/:leadersId/comments/:commentId') // mounting an express router at that location

.get((req, res, next) => {
    // res.end('Will send all the Leaders to you!') 
    Leaders.findById(req.params.leadersId).then( // accessing mongodb from express server
        (leaders) => {
            if (leaders != null && leaders.comments.id(req.params.commentId) != null) {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(leaders.comments.id(req.params.commentId))
            } else if (leaders == null) { // leaders mech mawjoud
                err = new Error('leaders ' + req.params.leadersId + ' not found !')
                err.status = 404
                return next(err)
            } else { //coment mech mawjoud
                err = new Error('Comment ' + req.params.commentId + ' not found ')
                err.status = 404
                return next(err)
            }
        }, (err) => next(err)).catch(
            (err) => next(err))
})
.post((req, res, next) => {
    res.statusCode = 403
    res.end('POST operation nto supported on /Leaders/' + req.params.body + '/comments/' + req.params.commentId)
})
.put((req, res, next) => {
    Leaders.findById(req.params.leadersId).then( // accessing mongodb from express server
        (leaders) => {
            if (leaders != null && leaders.comments.id(req.params.commentId) != null) {
                if (req.body.rating) {// u can only update the rating and the comment
                    leaders.comments.id(req.params.commentId).rating = req.body.rating
                }
                if (req.body.comment) {
                    leaders.comments.id(req.params.commentId).comment = req.body.comment
                }
                leaders.save()
                    .then(
                        (leaders) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(leaders)
                        }, (err) => next(err))
            } else if (leaders == null) {
                err = new Error('leaders ' + req.params.leadersId + ' not found !')
                err.status = 404
                return next(err)
            } else {
                err = new Error('Comment ' + req.params.commentId + ' not found ')
                err.status = 404
                return next(err)
            }
        }, (err) => next(err)).catch((err) => next(err))
})
.delete((req, res, next) => {
    Leaders.findById(req.params.leadersId).then((leaders) => {
        if (leaders != null && leaders.comments.id(req.params.commentId) != null) {
            leaders.comments.id(req.params.commentId).remove()
            leaders.save().then( // .save() saves the document
                (leaders) => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(leaders)
                }, (err) => next(err)
            )
        }
        else if (leaders == null) {
            err = new Error('leaders ' + req.params.leadersId + ' not found !')
            err.status = 404
            return next(err)
        } else {
            err = new Error('Comment ' + req.params.commentId + ' not found ')
            err.status = 404
            return next(err)
        }
    }, (err) => next(err)).catch((err) => next(err))
})


module.exports = leaderRouter