import * as React from "react";
import { IonIcon } from "@ionic/react";
import { checkmark, createOutline, trash } from "ionicons/icons";
import { Book } from "../../../domain/book";

type BookComponentState = {
  isEditing: boolean;
  title: string;
  pictureUrl: string;
};

export function BookComponent(props: {
  book: Book;
  index: number;
  toggleComplete: (book: Book) => void;
  deleteBook: (book: Book) => void;
  update: (book: Book, title: string, pictureUrl: string) => void;
}) {
  const [state, setState] = React.useState<BookComponentState>({
    isEditing: false,
    title: props.book.title,
    pictureUrl: props.book.pictureUrl,
  });

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((state) => ({ ...state, title: event.target.value }));
  };

  const onPictureUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((state) => ({ ...state, pictureUrl: event.target.value }));
  };

  const onEdit = () => {
    setState((state) => ({ ...state, isEditing: true }));
  };

  const onClose = () => {
    setState((state) => ({ ...state, isEditing: false }));
  };

  const onUpdate = () => {
    setState((state) => ({ ...state, isEditing: false }));
    props.update(props.book, state.title, state.pictureUrl);
  };

  return (
    <li className="book" data-test-id={"bookElement"}>
      {state.isEditing ? (
        <div>
          <input
            data-test-id={"editTitleInput"}
            className="book-edit-input"
            defaultValue={state.title} // Asumiendo que inputData se usa para la edición
            onChange={onTitleChange}
          />
          <input
            data-test-id={"editCoverInput"}
            className="book-edit-input"
            defaultValue={state.pictureUrl} //
            onChange={onPictureUrlChange}
          />
        </div>
      ) : (
        <div className={"book-item"}>
          <img src={props.book.pictureUrl} alt={props.book.title} height={160} width={130} className="book-cover" />
          <div>
            <p className="title">
              {props.book.title}{" "}
              {props.book.completed && <IonIcon data-test-id="markAsReadIcon" className={"complete-icon"} icon={checkmark}></IonIcon>}
            </p>
            {!state.isEditing && (
              <button className="book-button" data-test-id="markAsReadButton" onClick={() => props.toggleComplete(props.book)}>
                {props.book.completed ? "Mark as Unread" : "Mark as Read"}
              </button>
            )}
            {!state.isEditing && (
              <button className="book-button" data-test-id="editButton" onClick={onEdit}>
                <IonIcon icon={createOutline} />
              </button>
            )}
            {!state.isEditing && (
              <button className="book-button book-delete-button" data-test-id="deleteButton" onClick={() => props.deleteBook(props.book)}>
                <IonIcon icon={trash} />
              </button>
            )}
          </div>
        </div>
      )}

      {state.isEditing && (
        <div>
          <button className="library-button book-update-button" data-test-id="updateButton" onClick={onUpdate}>
            Save
          </button>
          <button className="library-button book-update-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      )}
    </li>
  );
}
