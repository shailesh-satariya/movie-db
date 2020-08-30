import {Movie} from "./movie";

export interface MovieUpdate {
    movie: Movie;
}

export interface MovieUpdateVariables {
    id: string;
    title: string;
    releaseDate: string;
    duration: number;
}