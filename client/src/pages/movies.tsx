import React, {useState} from 'react';
import {ApolloCache, ApolloError, useMutation, useQuery, useSubscription} from '@apollo/client';
import {toast} from "react-toastify";
import Loader from '../components/common/loader';

import * as GetMovieListTypes from '../types/graphql/movie-list';
import * as VoteTypes from "../types/graphql/movie-vote";
import * as DeleteTypes from "../types/graphql/movie-delete";
import {
    DELETE_MOVIE,
    GET_MOVIES,
    MOVIE_CREATE_SUBSCRIPTION,
    MOVIE_DELETED_SUBSCRIPTION,
    MOVIE_UPDATED_SUBSCRIPTION,
    VOTE_MOVIE
} from "../queries/movie";
import {MoviesTable} from "../components";
import {SearchBox} from "../components/form";
import {Movie} from "../types/graphql/movie";
import {CookieService} from "../services/cookie-service";
import {Pagination} from "../components/common";
import * as MovieCacheUtils from "../utils/movie-cache";
import * as UrlUtils from "../utils/url";
import * as HelperUtils from "../utils/helper";
import {OperationVariables} from "@apollo/client/core";
import * as MovieService from '../services/movie-service';

/**
 * Movies page component -> url: /movies
 *
 * @constructor
 *
 * @return JSX.Element
 */
const Movies: React.FC = (): JSX.Element => {
    const cookieVariableKey: string = 'variable';
    const urlParams: Record<string, string> = UrlUtils.getUrlParams();
    const cookieParams: any = CookieService.getValue(cookieVariableKey) || {};
    const limit: number = 4;
    const page: number = HelperUtils.isValidNumber(urlParams.page) ? parseInt(urlParams.page) :
        (HelperUtils.isValidNumber(cookieParams?.page) ? parseInt(cookieParams.page) : 1);

    const initVariables: GetMovieListTypes.GetMovieListVariables = {
        sort: (urlParams.sort || cookieParams.sort || 'title').toString(),
        filter: (urlParams.filter || cookieParams.filter || '').toString(),
        offset: (page - 1) * limit,
        limit: limit,
    };


    const [isRefetching, setIsRefetching] = useState(false);
    const [variables, setStateVariables] = useState(initVariables);

    // Fetch movies
    const {
        data,
        loading,
        error,
        refetch
    } = useQuery<GetMovieListTypes.GetMovieList,
        GetMovieListTypes.GetMovieListVariables>(GET_MOVIES, {variables});

    // Use create subscription
    useSubscription(MOVIE_CREATE_SUBSCRIPTION, {
        onSubscriptionData: ({client}) => {
            try {
                MovieCacheUtils.newMovieEntry(client.cache);
            } catch (e) {

            }
        }
    });

    // Use update subscription
    useSubscription(MOVIE_UPDATED_SUBSCRIPTION);

    // Use delete subscription
    useSubscription(MOVIE_DELETED_SUBSCRIPTION, {
        onSubscriptionData: ({client, subscriptionData}) => {
            try {
                MovieCacheUtils.deleteCacheEntry(client.cache, subscriptionData.data.movieDeleted._id);
            } catch (e) {

            }
        }
    });

    // Refetch
    const refetchMovies = async (variables: OperationVariables): Promise<void> => {
        try {
            await refetch(variables);
        } catch (e) {
        }
    };

    const setVariables = async (key: 'sort' | 'filter' | 'page', value: string): Promise<void> => {
        cookieParams[key] = value;
        CookieService.setValue(cookieVariableKey, cookieParams);
        UrlUtils.setUrlParams({[key]: value});

        const newStateVariables = {...variables};
        if (key === 'page') {
            newStateVariables.offset = newStateVariables.limit * (parseInt(value) - 1);
        } else {
            newStateVariables.offset = 0;
            newStateVariables[key] = value;
        }

        setIsRefetching(true);
        await refetchMovies(newStateVariables);
        setStateVariables(newStateVariables);
        setIsRefetching(false);
    };

    // Vote movie
    const [voteMovie] = useMutation<VoteTypes.MovieVote,
        VoteTypes.VoteVariables>(
        VOTE_MOVIE, {
            onError: (error: ApolloError) => {
                toast.error(error.message);
            }
        }
    );

    // Delete movie
    const [deleteMovie] = useMutation<DeleteTypes.MovieDelete,
        DeleteTypes.MovieDeleteVariables>(
        DELETE_MOVIE, {
            onError: (error: ApolloError) => {
                toast.error(error.message);
            }
        }
    );

    // Handle deletion
    const handleDelete = async (movie: Movie): Promise<void> => {
        if (movie._id) {
            const id: string = movie._id;
            await deleteMovie({
                variables: {id},
                update: (cache: ApolloCache<any>) => {
                    try {
                        if (MovieCacheUtils.deleteCacheEntry(cache, id)) {
                            return;
                        }
                    } catch (e) {

                    }
                    refetchMovies(variables);
                }
            });
        }
    };

    // Handle vote
    const handleVote = async (movie: Movie, score: number): Promise<void> => {
        if (movie._id) {
            await voteMovie({variables: {id: movie._id, score}});
        }
    };

    if (loading || isRefetching) return <Loader/>;
    if (error || !data) return <p>ERROR</p>;

    const totalCount: number = data?.movies?.count ? parseInt(data.movies.count.toString()) : 0;

    const movies: Movie[] = data?.movies?.movies ? [...data.movies.movies] : [];
    const movie: Movie | null = MovieService.getMovie();

    if (movie && !movies.filter((m) => m._id === movie._id).length) {
        movies.unshift(movie);
    }

    return (
        <div className="row">

            <div className="col">
                <p>Showing {totalCount} movies in the database.</p>
                <SearchBox value={variables.filter || ''}
                           onChange={((filter: string) => setVariables('filter', filter))}/>
                <MoviesTable movies={data?.movies?.movies || []}
                             onSort={(async (sort: string) => await setVariables('sort', sort))}
                             onDelete={handleDelete}
                             onRate={handleVote}
                             sort={variables.sort || ''}
                             selectedMovie={movie}
                />

                <Pagination
                    itemsCount={totalCount}
                    pageSize={variables.limit}
                    currentPage={page}
                    onPageChange={(async (page: number) => await setVariables('page', page.toString()))}
                />
            </div>
        </div>
    );
}

export default Movies;
