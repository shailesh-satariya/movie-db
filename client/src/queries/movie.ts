import {gql} from '@apollo/client';

const MOVIE_DATA = `
  __typename
  _id
  title
  releaseDate
  duration
  rating
  myVote
  userId
`;

export const MOVIE_TILE_DATA = gql`
  fragment MovieTile on Movie {
    ${MOVIE_DATA}
  }
`;

export const GET_MOVIES = gql`
  query GetMovieList($sort: String, $filter: String, $offset: Int, $limit: Int) {
    movies(sort: $sort, filter: $filter, offset: $offset, limit: $limit) {
      count
      movies {
        ...MovieTile
      }
    }
  }
  ${MOVIE_TILE_DATA}
`;

export const GET_MOVIE_DETAILS = gql`
  query MovieDetails($movieId: ID!) {
    movie(id: $movieId) {
      ...MovieTile
    }
  }
  ${MOVIE_TILE_DATA}
`;

export const DELETE_MOVIE = gql`
  mutation DeleteMovie($id: ID!) {
    deleteMovie(id: $id)
  }
`;

export const VOTE_MOVIE = gql`
  mutation VoteMovie($id: ID!, $score: Int!) {
    voteMovie(id: $id, score: $score) {
      ...MovieTile
    }
  }
  ${MOVIE_TILE_DATA}
`;

export const CREATE_MOVIE = gql`
  mutation CreateMovie($title: String!, $releaseDate: String!, $duration: Int!) {
    createMovie(title: $title, releaseDate: $releaseDate, duration: $duration) {
      ...MovieTile
    }
  }
  ${MOVIE_TILE_DATA}
`;

export const UPDATE_MOVIE = gql`
  mutation UpdateMovie($id: ID!, $title: String!, $releaseDate: String!, $duration: Int!) {
    updateMovie(id: $id, title: $title, releaseDate: $releaseDate, duration: $duration) {
      ...MovieTile
    }
  }
  ${MOVIE_TILE_DATA}
`;

export const MOVIE_CREATE_SUBSCRIPTION = gql`
  subscription  {
    movieAdded {
      ${MOVIE_DATA}
    }
  }
`;

export const MOVIE_UPDATED_SUBSCRIPTION = gql`
  subscription  {
    movieUpdated {
      ${MOVIE_DATA}
    }
  }
`;

export const MOVIE_DELETED_SUBSCRIPTION = gql`
  subscription  {
    movieDeleted {
      ${MOVIE_DATA}
    }
  }
`;
