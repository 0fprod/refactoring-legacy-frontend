/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to add a book to the library
Cypress.Commands.add('addBook', (title: string, coverUrl: string) => {
  cy.get('[data-testid="book-title-input"]').type(title);
  cy.get('[data-testid="book-cover-input"]').type(coverUrl);
  cy.get('[data-testid="add-book-button"]').click();
});

// declare global namespace for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to add a book to the library
       * @param title - The title of the book
       * @param coverUrl - The URL of the book cover image
       * @example cy.addBook('Book Title', 'https://example.com/cover.jpg')
       */
      addBook(title: string, coverUrl: string): Chainable<void>;
    }
  }
}
