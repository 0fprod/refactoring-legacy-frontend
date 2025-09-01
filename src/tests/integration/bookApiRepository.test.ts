import { createBook, updateTitle } from "../../frontend/domain/book";
import { createBookApiRepository } from "../../frontend/infrastructure/bookApiRepository";

describe("The Book Api Repository", () => {
  const baseUrl = "http://localhost:3000/api";
  const bookApiRepository = createBookApiRepository(baseUrl);

  afterEach(async () => {
    const books = await bookApiRepository.getAll();
    for (const book of books) {
      await bookApiRepository.remove(book);
    }
  });

  it("gets all books", async () => {
    const aBook = createBook("My Book", "http://mybook.com/picture.jpg");
    await bookApiRepository.add(aBook);

    const books = await bookApiRepository.getAll();

    expect(books).toEqual([aBook]);
  });

  it("adds a book", async () => {
    const aBook = createBook("My Book", "http://mybook.com/picture.jpg");

    await bookApiRepository.add(aBook);

    const books = await bookApiRepository.getAll();
    expect(books).toEqual([aBook]);
  });

  it("removes a book", async () => {
    const aBook = createBook("My Book", "http://mybook.com/picture.jpg");

    await bookApiRepository.add(aBook);
    await bookApiRepository.remove(aBook);

    const books = await bookApiRepository.getAll();
    expect(books).toEqual([]);
  });

  it("updates a book", async () => {
    const aBook = createBook("My Book", "http://mybook.com/picture.jpg");
    await bookApiRepository.add(aBook);

    const updatedBook = updateTitle(aBook, "My Updated Book");
    await bookApiRepository.update(updatedBook);

    const books = await bookApiRepository.getAll();
    expect(books).toEqual([updatedBook]);
  });
});
