const mongoose = require( 'mongoose' );
const joi = require( 'joi' );

const voteSchema = new mongoose.Schema( {
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
} );

voteSchema.statics.validate = function ( vote ) {
    const schema = joi.object({
        movieId: joi.string()
            .required(),
        userId: joi.string()
            .required(),
        score: joi.number()
            .min( 1 )
            .max( 5 )
            .required()
    });

    return schema.validate( vote );
};
const Vote = mongoose.model( "Vote", voteSchema );

module.exports = Vote;
