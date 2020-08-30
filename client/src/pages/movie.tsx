import React, {Fragment} from 'react';
import {RouteComponentProps} from "react-router";
import MovieNew from "./movie-new";
import MovieUpdate from "./movie-update";

interface MovieProps extends RouteComponentProps<{ movieId: string }> {
}

/**
 * Movie page component -> url: /movie/:id
 *
 * @param props MovieProps
 * @constructor
 *
 * @return JSX.Element
 */
const Movie: React.FC<MovieProps> = (props: MovieProps): JSX.Element => {
    const movieId: string = props.match.params.movieId || '';

    return (
        <Fragment>
            {
                movieId === 'new' ?
                    <MovieNew/> :
                    <MovieUpdate movieId={movieId}/>
            }
        </Fragment>
    );
}

export default Movie;
