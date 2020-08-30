import React from 'react';

import {cleanup, render} from '../../test-utils';
import MovieForm from "../movie-form";
import {Movie} from "../../types/graphql/movie";
import {MemoryRouter} from "react-router";

describe('MovieForm', () => {
    // automatically unmount and cleanup DOM after the test is finished.
    afterEach(cleanup);

    it('renders without error', () => {
        render(
            <MemoryRouter>
                <MovieForm saveMovie={(movie: Movie) => (movie)} data={null}/>
            </MemoryRouter>
        );
    });
});
