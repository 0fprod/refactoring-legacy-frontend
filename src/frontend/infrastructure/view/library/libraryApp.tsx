import * as React from "react";
import { useEffect } from "react";
import { BookComponent } from "./bookComponent";
import { LibraryUseCase } from "../../../application/libraryUseCase";
import { useLibraryApp } from "./libraryAppHook";

export const LibraryApp = ({ useCase }: { useCase: LibraryUseCase }) => {
  const hook = useLibraryApp(useCase);

  useEffect(() => {
    hook.initialize();
  }, []);

  return (
    <div className="app-container">
      <h1 data-test-id={"titleHeader"}>LIBRARY APP</h1>
      <div>
        <input
          data-test-id={"titleInput"}
          className="library-input"
          value={hook.newBookTitle}
          placeholder={"Book Title"}
          onChange={hook.onTitleChange}
        />
        <input
          data-test-id={"coverInput"}
          className="library-input"
          value={hook.newBookPictureUrl}
          placeholder={"Cover Url"}
          onChange={hook.onPictureUrlChange}
        />
      </div>
      <button data-test-id={"addButton"} className="library-button add-book-button" onClick={hook.add}>
        Add Book
      </button>
      <h2>Books Read: {hook.numberOfBooks}</h2>
      <div>
        <button data-test-id={"allFilterButton"} className="library-button all-filter" onClick={() => hook.setFilter("all")}>
          All
        </button>
        <button data-test-id={"readFilterButton"} className="library-button completed-filter" onClick={() => hook.setFilter("completed")}>
          Read
        </button>
        <button
          data-test-id={"unreadFilterButton"}
          className="library-button incomplete-filter"
          onClick={() => hook.setFilter("incomplete")}
        >
          Unread
        </button>
      </div>
      <ul className="book-list" data-test-id={"bookList"}>
        {hook.books.map((b, index) => (
          <BookComponent book={b} index={index} toggleComplete={hook.toggleComplete} deleteBook={hook.deleteBook} update={hook.update} />
        ))}
      </ul>
    </div>
  );
};
