import React, {Fragment} from 'react';
import moment from "moment";
import {MovieForm} from '../components';
import {Movie} from "../types/graphql/movie";
import {useMutation} from "@apollo/client";
import * as MovieCreateTypes from "../types/graphql/movie-create";
import {CREATE_MOVIE} from "../queries/movie";
import {useHistory} from "react-router-dom";
import {toast} from "react-toastify";
import * as MovieService from "../services/movie-service";

/**
 * New movie page component -> url: /movie/new
 *
 * @constructor
 *
 * @return JSX.Element
 */
const MovieNew: React.FC = (): JSX.Element => {
    const history = useHistory();
    const movie: Movie = {releaseDate: moment().format('YYYY-MM-DD'), title: '', duration: 0, __typename: "Movie"};

    const [createMovie] = useMutation<MovieCreateTypes.MovieCreate,
        MovieCreateTypes.MovieCreateVariables>(
        CREATE_MOVIE,
        {
            onCompleted(data: any) {
                MovieService.setMovie(data.createMovie as Movie);
                toast.success("Movie created.");
                history.push("/movies");
            }
        }
    );

    const handleCreate = async (movie: Movie): Promise<void> => {
        await createMovie({
            variables: {
                title: movie.title,
                duration: movie.duration,
                releaseDate: movie.releaseDate
            }
        });
    }

    return (
        <Fragment>
            <MovieForm data={movie} saveMovie={handleCreate}/>
        </Fragment>
    );
}

export default MovieNew;
