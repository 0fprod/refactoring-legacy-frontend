import { Book } from "../../backend/models/Book";

export type BookRepository = {
  getAll: () => Promise<Book[]>;
  add: (book: Book) => Promise<void>;
  update: (book: Book) => Promise<void>;
  remove: (book: Book) => Promise<void>;
};
