import {Movie} from "./movie";

export interface MovieDetails {
    movie: Movie | null;
}

export interface MovieDetailsVariables {
    movieId: string;
}
