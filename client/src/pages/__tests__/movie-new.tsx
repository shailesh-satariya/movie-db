import React from "react";
import moment from "moment";
import {cleanup, fireEvent, renderApollo, waitForElement,} from '../../test-utils';
import {isLoggedInVar} from '../../cache';
import {sign} from 'jsonwebtoken';
import MovieNew from "../movie-new";
import auth from "../../services/auth-service";
import {CREATE_MOVIE} from "../../queries/movie";
import * as MovieCreateTypes from "../../types/graphql/movie-create";
import Movie from "../movie";
import {MemoryRouter} from "react-router";
import {InMemoryCache} from "@apollo/client";

export const cache: InMemoryCache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                isLoggedIn() {
                    return isLoggedInVar();
                },
                movies: {
                    keyArgs: false
                }
            }
        }
    }
});

const mockMovie = {
    __typename: 'Movie',
    _id: '5f43be78cba0f22b4cf98e2d',
    duration: 88,
    myVote: 2,
    rating: 1.5,
    releaseDate: "2020-08-27T00:00:00.000Z",
    title: "Die Hard",
    userId: "5f43be78cba0f22b4cf98e2d"
};

describe('New movie Page', () => {
    // automatically unmount and cleanup DOM after the test is finished.
    afterEach(cleanup);

    auth.login(sign({username: 'foo', password: 'bar'}, '123'));

    it('renders new movie page', async () => {
        renderApollo(<MemoryRouter><MovieNew/></MemoryRouter>);
    });

    it('fires new movie mutation and updates', async () => {

        const variables: MovieCreateTypes.MovieCreateVariables = {
            title: mockMovie.title,
            duration: mockMovie.duration,
            releaseDate: moment().format('YYYY-MM-DD')
        };
        const mocks = [
            {
                request: {
                    query: CREATE_MOVIE,
                    variables
                },
                result: {
                    data: {
                        createMovie: mockMovie,
                    }
                }
            }
        ];

        const {getByTestId} = await renderApollo(<MemoryRouter><MovieNew/></MemoryRouter>, {
            mocks,
            cache
        });

        fireEvent.change(getByTestId('title-input'), {
            target: {value: mockMovie.title},
        });

        fireEvent.change(getByTestId('duration-hours-select'), {
            target: {value: 1},
        });

        fireEvent.change(getByTestId('duration-minutes-select'), {
            target: {value: 28},
        });

        fireEvent.click(getByTestId('submit-btn'));

        // login is done if loader is gone
        await waitForElement(() => getByTestId('submit-btn'));
    });
});
