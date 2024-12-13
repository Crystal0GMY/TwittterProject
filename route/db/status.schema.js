const Schema = require('mongoose').Schema;


exports.StatusSchema = new Schema({
    // mongoose automically gives this an _id attribute of ObjectId
    username: {type: String, required: true},
    statusText: {type: String, required: true},
    createdTime: {type: Date, default: Date.now},
}, { collection : 'StatusTwitterProject' });