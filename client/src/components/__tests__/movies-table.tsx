import React from 'react';

import {cleanup, render} from '../../test-utils';
import MoviesTable from "../movies-table";
import {Movie} from "../../types/graphql/movie";

const mockMovie: Movie = {
    __typename: 'Movie',
    _id: '5f43be78cba0f22b4cf98e2d',
    duration: 88,
    myVote: 2,
    rating: 1.5,
    releaseDate: "1980-07-02T00:00:00.000Z",
    title: "Airplane",
    userId: "5f43be78cba0f22b4cf98e2d"
}

describe('LoginForm', () => {
    // automatically unmount and cleanup DOM after the test is finished.
    afterEach(cleanup);

    it('renders without error', () => {
        render(
            <MoviesTable movies={[mockMovie]}
                         onSort={((sort: string) => (sort))}
                         onDelete={(movie: Movie) => (movie)}
                         onRate={(movie: Movie, score: number) => ([movie, score])}
                         sort={''}
                         selectedMovie={null}
            />
        );
    });
});
