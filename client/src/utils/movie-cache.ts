import {ApolloCache} from "@apollo/client";
import {GET_MOVIES} from "../queries/movie";

export function deleteCacheEntry(cache: ApolloCache<any>, movieId: string): boolean {
    const data: any = cache.readQuery({query: GET_MOVIES});

    if (data?.movies) {
        const m: any = data.movies;
        if (m?.movies && m?.__typename && 'count' in m && Array.isArray(m.movies)) {
            const moviesArr = m.movies.filter((movie: any) => (movie._id !== movieId));

            cache.writeQuery({
                query: GET_MOVIES,
                data: {
                    movies: {
                        count: parseInt(m.count) - 1,
                        movies: moviesArr,
                        __typename: m.movies.__typename,
                    }
                }
            });

            return true;
        }
    }

    return false;
}


export function newMovieEntry(cache: ApolloCache<any>): void {
    const data: any = cache.readQuery({query: GET_MOVIES});

    if (data?.movies) {
        const m: any = data.movies;
        if (m?.movies && m?.__typename && 'count' in m && Array.isArray(m.movies)) {
            cache.writeQuery({
                query: GET_MOVIES,
                data: {
                    movies: {
                        count: parseInt(m.count) + 1,
                        movies: m.movies,
                        __typename: m.movies.__typename,
                    }
                }
            });

            return;
        }
    }
}
