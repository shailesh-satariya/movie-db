import React, {Fragment} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {toast} from "react-toastify";

import {GET_MOVIE_DETAILS, UPDATE_MOVIE} from '../queries/movie';
import {MovieForm} from '../components';
import * as MovieDetailsTypes from '../types/graphql/movie-details';
import {Loader} from "../components/common";
import NotFound from "./not-found";
import * as MovieUpdateTypes from "../types/graphql/movie-update";
import {useHistory} from "react-router-dom";
import {Movie} from "../types/graphql/movie";
import * as MovieService from '../services/movie-service';


interface MovieUpdateProps {
    movieId: string
}

/**
 * Movie edit page component -> url: /movie/:id
 *
 * @param props MovieUpdateProps
 * @constructor
 *
 * @return JSX.Element
 */
const MovieUpdate: React.FC<MovieUpdateProps> = ({movieId}: MovieUpdateProps): JSX.Element => {
    const history = useHistory();

    const {
        data,
        loading,
        error,
    } = useQuery<MovieDetailsTypes.MovieDetails,
        MovieDetailsTypes.MovieDetailsVariables>(GET_MOVIE_DETAILS,
        {variables: {movieId}}
    );

    const [updateMovie] = useMutation<MovieUpdateTypes.MovieUpdate,
        MovieUpdateTypes.MovieUpdateVariables>(
        UPDATE_MOVIE,
        {
            onCompleted(data: any) {
                MovieService.setMovie(data.updateMovie as Movie);
                toast.success("Movie updated.");
                history.push("/movies");
            }
        }
    );

    if (loading) return <Loader/>;
    if (error) return <p>ERROR: {error.message}</p>;
    if (!data) return <NotFound/>;

    const handleUpdate = async (movie: Movie): Promise<void> => {
        if (!movie._id) {
            return;
        }

        await updateMovie({
            variables: {
                id: movie._id,
                title: movie.title,
                duration: movie.duration,
                releaseDate: movie.releaseDate
            }
        });
    }

    return (
        <Fragment>
            <MovieForm data={data.movie} saveMovie={handleUpdate}/>
        </Fragment>
    );
}

export default MovieUpdate;
