const express = require('express');
const router = express.Router();

const { ensureAuthenticated } = require('../helpers/auth');

const mongoose = require('mongoose');
require('../models/Idea');
const Idea = mongoose.model('ideas');

router.get('/', ensureAuthenticated, function (req, res) {
    Idea.find({ user: req.user.id }).sort({ date: 'desc' }).then(ideas => {
        res.render('notes/index', { ideas: ideas });
    });

});
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id,
        user: req.user.id
    }).then(idea => {
        if (idea) {
            res.render("notes/edit", {
                idea: idea
            });
        }
        else { 
            res.redirect('/notes');
        }
    })

});

router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: "please add a title" });
    }
    if (errors.length > 0) {
        res.render('notes/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }
    else {
        const newNote = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        };
        new Idea(newNote).save().then(idea => {
            req.flash("success_msg", "Notes added");
            res.redirect('/notes');
        });
    }
});

router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findById(req.params.id).then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save().then(idea => {
            req.flash("success_msg", "Notes updated");
            res.redirect('/notes');
        });
    });
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.findByIdAndRemove(req.params.id).then(() => {
        req.flash("success_msg", "Notes removed");
        res.redirect('/notes');
    })
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('notes/add');
});


module.exports = router;