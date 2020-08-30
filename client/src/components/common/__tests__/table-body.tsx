import React from 'react';

import {cleanup, render} from '../../../test-utils';
import TableBody from "../table-body";
import {Movie} from "../../../types/graphql/movie";
import {Column} from "../../../types";
import {convertMinutesToDuration} from "../../../utils/helper";

const mockMovie: Movie = {
    __typename: 'Movie',
    _id: '5f43be78cba0f22b4cf98e2d',
    duration: 88,
    myVote: 2,
    rating: 1.5,
    releaseDate: "1980-07-02T00:00:00.000Z",
    title: "Airplane",
    userId: "5f43be78cba0f22b4cf98e2d"
};

const columns: Column[] = [
    {
        path: "title",
        label: "Title",
        sortable: true
    },
    {
        path: "duration",
        label: "Duration",
        sortable: true,
        content: (movie: Movie): string => {
            const [hours, minutes] = convertMinutesToDuration(movie.duration);

            return `${hours}h ${minutes}min`;
        }
    }
];

describe('TableBody', () => {
    // automatically unmount and cleanup DOM after the test is finished.
    afterEach(cleanup);

    it('renders without error', () => {
        render(
            <table>
                <TableBody records={[mockMovie]}
                           selectedRecord={mockMovie}
                           columns={columns}
                />
            </table>
        );
    });
});
