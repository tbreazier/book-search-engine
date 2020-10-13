import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { useQuery } from '@apollo/react-hooks';
import { useMutation } from '@apollo/react-hooks';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  const { loading, data: userData } = useQuery(QUERY_ME);
  const [removeBook] = useMutation(REMOVE_BOOK)

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId: bookId }
      });

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
		<React.Fragment>
			<Jumbotron fluid className="text-light bg-dark">
				<Container>
					<h1>Viewing saved books!</h1>
				</Container>
			</Jumbotron>
			{userData ? (
				<Container>
					<h2>
						{userData.me.savedBooks.length ? (
							`Viewing ${userData.me.savedBooks.length} saved ${userData.me
								.savedBooks.length === 1
								? 'book'
								: 'books'}:`
						) : (
							'You have no saved books!'
						)}
					</h2>
					<CardColumns>
						{userData.me.savedBooks.map((book) => {
							return (
								<Card key={book.bookId} border="dark">
									{book.image ? (
										<Card.Img
											src={book.image}
											alt={`The cover for ${book.title}`}
											variant="top"
										/>
									) : null}
									<Card.Body>
                    <a href={book.link} target="_blank" rel="noopener noreferrer">
                      <Card.Title>{book.title}</Card.Title>
                    </a>
										<p className="small">Authors: {book.authors}</p>
										<Card.Text>{book.description}</Card.Text>
										<Button
											className="btn-block btn-danger"
											onClick={() => handleDeleteBook(book.bookId)}
										>
											Delete this Book!
										</Button>
									</Card.Body>
								</Card>
							);
						})}
					</CardColumns>
				</Container>
			) : null}
		</React.Fragment>
	);
};

export default SavedBooks;
