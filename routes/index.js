var express = require('express');
var router = express.Router();
var {queryUsers, queryTopUsers, queryProducts, queryActive, queryCats} = require("../actions/index")


/* GET home page. */
router.get('/', async function(req, res, next) {
    catKicks = await queryCats()
    summaryRes = await queryUsers()
    var mnth = new Date().getMonth() + 1
    topUsers = await queryTopUsers(mnth)
    topProducts = await queryProducts()
    trendData = await queryActive()
    res.render('index', {summaryData: summaryRes, topUsers: topUsers, topProducts: topProducts, trendData: trendData, catKicks: catKicks});
});

router.post('/queryMonthly', async function(req, res, next) {
    summaryRes = await queryTopUsers(req.body.month)
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(summaryRes));
});

module.exports = router;