import { v4 as uuid } from "uuid";

export type Book = {
  readonly id: string;
  readonly title: string;
  readonly pictureUrl: string;
  readonly completed: boolean;
};

export function toggleCompleted(book: Book) {
  return {
    ...book,
    completed: !book.completed,
  };
}

export function updateTitle(book: Book, newTitle: string) {
  ensureThatHaveValidLength(newTitle);
  ensureThatOnlyContainsAlphanumeric(newTitle);
  ensureThatNotContainsForbiddenWords(newTitle);
  return {
    ...book,
    title: newTitle,
  };
}

export function updatePicture(book: Book, newPicture: string) {
  ensureThatIsValidUrl(newPicture);
  return {
    ...book,
    pictureUrl: newPicture,
  };
}

export function createBook(title: string, picture: string) {
  ensureThatIsValidUrl(picture);
  ensureThatHaveValidLength(title);
  ensureThatOnlyContainsAlphanumeric(title);
  ensureThatNotContainsForbiddenWords(title);
  return {
    id: uuid(),
    title: title,
    pictureUrl: picture,
    completed: false,
  };
}

function ensureThatIsValidUrl(picture: string) {
  try {
    new URL(picture);
  } catch (_) {
    throw new Error("Error: The cover url is not valid");
  }
}

function ensureThatHaveValidLength(title: string) {
  if (title.length < 3 || title.length > 100) {
    throw new Error(`Error: The title must be between 3 and 100 characters long.`);
  }
}

function ensureThatOnlyContainsAlphanumeric(title: string) {
  if (/[^a-zA-Z0-9\s]/.test(title)) {
    throw new Error("Error: The title can only contain letters, numbers, and spaces.");
  }
}

function ensureThatNotContainsForbiddenWords(title: string) {
  const forbiddenWords = ["prohibited", "forbidden", "banned"];
  const words = title.split(/\s+/);
  let foundForbiddenWord = words.find((word) => forbiddenWords.includes(word));
  if (foundForbiddenWord) {
    throw new Error(`Error: The title cannot include the prohibited word "${foundForbiddenWord}"`);
  }
}

export function ensureThatBookIsNotRepeated(book: Book, books: Book[]) {
  books.forEach((b, i) => {
    if (b.id !== book.id && b.title === book.title) {
      throw new Error("Error: The title is already in the collection.");
    }
  });
}

export const calculateNumberOfBooks = (bookList: Book[]): number => {
  return bookList.filter((b) => b.completed).length;
};
