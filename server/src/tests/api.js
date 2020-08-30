const axios = require( 'axios' );

const API_URL = 'http://localhost:3900/graphql';

const seed = require( '../seed/index' );
const server = require( '../server' );

let bStarted = false;
const startUp = async function () {
    if ( bStarted ) {
        return;
    }

    await seed();
    await server();
    bStarted = true;
};

const login = async variables =>
    await axios.post( API_URL, {
        query: `
      mutation ($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          token
        }
      }
    `,
        variables,
    } );

const me = async token =>
    await axios.post(
        API_URL,
        {
            query: `
        {
          me {
            _id
            name
            username
          }
        }
      `,
        },
        token
            ? {
                headers: {
                    'x-auth-token': token,
                },
            }
            : null,
    );

const user = async variables =>
    axios.post( API_URL, {
        query: `
      query ($id: ID!) {
        user(id: $id) {
          _id
          username
          name
          role
        }
      }
    `,
        variables,
    } );

const users = async () =>
    axios.post( API_URL, {
        query: `
      {
        users {
          _id
          username
          name
          role
        }
      }
    `,
    } );

const register = async variables =>
    axios.post( API_URL, {
        query: `
      mutation(
        $username: String!,
        $name: String!,
        $password: String!
      ) {
        register(
          username: $username,
          name: $name,
          password: $password
        ) {
          token
        }
      }
    `,
        variables,
    } );

const updateUser = async ( variables, token ) =>
    axios.post(
        API_URL,
        {
            query: `
        mutation ($username: String!) {
          updateUser(username: $username) {
            username
          }
        }
      `,
            variables,
        },
        token
            ? {
                headers: {
                    'x-auth-token': token,
                },
            }
            : null,
    );

const deleteUser = async ( variables, token ) =>
    axios.post(
        API_URL,
        {
            query: `
        mutation ($id: ID!) {
          deleteUser(id: $id)
        }
      `,
            variables,
        },
        token
            ? {
                headers: {
                    'x-auth-token': token,
                },
            }
            : null,
    );

const movie = async variables =>
    axios.post( API_URL, {
        query: `
      query ($id: ID!) {
        movie(id: $id) {
          _id
          title
          duration
          releaseDate
          rating
        }
      }
    `,
        variables,
    } );


const movies = async () =>
    axios.post( API_URL, {
        query: `
  query {
    movies ( sort: "title", filter: "", limit: 2, offset: 0) {
        movies {
          title
        }
      }
    }
  `,
    } );

const moviesInclUsers = async () =>
    axios.post( API_URL, {
        query: `
    query {
        movies ( sort: "title", filter: "", limit: 2, offset: 0) {
            count
            movies {
                title
                user {
                    username
                }
            }
 
        }
    }
  `,
    } );

const createMovie = async ( variables, token ) =>
    axios.post( API_URL, {
            query: `
      mutation(
        $title: String!,
        $releaseDate: String!,
        $duration: Int!
      ) {
        createMovie(
          title: $title,
          releaseDate: $releaseDate,
          duration: $duration
        ) {
          title
          releaseDate
          duration
        }
      }
    `,
            variables,
        },
        token
            ? {
                headers: {
                    'x-auth-token': token,
                },
            }
            : null,
    );


const updateMovie = async ( variables, token ) =>
    axios.post( API_URL, {
            query: `
      mutation(
        $id: ID!,
        $title: String!,
        $releaseDate: String!,
        $duration: Int!
      ) {
        updateMovie(
          id: $id,
          title: $title,
          releaseDate: $releaseDate,
          duration: $duration
        ) {
          _id
          title
          releaseDate
          duration
        }
      }
    `,
            variables,
        },
        token
            ? {
                headers: {
                    'x-auth-token': token,
                },
            }
            : null,
    );

const deleteMovie = async ( variables, token ) =>
    axios.post( API_URL, {
            query: `
      mutation(
        $id: ID!
      ) {
        deleteMovie(
          id: $id
        )
      }
    `,
            variables,
        },
        token
            ? {
                headers: {
                    'x-auth-token': token,
                },
            }
            : null,
    );

const voteMovie = async ( variables, token ) =>
    axios.post( API_URL, {
            query: `
      mutation(
        $id: ID!,
        $score: Int!
      ) {
        voteMovie(
          id: $id,
          score: $score,
        ) {
          _id
          rating
          myVote
        }
      }
    `,
            variables,
        },
        token
            ? {
                headers: {
                    'x-auth-token': token,
                },
            }
            : null,
    );

module.exports = {
    startUp,
    me,
    login,
    user,
    users,
    register,
    updateUser,
    deleteUser,
    movie,
    movies,
    moviesInclUsers,
    createMovie,
    deleteMovie,
    updateMovie,
    voteMovie
};
