import { libraryUseCase } from "../application/libraryUseCase";
import { createBookApiRepository } from "./bookApiRepository";

export function createLibraryUseCase() {
  return libraryUseCase(createBookApiRepository("http://localhost:3000/api"));
}
