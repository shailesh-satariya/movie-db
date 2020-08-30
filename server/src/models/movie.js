const mongoose = require( 'mongoose' );
const joi = require( 'joi' );

const movieSchema = new mongoose.Schema( {
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
        default: 0,
    },
    votes: {
        type: Number,
        default: 0
    },
    scores: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
} );

movieSchema.statics.validate = function ( movie ) {
    const schema = joi.object({
        title: joi.string()
            .min( 5 )
            .max( 50 )
            .required(),
        releaseDate: joi.date()
            .required(),
        duration: joi.number()
            .min( 0 )
            .required(),
        votes: joi.number(),
        scores: joi.number(),
        rating: joi.number(),
        date: joi.date(),
        userId: joi.string()
            .required(),
    });

    return schema.validate( movie );
};

const Movie = mongoose.model( "Movie", movieSchema );

module.exports = Movie;
