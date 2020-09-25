const mongoose = require('mongoose')
const Schema = mongoose.Schema

const movieItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    backdrop_path: {
        type: String,
        required: true
    },
    poster_path: {
        type: String,
        required: true
    },
    vote_average: {
        type: Number,
        required: true
    },
    vote_count: {
        type: Number,
        required: true
    },
    release_date: {
        type: String,
        required: true
    },
    genres: {
        type: Array,
        required: true
    },
    overview: {
        type: String,
        required: true
    }
})

const movieItem = mongoose.model('movieDb', movieItemSchema)
module.exports = movieItem