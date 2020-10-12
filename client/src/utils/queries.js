import gql from 'graphql-tag';

export const QUERY_ME = `
{
    me { 
        _id
        username
        email
        bookCount
        savedBooks {
            bookId
            authors
            description
            title
            image
            link
        }
    }
}`;