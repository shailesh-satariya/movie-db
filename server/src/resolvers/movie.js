const { combineResolvers } = require( 'graphql-resolvers' );
const { ApolloError, UserInputError } = require( 'apollo-server' );

const { pubsub, EVENTS } = require( '../subscription' );
const { isAuthenticated, isMovieOwner } = require( './authorization' );
const { validateObjectId } = require( './validateObjectId' );

module.exports = {
    Query: {
        movies: async ( parent, { sort: sortArg, filter: filterArg, offset: offsetArg, limit: limitArg }, { models } ) => {
            const Movie = models.Movie;

            let sort = (typeof sortArg === 'string' && sortArg.trim().length) ? sortArg.trim() : 'title';
            let order = sort[ 0 ] === '-' ? -1 : 1;
            sort = sort[ 0 ] === '-' ? sort.substr( 1 ) : sort;

            const filter = (typeof filterArg === 'string' && filterArg.trim().length) ? {
                title: {
                    $regex: filterArg.trim(),
                    $options: 'i'
                }
            } : {};
            const offset = !isNaN( offsetArg ) ? Number( offsetArg ) : 0;
            const limit = !isNaN( limitArg ) ? Math.min( Number( limitArg ), 20 ) : 5;


            const count = await Movie.countDocuments( filter );
            const movies = await Movie.find( filter )
                .select( "-__v" )
                .sort( { [ sort ]: order } ).skip( offset ).limit( limit );

            return { count, movies };
        },
        movie: combineResolvers(
            validateObjectId,
            async ( parent, { id }, { models } ) => {
                const movie = await models.Movie.findById( id );
                if ( !movie ) {
                    throw new ApolloError( 'Movie not found' );
                }

                return movie;

            } ),
    },

    Mutation: {
        createMovie: combineResolvers(
            isAuthenticated,
            async ( parent, { title, releaseDate, duration }, { models, me } ) => {
                const Movie = models.Movie;
                const movieObj = {
                    title: title,
                    releaseDate: new Date( releaseDate ).toString(),
                    duration: Number( duration ),
                    userId: me._id
                };
                const { error } = Movie.validate( movieObj );
                if ( error ) {
                    throw new UserInputError( error );
                }

                const movie = new Movie( movieObj );
                await movie.save();

                await pubsub.publish( EVENTS.MESSAGE.ADDED, {
                    movieAdded: movie,
                } );

                return movie;
            },
        ),

        updateMovie: combineResolvers(
            isAuthenticated,
            isMovieOwner,
            async ( parent, { id, title, releaseDate, duration }, { models, me } ) => {
                const Movie = models.Movie;
                const movieObj = {
                    title: title,
                    releaseDate: new Date( releaseDate ).toString(),
                    duration: Number( duration ).toString(),
                    userId: me._id
                };

                const { error } = Movie.validate( movieObj );
                if ( error ) {
                    throw new UserInputError( error );
                }

                const movie = await Movie.findByIdAndUpdate(
                    id,
                    movieObj,
                    { new: true }
                );

                if ( !movie ) {
                    throw new ApolloError( 'Movie not found' );
                }

                await pubsub.publish( EVENTS.MESSAGE.UPDATED, {
                    movieUpdated: movie,
                } );

                return movie;
            },
        ),

        deleteMovie: combineResolvers(
            isAuthenticated,
            isMovieOwner,
            async ( parent, { id }, { models } ) => {
                const movie = await models.Movie.findById( id );

                if ( movie ) {
                    await movie.remove();

                    await pubsub.publish( EVENTS.MESSAGE.DELETED, {
                        movieDeleted: movie,
                    } );
                    return true;
                } else {
                    return false;
                }
            },
        ),

        voteMovie: combineResolvers(
            isAuthenticated,
            async ( parent, { id, score }, { models, me } ) => {
                const userId = me._id;
                const { Movie, Vote } = models;

                const movie = await Movie.findById( id ).select( "-__v" );
                if ( !movie ) {
                    throw new ApolloError( 'Movie not found' );
                }

                const voteObj = {
                    movieId: id,
                    userId: userId,
                    score: Number( score )
                };

                const { error } = Vote.validate( voteObj );
                if ( error ) {
                    throw new UserInputError( error );
                }

                let vote = await Vote.findOne( { movieId: id, userId } );

                // Re-vote if already exists
                if ( vote ) {
                    const oldScore = vote.score;
                    vote.score = score;
                    await vote.save();

                    movie.scores += (score - oldScore);
                    movie.rating = movie.scores / movie.votes;
                    await movie.save();
                }
                // New vote
                else {
                    vote = new Vote( voteObj );
                    await vote.save();

                    movie.scores += score;
                    movie.votes++;

                    movie.rating = movie.scores / movie.votes;
                    await movie.save();
                }

                await pubsub.publish( EVENTS.MESSAGE.UPDATED, {
                    movieUpdated: movie,
                } );

                return movie;

            },
        ),
    },

    Movie: {
        user: async ( movie, args, { loaders } ) => {
            return await loaders.user.load( movie.userId );
        },
        myVote: async ( movie, args, { models, me } ) => {
            if ( !me || !me._id ) {
                return 0;
            }

            let vote = await models.Vote.findOne( { movieId: movie._id, userId: me._id } );
            return vote ? vote.score : 0;
        },
    },

    Subscription: {
        movieAdded: {
            subscribe: () => pubsub.asyncIterator( EVENTS.MESSAGE.ADDED ),
        },
        movieUpdated: {
            subscribe: () => pubsub.asyncIterator( EVENTS.MESSAGE.UPDATED ),
        },
        movieDeleted: {
            subscribe: () => pubsub.asyncIterator( EVENTS.MESSAGE.DELETED ),
        },
    },
};
