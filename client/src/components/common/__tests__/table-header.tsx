import React from 'react';

import {cleanup, render} from '../../../test-utils';
import {Movie} from "../../../types/graphql/movie";
import {Column} from "../../../types";
import {convertMinutesToDuration} from "../../../utils/helper";
import TableHeader from "../table-header";

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

describe('TableHeader', () => {
    // automatically unmount and cleanup DOM after the test is finished.
    afterEach(cleanup);

    it('renders without error', () => {
        render(
            <table>
                <TableHeader
                    columns={columns}
                    onSort={((sort: string) => sort)}
                    sort={'title'}
                />
            </table>
        );
    });
});
