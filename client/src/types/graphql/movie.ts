export interface Movie {
    __typename: "Movie";
    _id?: string;
    title: string;
    releaseDate: string;
    duration: number;
    userId?: string;
    rating?: number;
    myVote?: number;
}
