import mongoose from "mongoose"
const Movie = mongoose.model('Movie', {
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    writer: {
        type: String,
        required: true
    }
})

export default Movie