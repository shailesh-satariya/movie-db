import {Movie} from "../types/graphql/movie";

let _movie: Movie | null = null;

export function setMovie(movie: Movie): void {
    _movie = movie;
}

export function getMovie(): Movie | null {
    let movie = _movie ? {..._movie} : null;
    _movie = null;
    return movie;
}
