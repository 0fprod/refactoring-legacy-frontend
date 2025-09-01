describe("Library App", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("should display the correct title", () => {
    cy.contains('[data-test-id="titleHeader"]', "LIBRARY APP");
  });

  it("should be able to add new book", () => {
    const aBook = "New book";
    addBook(aBook);

    cy.contains('[data-test-id="bookList"]', aBook).should("exist");
    deleteBook();
  });

  it("should not be able to add a book with an invalid title", () => {
    const aBook = "a";
    addBook(aBook);

    cy.on("window:alert", (str) => {
      expect(str).to.equal("Error: The title must be between 3 and 100 characters long.");
    });

    cy.contains('[data-test-id="bookList"]', aBook).should("not.exist");
  });

  it("should be able to delete a book", () => {
    const aBook = "New book";
    addBook(aBook);

    deleteBook();

    cy.contains('[data-test-id="bookList"]', aBook).should("not.exist");
  });

  it("should be able to mark as read a book", () => {
    const aBook = "New book";
    addBook(aBook);

    cy.get('[data-test-id="markAsReadButton"]').click();

    cy.get('[data-test-id="markAsReadIcon"]').should("exist");
    deleteBook();
  });

  it("should be able to filter as read", () => {
    const aBook = "New book";
    addBook(aBook);
    cy.get('[data-test-id="markAsReadButton"]').click();
    const otherBook = "Other book";
    addBook(otherBook);

    cy.get('[data-test-id="readFilterButton"]').click();

    cy.get('[data-test-id="bookElement"]').should("to.have.length", 1);
    deleteBook();
    cy.get('[data-test-id="allFilterButton"]').click();
    deleteBook();
  });

  it("should be able to update a book", () => {
    const aBook = "New book";
    addBook(aBook);
    cy.get('[data-test-id="editButton"]').click();
    cy.get('[data-test-id="editTitleInput"]').clear().type("New book title");

    cy.get('[data-test-id="updateButton"]').click();

    cy.contains('[data-test-id="bookList"]', "New book title").should("exist");
    deleteBook();
  });

  it("should not be able to update a book with invalid title", () => {
    const aBook = "New book";
    addBook(aBook);
    cy.get('[data-test-id="editButton"]').click();
    cy.get('[data-test-id="editTitleInput"]').clear().type("a");

    cy.get('[data-test-id="updateButton"]').click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal("Error: The title must be between 3 and 100 characters long.");
    });

    cy.contains('[data-test-id="bookList"]', aBook).should("exist");
    deleteBook();
  });
});

function addBook(aBook: string) {
  cy.get('[data-test-id="titleInput"]').type(aBook);
  cy.get('[data-test-id="coverInput"]').type("https://bucket.mlcdn.com/a/1590/1590228/images/75a5707709691e7651c5ebcace5287da35c56015.png");

  cy.get('[data-test-id="addButton"]').click();
}

function deleteBook() {
  cy.get('[data-test-id="deleteButton"]').click();
}
