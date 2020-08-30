import React from 'react';
import {cleanup, renderApollo, waitForElement,} from '../../test-utils';
import Movie from '../movie';
import {GET_MOVIE_DETAILS} from "../../queries/movie";

import {createLocation, createMemoryHistory} from 'history';
import {match, MemoryRouter} from 'react-router';
import auth from "../../services/auth-service";
import {sign} from "jsonwebtoken";

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

describe('Movie Page', () => {
    // automatically unmount and cleanup DOM after the test is finished.
    afterEach(cleanup);

    it('renders movie', async () => {

        auth.login(sign({username: 'foo', password: 'bar'}, '123'));
        const movieId: string = mockMovie._id;
        const mocks = [
            {
                request: {query: GET_MOVIE_DETAILS, variables: {movieId}},
                result: {
                    data: {
                        movie: mockMovie
                    }
                },
            }
        ];

        const history = createMemoryHistory();
        const path = `/movie/:movieId`;

        const match: match<{ movieId: string }> = {
            isExact: false,
            path,
            url: path.replace(':movieId', movieId),
            params: {movieId}
        };

        const location = createLocation(match.url);

        const {getByTestId} = await renderApollo(<MemoryRouter><Movie history={history}
                                                                      location={location}
                                                                      match={match}/></MemoryRouter>, {
            mocks,
            resolvers: {}
        });
        await waitForElement(() => getByTestId('submit-btn'));
    });
});
