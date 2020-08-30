import React from 'react';
import {InMemoryCache} from '@apollo/client';

import {cleanup, renderApollo, waitForElement,} from '../../test-utils';
import Movies from '../movies';
import {
    GET_MOVIES,
    MOVIE_CREATE_SUBSCRIPTION,
    MOVIE_DELETED_SUBSCRIPTION,
    MOVIE_UPDATED_SUBSCRIPTION
} from "../../queries/movie";
import * as GetMovieListTypes from "../../types/graphql/movie-list";

const mockMovie = {
    __typename: 'Movie',
    _id: '5f43be78cba0f22b4cf98e2d',
    duration: 88,
    myVote: 2,
    rating: 1.5,
    releaseDate: "1980-07-02T00:00:00.000Z",
    title: "Airplane",
    userId: "5f43be78cba0f22b4cf98e2d"
};

const mockMovie2 = {
    duration: 132,
    myVote: 0,
    rating: 3,
    releaseDate: "1988-07-20T00:00:00.000Z",
    title: "Die Hard",
    userId: "5f43be78cba0f22b4cf98e2d",
    __typename: "Movie",
    _id: "5f43be78cba0f22b4cf98e31"
}

describe('Movies Page', () => {
    // automatically unmount and cleanup DOM after the test is finished.
    afterEach(cleanup);

    it('renders movies', async () => {
        const variables: GetMovieListTypes.GetMovieListVariables = {limit: 4, offset: 0, sort: 'title', filter: ''};
        const cache = new InMemoryCache({addTypename: false});
        const mocks = [
            {
                request: {query: GET_MOVIES, variables},
                result: {
                    data: {
                        movies: {
                            count: 1,
                            movies: [mockMovie, mockMovie2],
                        },
                    },
                },
            },
            {
                request: {query: MOVIE_CREATE_SUBSCRIPTION},
                result: {
                    data: {
                        movieCreated: mockMovie,
                    },
                },
            },
            {
                request: {query: MOVIE_DELETED_SUBSCRIPTION},
                result: {
                    data: {
                        movieDeleted: mockMovie2,
                    },
                },
            },
            {
                request: {query: MOVIE_UPDATED_SUBSCRIPTION},
                result: {
                    data: {
                        movieUpdated: mockMovie,
                    },
                },
            },
        ];
        const {getByText} = await renderApollo(<Movies/>, {
            mocks,
            cache,
        });
        await waitForElement(() => getByText(/Airplane/i));
    });
});
