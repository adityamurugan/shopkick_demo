var mongoose = require("mongoose");
var Users = require('../models/index').Users
var Kicks = require('../models/index').Kicks

var today = new Date()
var priorDate = new Date(new Date().setDate(today.getDate()-30))

var uri = "mongodb+srv://adi:Aditya_1@cluster0-xaimo.mongodb.net/shopkick?retryWrites=true&w=majority";

var options = {
    server: {
        socketOptions: {
        keepAlive: 300000,
        connectTimeoutMS: 30000
        }
    },
    replset: {
        socketOptions: {
        keepAlive: 300000,
        connectTimeoutMS: 30000
        }
    } 
};

mongoose.connect(uri, options);

async function queryUsers(){
    data = new Object()
    data.totalCount = await Users.countDocuments()
    data.monthCount = await Users.countDocuments({'signup_date': {"$lt": today, "$gte": priorDate}})
    var pipeline = [
        {
            "$match":{
                'kick_timestamp': {"$lt": today, "$gte": priorDate}
            }
        },
        {
            "$group":{
                "_id": null,
                "total": { 
                    "$sum": "$kicks" 
                } 
            }
        }
    ];
    monthKicks = await Kicks.aggregate(pipeline)
    data.monthTotal = monthKicks[0].total
    activeUsers = await Kicks.distinct("user_id", {'kick_timestamp': {"$lt": today, "$gte": priorDate}})
    data.activeUsers = activeUsers.length
    /*res = await Kicks.aggregate([{
        $lookup:
          {
            from: "user_info",
            localField: "user_id",
            foreignField: "id",
            as: "users"
          }
        },
        { "$unwind": "$users" }
      ])
    console.log(res)*/
    return data
}

async function queryTopUsers(){
    var pipeline = [
        {
            "$match":{
                'kick_timestamp': {"$lt": today, "$gte": priorDate}
            }
        },
        {
            "$group":{
                "_id": '$user_id',
                "total": { 
                    "$sum": "$kicks" 
                } 
            }
        },
        { "$sort": { "total": -1 } },
        { "$limit": 10 },
        {
            $lookup:
              {
                from: "user_info",
                localField: "_id",
                foreignField: "id",
                as: "users"
              }
        },
        { "$unwind": "$users" }
    ];
    res = await Kicks.aggregate(pipeline)
    return res
}

async function queryProducts(){
    var pipeline = [
        {
            "$match":{
                'kick_timestamp': {"$lt": today, "$gte": priorDate}
            }
        },
        {
            "$group":{
                "_id": '$product_id',
                "total": { 
                    "$sum": "$kicks" 
                } 
            }
        },
        { "$sort": { "total": -1 } },
        { "$limit": 3 },
        {
            $lookup:
              {
                from: "product_category",
                localField: "_id",
                foreignField: "id",
                as: "product"
              }
        },
        { "$unwind": "$product" }
    ];
    res = await Kicks.aggregate(pipeline)
    return res
}

module.exports = {queryUsers: queryUsers, queryTopUsers: queryTopUsers, queryProducts:queryProducts}