const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

const Story = require('../models/story')

// @desc Show add page
// @route GET /stories/add
router.get('/add', ensureAuth,(req, res) => {
    res.render('stories/add');
});

// @desc Process add from
// @route GET /stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error);
        res.render('error/500')
    }
});



module.exports = router;
