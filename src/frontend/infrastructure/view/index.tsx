import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./library/libraryApp.css";
import "./index.css";
import { createLibraryUseCase } from "../factory";
import { LibraryApp } from "./library/libraryApp";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LibraryApp useCase={createLibraryUseCase()} />
  </React.StrictMode>
);
