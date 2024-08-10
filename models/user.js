// Authentication

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

// passport-Local-Mongoose automaticly add usename and password in Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
})

// Passport-Local Mongoose plugged in
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema)