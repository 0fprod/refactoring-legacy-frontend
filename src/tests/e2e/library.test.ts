
describe('Library App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should display the correct title', () => {
    cy.contains('[data-testid="app-title"]', 'LIBRARY APP');
  });

  it('should be able to add a new book', () => {
    const bookTitle = 'New Book Title';
    cy.addBook(bookTitle, 'https://example.com/cover.jpg');
    cy.get('[data-testid="book-list"]').should('contain', bookTitle);
  });

  it('should be able to delete a book', () => {
    const bookTitle = 'Book to be deleted';
    cy.addBook(bookTitle, 'https://example.com/cover.jpg');
    cy.get('[data-testid="book-list"]').should('contain', bookTitle);

    cy.get('[data-testid="delete-book-button"]').last().click();
    cy.get('[data-testid="book-list"]').should('not.contain', bookTitle);
  })

  it('should be able to edit a book', () => {
    const originalTitle = 'Original Book Title';
    const updatedTitle = 'Updated Book Title';
    cy.addBook(originalTitle, 'https://example.com/cover.jpg');
    cy.get('[data-testid="book-list"]').should('contain', originalTitle);

    cy.get('[data-testid="edit-book-button"]').last().click();
    cy.get('[data-testid="edit-book-title-input"]').clear().type(updatedTitle);
    cy.get('[data-testid="save-book-button"]').click();

    cy.get('[data-testid="book-list"]').should('contain', updatedTitle);
    cy.get('[data-testid="book-list"]').should('not.contain', originalTitle);
  });

  it('should filter unread books', () => {
    const book = 'Unread Book';

    cy.addBook(book, 'https://example.com/cover.jpg');

    cy.get('[data-testid="filter-unread-button"]').click();
    cy.get('[data-testid="book-list"]').should('contain', book);

    cy.get('[data-testid="filter-read-button"]').click();
    cy.get('[data-testid="book-list"]').should('not.contain', book);
  });

  it('should filter read books', () => {
    const book = 'Read Book';

    cy.addBook(book, 'https://example.com/cover.jpg');
    cy.get('[data-testid="mark-as-read-button"]').last().click();

    cy.get('[data-testid="filter-read-button"]').click();
    cy.get('[data-testid="book-list"]').should('contain', book);

    cy.get('[data-testid="filter-unread-button"]').click();
    cy.get('[data-testid="book-list"]').should('not.contain', book);
  });
});
