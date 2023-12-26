const express = require('express');

/* GET home page. */
const router = express.Router();

router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

module.exports = router;
