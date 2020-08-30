const { GraphQLDateTime } = require( 'graphql-iso-date' );

const userResolvers = require( './user' );
const movieResolvers = require( './movie' );

const customScalarResolver = {
    Date: GraphQLDateTime,
};

module.exports = [
    customScalarResolver,
    userResolvers,
    movieResolvers,
];
