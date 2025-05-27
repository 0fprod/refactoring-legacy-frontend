import * as React from "react";
import { IonIcon } from '@ionic/react';
import {trash, createOutline, checkmark} from 'ionicons/icons';
import {v4 as uuid} from 'uuid';

type FilterType = 'all' | 'completed' | 'incomplete';


export class LibraryApp extends React.Component {
    bookList = [];
    newBookTitle = '';
    updatedBookTitle = '';
    newBookCoverUrl = '';
    updatedBookCoverUrl = '';
    numberOfBooks = 0;
    currentFilter: FilterType = 'all';
    isEditing: boolean[] = [];

    constructor(props) {
        super(props);
        this.initialize();
    }

    private initialize() {
        fetch('http://localhost:3000/api/')
            .then(response => response.json())
            .then(data => {
                this.bookList = data;
                for (let i = 0; i < this.bookList.length; i++) {
                    this.isEditing.push(false);
                }
                this.forceUpdate();
            })
            .catch(error => console.log(error));
    }

    onTitleChange(event) {
        const value = event.target.value;
        this.newBookTitle = value;
        this.forceUpdate();
    }

    onCoverUrlChange(event) {
        const value = event.target.value;
        this.newBookCoverUrl = value;
        this.forceUpdate();
    }

    add() {
        const min = 3; // Longitud mínima del texto
        const max = 100; // Longitud máxima del texto
        const forbidden = ['prohibited', 'forbidden', 'banned'];
        let temp = false;
        try {
            new URL(this.newBookCoverUrl);
            temp = true;
        }
        catch (e) {
            temp = false;
        }
        if (!temp) {
            alert('Error: The cover url is not valid');
        }
        // Validación de longitud mínima y máxima
        else if (this.newBookTitle.length < min || this.newBookTitle.length > max) {
            alert(`Error: The title must be between ${min} and ${max} characters long.`);
        } else if (/[^a-zA-Z0-9\s]/.test(this.newBookTitle)) {
            // Validación de caracteres especiales
            alert('Error: The title can only contain letters, numbers, and spaces.');
        } else {
            // Validación de palabras prohibidas
            const words = this.newBookTitle.split(/\s+/);
            let foundForbiddenWord = false;
            for (let word of words) {
                if (forbidden.includes(word)) {
                    alert(`Error: The title cannot include the prohibited word "${word}"`);
                    foundForbiddenWord = true;
                    break;
                }
            }

            if (!foundForbiddenWord) {
                // Validación de texto repetido
                let isRepeated = false;
                for (let i = 0; i < this.bookList.length; i++) {
                    if (this.bookList[i].title === this.newBookTitle) {
                        isRepeated = true;
                        break;
                    }
                }

                if (isRepeated) {
                    alert('Error: The title is already in the collection.');
                } else {
                    // Si pasa todas las validaciones, agregar el "libro"
                    fetch('http://localhost:3000/api/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({id:uuid(), title: this.newBookTitle, pictureUrl: this.newBookCoverUrl, completed: false }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            this.bookList.push(data);
                            this.newBookTitle = '';
                            this.newBookCoverUrl = '';
                            this.forceUpdate();
                        });
                }
            }
        }
    }

    update(index) {
        const min = 3; // Longitud mínima del texto
        const max = 100; // Longitud máxima del texto
        const words = ['prohibited', 'forbidden', 'banned'];
        let temp = false;
        try {
            new URL(this.updatedBookCoverUrl);
            temp = true;
        }
        catch (e) {
            temp = false;
        }
        if (!temp) {
            alert('Error: The cover url is not valid');
        }
        // Validación de longitud mínima y máxima
        else if (this.updatedBookTitle.length < min || this.updatedBookTitle.length > max) {
            alert(`Error: The title must be between ${min} and ${max} characters long.`);
        } else if (/[^a-zA-Z0-9\s]/.test(this.updatedBookTitle)) {
            // Validación de caracteres especiales
            alert('Error: The title can only contain letters, numbers, and spaces.');
        } else {
            // Validación de palabras prohibidas
            let temp1 = false;
            for (let word of this.updatedBookTitle.split(/\s+/)) {
                if (words.includes(word)) {
                    alert(`Error: The title cannot include the prohibited word "${word}"`);
                    temp1 = true;
                    break;
                }
            }

            if (!temp1) {
                // Validación de texto repetido (excluyendo el índice actual)
                let temp2 = false;
                for (let i = 0; i < this.bookList.length; i++) {
                    if (i !== index && this.bookList[i].title === this.updatedBookTitle) {
                        temp2 = true;
                        break;
                    }
                }

                if (temp2) {
                    alert('Error: The title is already in the collection.');
                } else {
                    // Si pasa todas las validaciones, actualizar el libro
                    fetch(`http://localhost:3000/api/${this.bookList[index].id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: this.updatedBookTitle, pictureUrl:this.updatedBookCoverUrl, completed: this.bookList[index].completed }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            this.bookList[index] = data;
                            this.close(index);
                            this.forceUpdate();
                        });
                }
            }
        }
    }

    handleUpdateInputChange(event) {
        const value = event.target.value;
        this.updatedBookTitle = value;
        this.forceUpdate();
    }

    handlePicture(event) {
        const value = event.target.value;
        this.updatedBookCoverUrl = value;
        this.forceUpdate();
    }


    delete(index) {
        fetch(`http://localhost:3000/api/${this.bookList[index].id}`, { method: 'DELETE' })
            .then(() => {
                if (this.bookList[index].completed) {
                    this.numberOfBooks--;
                }
                this.bookList.splice(index, 1);
                this.forceUpdate();
            })
    }

    toggleComplete(index) {
        this.bookList[index].completed = !this.bookList[index].completed;
        fetch(`http://localhost:3000/api/${this.bookList[index].id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: this.bookList[index].completed }),
        })
            .then(response => response.json())
            .then(data => {
                // this.collection[index] = data;
                this.bookList[index].completed ? this.numberOfBooks++ : this.numberOfBooks--;
                this.forceUpdate();
            })
    }


    setFilter(filter) {
        this.currentFilter = filter;
        this.forceUpdate();
    }

    getBooks() {
        const filteredBooks = [];
        for (let i = 0; i < this.bookList.length; i++) {
            if (
                this.currentFilter === 'all' ||
                (this.currentFilter === 'completed' && this.bookList[i].completed) ||
                (this.currentFilter === 'incomplete' && !this.bookList[i].completed)
            ) {
                filteredBooks.push(this.bookList[i]);
            }
        }
        return filteredBooks;
    }

    edit(index, text, url){
        this.updatedBookTitle = text;
        this.updatedBookCoverUrl = url;
        this.isEditing[index] = true;
        this.forceUpdate();
    }

    close(index){
        this.isEditing[index] = false;
        this.forceUpdate();
    }

    render() {
        const books = this.getBooks();

        return (
            <div className="app-container">
                <h1 data-testid="app-title">LIBRARY APP</h1>
                <div>
                    <input
                        className="library-input"
                        value={this.newBookTitle}
                        placeholder={'Book Title'}
                        onChange={this.onTitleChange.bind(this)}
                        data-testid={"book-title-input"}
                    />
                    <input
                        className="library-input"
                        value={this.newBookCoverUrl}
                        placeholder={'Cover Url'}
                        onChange={this.onCoverUrlChange.bind(this)}
                        data-testid={"book-cover-input"}
                    />
                </div>
                <button className="library-button add-book-button" onClick={this.add.bind(this)} data-testid={"add-book-button"}>
                    Add Book
                </button>
                <h2>Books Read: {this.numberOfBooks}</h2>
                <div>
                <button className="library-button all-filter" onClick={this.setFilter.bind(this, 'all')}>All</button>
                    <button className="library-button completed-filter" onClick={this.setFilter.bind(this, 'completed')} data-testid={"filter-read-button"}>Read</button>
                    <button className="library-button incomplete-filter" onClick={this.setFilter.bind(this, 'incomplete')} data-testid={"filter-unread-button"}>Unread</button>
                </div>
                <ul className="book-list" data-testid={"book-list"}>
                {books.map((b, index) => (
                    <li className="book">
                        {
                            this.isEditing[index]
                                ? <div>
                                    <input
                                        className="book-edit-input"
                                        defaultValue={b.title} // Asumiendo que inputData se usa para la edición
                                        onChange={this.handleUpdateInputChange.bind(this)}
                                        data-testId={"edit-book-title-input"}
                                    />
                                    <input
                                        className="book-edit-input"
                                        defaultValue={b.pictureUrl} //
                                        onChange={this.handlePicture.bind(this)}
                                        data-testId={"edit-book-cover-input"}
                                    />
                                </div>
                                : <div className={"book-item"}>
                                    <img src={b.pictureUrl} alt={b.title} height={160} width={130} className="book-cover"/>
                                    <div>

                                        <p className="title">
                                        {b.title} {b.completed && <IonIcon className={"complete-icon"} icon={checkmark}></IonIcon> }
                                        </p>
                                        {!this.isEditing[index] &&
                                            <button className="book-button"
                                                    onClick={this.toggleComplete.bind(this, index)}
                                                    data-testid={"mark-as-read-button"}>
                                                {b.completed ? 'Mark as Unread' : 'Mark as Read'}
                                            </button>}
                                        {!this.isEditing[index] &&
                                            <button className="book-button"
                                                    onClick={() => this.edit(index, b.title, b.pictureUrl)} data-testId={"edit-book-button"}><IonIcon icon={createOutline}/>
                                            </button>
                                        }
                                        {!this.isEditing[index] &&
                                            <button className="book-button book-delete-button"
                                                    onClick={this.delete.bind(this, index)} data-testid={"delete-book-button"}>
                                                <IonIcon icon={trash}/>
                                            </button>}
                                    </div>
                                </div>
                        }

                        {this.isEditing[index] &&
                            <div>
                                <button className="library-button book-update-button"
                                        onClick={this.update.bind(this, index)}
                                        data-testid={"save-book-button"}>
                                    Save
                                </button>
                                <button className="library-button book-update-button"
                                        onClick={this.close.bind(this, index)}
                                        data-testid={"cancel-book-update-button"}>
                                    Cancel
                                </button>
                            </div>

                        }
                    </li>
                ))}
                </ul>
            </div>
        );
    }
}
