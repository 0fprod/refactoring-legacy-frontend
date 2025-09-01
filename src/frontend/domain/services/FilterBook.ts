import { Book } from "../book";

export type FilterKind = "all" | "completed" | "incomplete";

export function filterBooks(books: Book[], filter: FilterKind): Book[] {
  const filteredBooks = [];
  books.forEach((book) => {
    if (filter === "all" || (filter === "completed" && book.completed) || (filter === "incomplete" && !book.completed)) {
      filteredBooks.push(book);
    }
  });
  return filteredBooks;
}
