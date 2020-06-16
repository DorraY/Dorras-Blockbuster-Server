const express = require('express')
const bodyParser = require('body-parser')

const Promotions = require('../models/promotions')

const promoRouter = express.Router()

promoRouter.use(bodyParser.json())

promoRouter.route('/').all(
    (req,res,next) => {
        res.statusCode = 200
        res.setHeader('Content-Type','text/plain')
        next()
    }
).get((req,res,next) => {
    Promotions.find({}).then(
        (promotions) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(promotions)
        }, (err) => next(err)).catch(
            (err) => next(err)
        )
}).post(
    (req,res,next)=> {
    Promotions.create(req.body).then(
        (promotion) => {
            console.log('Promotion created', promotion)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(promotion)
        }, (err) => next(err)).catch((err) => next(err))
}).put(
    (req,res,next) => {
        res.statusCode = 403
        res.end('PUT operation not supported on /promotions')
}).delete((req,res,next)=>  {
        Promotions.remove({}).then((resp) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(resp)
        }, (err) => next(err)).catch((err) => next(err)) 
    })

promoRouter.route('/:promoId').all(
    (req,res,next) => {
        res.statusCode = 200
        res.setHeader('Content-Type','text/plain')
        next()
    }
).get(
    (req,res,next) => {
        Promotions.findById(req.params.promoId).then(
            (promotion) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(promotion)
            }, (err) => next(err)).catch((err) => next(err)).catch((err) => next(err)) 
    }).post(
        (req,res,next) => {
            res.statusCode = 403
            res.end('POST operation not supported on /promotions/' + req.params.promoId)
}).put(
    (req,res,next) => {
        Promotions.findByIdAndUpdate(req.params.promoId, {
            $set:req.body
        }, {new:true}).then((promotion) => {
            res.statusCode = 200
            res.setHeader('Content-Type','application/json')
            res.json(promotion)
        }, (err) =>next(err)).catch(
            (err) => next(err)
        ).catch((err) => next(err))
    }
).delete(
    (req,res,next) => {
        Promotions.findByIdAndRemove(req.params.promoId).then((resp) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(promotion)
        }, (err) => next(err)).catch((err) => next(err))

    })

    promoRouter.route('/:promotionId/comments') // mounting an express router at /
    // .all((req,res,next) => {
    //     res.statusCode = 200
    //     res.setHeader('Content-Type', 'text/plain')
    //     next()
    // })
    .get((req,res,next) => {
        // res.end('Will send all the Promotions to you!')
        Promotions.findById(req.params.promotionId).then( // accessing mongodb from express server
            (promotion) => {
                if (promotion !=null) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(promotion.comments)
                }
                else {
                    err = new Error('promotion ' + req.params.promotionId + ' not found')
                    err.status = 404
                    return next(err)
                }
            }, (err) => next(err)).catch(
                (err) => next(err))
    })
    .post((req, res, next) => {
        // res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description)
        Promotions.findById(req.params.promotionId).then(
            (promotion) => {
                if (promotion !=null) {
                    promotion.comments.push(req.body)
                    promotion.save().then(
                        (promotion) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(promotion)
                        } , (err) => next(err))
                                }
                else {
                    err = new Error('promotion ' + req.params.promotionId + ' not found')
                    err.status = 404
                    return next(err)
                }
            }, (err) => next(err)).catch((err) => next(err))
    })
    .put((req, res, next) => {
        res.statusCode = 403
        res.end('PUT operation not supported on /Promotions/' +
         req.params.promotionId + '/comments')
    })
    .delete((req, res, next) => {
        Promotions.findById(req.params.promotionId).then((promotion) => {
            if (promotion !=null) {
                promotion.comments.push(req.body)
                promotion.save().then(
                    (promotion) => {
                        for (let i=(promotion.comments.length -1);i>=0;i--) {
                            promotion.comments.id(promotion.comments[i]._id).remove()
                        }
                        promotion.save().then( // .save() saves the document
                            (promotion) => {
                                res.statusCode = 200
                                res.setHeader('Content-Type','application/json')
                                 res.json(promotion)
                            }
                        )
                    } , (err) => next(err)
                    )            }
            else {
                err = new Error('promotion ' + req.params.promotionId + ' not found')
                err.status = 404
                return next(err)
            }
        },(err) => next(err)).catch((err) => next(err))
    })
    
promoRouter.route('/:promotionId/comments/:commentId') // mounting an express router at that location

.get((req, res, next) => {
    // res.end('Will send all the Promotions to you!') 
    Promotions.findById(req.params.promotionId).then( // accessing mongodb from express server
        (promotion) => {
            if (promotion != null && promotion.comments.id(req.params.commentId) != null) {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(promotion.comments.id(req.params.commentId))
            } else if (promotion == null) { // promotion mech mawjoud
                err = new Error('promotion ' + req.params.promotionId + ' not found !')
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
    res.end('POST operation nto supported on /Promotions/' + req.params.body + '/comments/' + req.params.commentId)
})
.put((req, res, next) => {
    Promotions.findById(req.params.promotionId).then( // accessing mongodb from express server
        (promotion) => {
            if (promotion != null && promotion.comments.id(req.params.commentId) != null) {
                if (req.body.rating) {// u can only update the rating and the comment
                    promotion.comments.id(req.params.commentId).rating = req.body.rating
                }
                if (req.body.comment) {
                    promotion.comments.id(req.params.commentId).comment = req.body.comment
                }
                promotion.save()
                    .then(
                        (promotion) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(promotion)
                        }, (err) => next(err))
            } else if (promotion == null) {
                err = new Error('promotion ' + req.params.promotionId + ' not found !')
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
    Promotions.findById(req.params.promotionId).then((promotion) => {
        if (promotion != null && promotion.comments.id(req.params.commentId) != null) {
            promotion.comments.id(req.params.commentId).remove()
            promotion.save().then( // .save() saves the document
                (promotion) => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(promotion)
                }, (err) => next(err)
            )
        }
        else if (promotion == null) {
            err = new Error('promotion ' + req.params.promotionId + ' not found !')
            err.status = 404
            return next(err)
        } else {
            err = new Error('Comment ' + req.params.commentId + ' not found ')
            err.status = 404
            return next(err)
        }
    }, (err) => next(err)).catch((err) => next(err))
})


module.exports = promoRouter