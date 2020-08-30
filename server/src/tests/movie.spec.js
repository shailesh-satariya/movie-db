const { expect } = require( 'chai' );
const api = require( './api' );
const connectDb = require( '../startup/db' );
const models = require( '../models' );

const mongoose = require( 'mongoose' );

let db;

jest.setTimeout( 30000 );

const newMovie = {
    title: 'Tenet',
    releaseDate: '2020-08-27T00:00:00.000Z',
    duration: 150,
};

let expectedMovie;

beforeAll( async () => {
    db = await connectDb();

    const movies = await models.Movie.find()
        .select( "-__v" )
        .sort( { title: -1 } ).skip( 0 ).limit( 1 );

    expectedMovie = movies.length ? movies[ 0 ]._doc : {};

    if ( expectedMovie._id ) {
        expectedMovie.releaseDate = expectedMovie.releaseDate.toISOString();
        expectedMovie._id = expectedMovie._id.toString();
    }
} );

describe( 'Movies', () => {
    describe( 'movie', () => {
        it( 'returns a movie when movie can be found', async () => {
            const expectedResult = {
                data: {
                    movie: {
                        _id: expectedMovie._id,
                        releaseDate: expectedMovie.releaseDate,
                        duration: expectedMovie.duration,
                        title: expectedMovie.title,
                        rating: expectedMovie.rating
                    },
                },
            };

            const result = await api.movie( { id: expectedMovie._id } );

            expect( result.data ).to.eql( expectedResult );
        } );

        it( 'returns error when movie cannot be found', async () => {
            const {
                data: { errors },
            } = await api.movie( {
                id: new mongoose.Types.ObjectId(),
            } );

            expect( errors[ 0 ].message ).to.eql( 'Movie not found' );
        } );
    } );

    describe( 'movies (sort: String, filter: String, limit: INT, Offset: INT)', () => {
        it( 'returns a list of movies', async () => {
            const expectedResult = {
                data: {
                    movies: {
                        movies: [
                            {
                                title: 'Airplane',
                            },
                            {
                                title: 'Die Hard',
                            },
                        ],
                    },
                },
            };

            const result = await api.movies();

            expect( result.data ).to.eql( expectedResult );
        } );

        it( 'should get movies with the users', async () => {
            const expectedResult = {
                data: {
                    movies: {
                        count: '12',
                        movies: [
                            {
                                title: 'Airplane',
                                user: {
                                    username: 'foo.bar',
                                },
                            },
                            {
                                title: 'Die Hard',
                                user: {
                                    username: 'foo.bar',
                                },
                            },
                        ],
                    },
                },
            };

            const result = await api.moviesInclUsers();

            expect( result.data ).to.eql( expectedResult );
        } );
    } );

    describe( 'createMovie', () => {
        it( 'Create movie without user', async () => {
            const {
                data: { errors },
            } = await api.createMovie( newMovie );

            expect( errors[ 0 ].message ).to.eql( 'Not authenticated as user.' );
        } );

        it( 'Create movie', async () => {
            const {
                data: {
                    data: {
                        login: { token },
                    },
                },
            } = await api.login( {
                username: 'foo.bar',
                password: 'foobar',
            } );

            expect( token ).to.be.a( 'string' );

            const expectedResult = {
                data: {
                    createMovie: newMovie,
                },
            };

            let result = await api.createMovie( newMovie, token );

            expect( result.data ).to.eql( expectedResult );
        } );
    } );

    describe( 'updateMovie', () => {
        it( 'Update movie', async () => {
            const {
                data: {
                    data: {
                        login: { token },
                    },
                },
            } = await api.login( {
                username: 'foo.bar',
                password: 'foobar',
            } );

            expect( token ).to.be.a( 'string' );

            const updateMovie = {
                _id: expectedMovie._id,
                title: "My movie",
                releaseDate: expectedMovie.releaseDate,
                duration: expectedMovie.duration
            };

            const expectedResult = {
                data: {
                    updateMovie,
                },
            };

            let result = await api.updateMovie( {
                id: updateMovie._id,
                title: updateMovie.title,
                releaseDate: updateMovie.releaseDate,
                duration: updateMovie.duration
            }, token );

            expect( result.data ).to.eql( expectedResult );
        } );
    } );

    describe( 'voteMovie', () => {
        it( 'Vote movie', async () => {
            const {
                data: {
                    data: {
                        login: { token },
                    },
                },
            } = await api.login( {
                username: 'foo.bar',
                password: 'foobar',
            } );

            expect( token ).to.be.a( 'string' );

            const score = 3;

            const voteMovie = {
                _id: expectedMovie._id,
                rating: score,
                myVote: score

            };

            const expectedResult = {
                data: {
                    voteMovie,
                },
            };

            let result = await api.voteMovie( {
                id: voteMovie._id,
                score
            }, token );

            expect( result.data ).to.eql( expectedResult );
        } );
    } );

    describe( 'deleteMovie', () => {
        it( 'Delete movie', async () => {
            const {
                data: {
                    data: {
                        login: { token },
                    },
                },
            } = await api.login( {
                username: 'foo.bar',
                password: 'foobar',
            } );

            expect( token ).to.be.a( 'string' );

            const {
                data: {
                    data: { deleteMovie },
                },
            } = await api.deleteMovie( {
                id: expectedMovie._id
            }, token );

            expect( deleteMovie ).to.eql( true );
        } );
    } );
} );
