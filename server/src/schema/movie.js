const { gql } = require( 'apollo-server-express' );

module.exports = gql`
  extend type Query {
    movies(sort: String, filter: String, offset: Int, limit: Int): MovieConnection!
    movie(id: ID!): Movie!
  }

  extend type Mutation {
    createMovie(title: String!, releaseDate: String!, duration: Int!): Movie!
    updateMovie(id: ID!, title: String!, releaseDate: String!, duration: Int!): Movie!
    deleteMovie(id: ID!): Boolean!
    voteMovie(id: ID!, score: Int!): Movie!
  }

  type MovieConnection {
    movies: [Movie!]!
    count: String!
  }

  type Movie {
    _id: ID!
    title: String!
    releaseDate: Date!
    userId: String!
    user: User!
    duration: Int!
    rating: Float!
    myVote: Int!
  }

  extend type Subscription {
    movieAdded: Movie!
    movieUpdated: Movie!
    movieDeleted: Movie!
  }

  type MovieSub {
    movie: Movie!
  }
`;
