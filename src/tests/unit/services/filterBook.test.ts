import { createBook, toggleCompleted } from "../../../frontend/domain/book";
import { filterBooks } from "../../../frontend/domain/services/FilterBook";

describe("The Filter Book", () => {
  it("retrieves all books when the filter is all", () => {
    const aBook = createBook("The Book", "http://www.example.com/book.jpg");
    const completedBook = toggleCompleted(aBook);
    const anotherBook = createBook("Another Book", "http://www.example.com/another-book.jpg");
    const books = [completedBook, anotherBook];

    const filteredBooks = filterBooks(books, "all");

    expect(filteredBooks).toEqual(books);
  });

  it("retrieves only completed books when the filter is completed", () => {
    const aBook = createBook("The Book", "http://www.example.com/book.jpg");
    const completedBook = toggleCompleted(aBook);
    const anotherBook = createBook("Another Book", "http://www.example.com/another-book.jpg");
    const books = [completedBook, anotherBook];

    const filteredBooks = filterBooks(books, "completed");

    expect(filteredBooks).toEqual([completedBook]);
  });

  it("retrieves only incomplete books when the filter is incomplete", () => {
    const aBook = createBook("The Book", "http://www.example.com/book.jpg");
    const completedBook = toggleCompleted(aBook);
    const anotherBook = createBook("Another Book", "http://www.example.com/another-book.jpg");
    const books = [completedBook, anotherBook];

    const filteredBooks = filterBooks(books, "incomplete");

    expect(filteredBooks).toEqual([anotherBook]);
  });
});
