// import the gql tagged template function
const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth 
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: String!): User
        deleteBook(bookId: String!): User
    }

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: ID
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type savedBook {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String 
    }
`;

module.exports = typeDefs;