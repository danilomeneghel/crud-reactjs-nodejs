const passport = require("passport"),
    User = require("../models/user"),
    mongoose = require('mongoose')

var ObjectId = mongoose.Types.ObjectId

exports.usersList = (req, res) => {
    User.find()
    .exec((err, results) => {
        if (err) return res.send(err)

        res.status(200).json(results)
    })
}

exports.userCreate = (req, res) => {
    User.create(req.body.item)
    .then((result) => {
        if (!result) return res.status(400).json(false)

        res.status(201).json(true)
    })
}

exports.userUpdate = (req, res) => {
    User.updateOne({_id: ObjectId(req.params.id)}, {
        $set: {
            name: req.body.item.name,
            email: req.body.item.email,
            username: req.body.item.username,
            password: req.body.item.password,
            role: req.body.item.role,
            status: req.body.item.status,
        }
    })
    .then((result) => {
        if (!result) return res.status(400).json(false)
        
        res.status(201).json(true)
    })
}

exports.userRemove = (req, res) => {
    User.deleteOne({_id: ObjectId(req.params.id)}, 
    (err) => {
        if (err) return res.status(400).json(false)

        res.status(200).json(true)
    })
}

exports.users = (req, res) => {
    User.find()
    .exec((err, results) => {
        if (err) return res.send(err)

        res.render('users', { data: results })
    })
}

exports.pageAdd = (req, res) => {
    res.render("user-add", { message: {} })
}

exports.userAdd = (req, res) => {
    User.register(new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        role: req.body.role,
        status: req.body.status
    }), req.body.password, 
    (err) => {
        if (err) return res.render('user-add', { message: {'error': err} }) 

        res.redirect("/users")
    })
}

exports.pageEdit = (req, res) => {
    User.findOne({_id: ObjectId(req.params.id)}).exec((err, result) => {
        if (err) return res.send(err)
        
        res.render('user-edit', { data: result, message: {} })
    })
}

exports.userEdit = (req, res) => {
    User.findOne({_id: ObjectId(req.params.id)})
    .then((user) => {
        user.setPassword(req.body.password, (err, user) => {
            if (err) return res.render('user-edit', { message: {'error': err} }) 

            user.name = req.body.name
            user.email = req.body.email
            user.username = req.body.username
            user.role = req.body.role
            user.status = req.body.status
            user.save()

            res.redirect("/users")
        })
    })
}

exports.pageProfile = (req, res) => {
    User.find({_id: req.user.id})
    .exec((err, result) => {
        if (err) return res.send(err)
        
        res.render('profile', { data: result, message: {} })
    })
}

exports.editProfile = (req, res) => {
    User.findByIdAndUpdate(req.user.id, {
        $set: {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username
        }
    }, (err, user) => {
        if (err) return res.render('profile', { message: req.flash('error', err) }) 
        
        user.setPassword(req.body.password, (err, user) => {
            if (err) return res.render('profile', { message: req.flash('error', err) }) 

            user.name = req.body.name
            user.email = req.body.email
            user.username = req.body.username
            user.save()
        })
    })
    .exec((err, result) => {
        if (err) return res.render('profile', { message: {'error': err} }) 
        
        res.render('profile', { data: [result], message: {'success': 'Profile updated success!'} })
    })
}

exports.userDelete = (req, res) => {
    User.deleteOne({_id: ObjectId(req.params.id)}, 
    (err) => {
        if (err) return res.send(err)

        res.redirect('/users')
    })
}

exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) return next()

    res.redirect("/login")
}
