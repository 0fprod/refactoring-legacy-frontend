import { BookRepository } from "../domain/bookRepository";
import { Book } from "../../backend/models/Book";

export function createBookApiRepository(baseUrl: string): BookRepository {
  const getAll = async () => {
    const response = await fetch(baseUrl);
    return (await response.json()) as Book[];
  };

  const add = async (book: Book) => {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
    return await response.json();
  };

  const update = async (book: Book) => {
    const response = await fetch(`${baseUrl}/${book.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
    return await response.json();
  };

  const remove = async (book: Book) => {
    await fetch(`${baseUrl}/${book.id}`, {
      method: "DELETE",
    });
  };

  return {
    getAll,
    add,
    update,
    remove,
  };
}
