const { gql } = require("apollo-server-express");

module.exports = gql`
    type Book {
        _id: ID!
        title: String!
        author: User!
        favoriteCount: Int!
        favoritedBy: [User!]
    },
    type User {
        _id: ID!
        username: String!
        email: String!
        avatar: String
        books: [Book!]!
        favorites: [Book!]
    }
    type BookFeed {
        books: [Book]!
        cursor: String!
        hasNextPage: Boolean!
    }
    type Query {
        hello: String,
        books: [Book!]!
        book(id: ID!): Book!
        users: [User!]!
        user(username: String!): User!
        me: User!
        bookFeed(cursor: String): BookFeed
    }
    type Mutation {
        addBook(title: String!): Book!
        updateBook(id: ID!, title: String!): Book!
        deleteBook(id: ID!): Boolean!
        signUp(username: String!, email: String!, password: String!): String!
        signIn(username: String!, email: String!, password: String!): String!
        toggleFavorite(id: ID!): Book!
    }
`;