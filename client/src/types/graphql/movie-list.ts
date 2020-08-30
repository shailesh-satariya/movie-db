import {Movie} from "./movie";

export interface GetMovieList_movies {
    __typename: "MovieConnection";
    count: number;
    movies: Movie[];
}

export interface GetMovieList {
    movies: GetMovieList_movies;
}

export interface GetMovieListVariables {
    sort: string;
    filter: string;
    offset: number;
    limit: number;
}
