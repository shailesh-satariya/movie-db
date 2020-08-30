import {Movie} from "./movie";


export interface MovieVote {
    movie: Movie;
}

export interface VoteVariables {
    id: string;
    score: number;
}