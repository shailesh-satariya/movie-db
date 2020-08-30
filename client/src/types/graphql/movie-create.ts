import {Movie} from "./movie";

export interface MovieCreate {
    movie: Movie;
}

export interface MovieCreateVariables {
    title: string;
    releaseDate: string;
    duration: number;
}