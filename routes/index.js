var express = require('express');
var router = express.Router();
var {queryUsers, queryTopUsers, queryProducts} = require("../actions/index")


/* GET home page. */
router.get('/', async function(req, res, next) {
    summaryRes = await queryUsers()
    topUsers = await queryTopUsers()
    topProducts = await queryProducts()
    res.render('index', {summaryData: summaryRes, topUsers: topUsers, topProducts: topProducts});
});

module.exports = router;