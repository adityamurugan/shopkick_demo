var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var usersScehma = new Schema({id: Number});
var Users = mongoose.model('Users', usersScehma, 'user_info');

var kicksSchema = new Schema({id: Number});
var Kicks = mongoose.model('Kicks', kicksSchema, 'kicks_activity');


module.exports = {Users: Users, Kicks: Kicks}