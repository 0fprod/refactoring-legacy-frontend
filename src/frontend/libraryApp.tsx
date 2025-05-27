import * as React from "react";
import { IonIcon } from '@ionic/react';
import {trash, createOutline, checkmark} from 'ionicons/icons';
import {v4 as uuid} from 'uuid';

export class LibraryApp extends React.Component<any, any> {
    collection = [];
    inputData = '';
    inputUpdateData = '';
    coverData = '';
    coverUpdateData = '';
    counter = 0;
    f = 'all';
    updating = [];

    constructor(props) {
        super(props);
        fetch('http://localhost:3000/api/')
            .then(response => response.json())
            .then(data => {
                this.collection = data;
                for (let i = 0; i < this.collection.length; i++) {
                    this.updating.push(false);
                }
                this.forceUpdate();
            })
            .catch(error => console.log(error));
    }

    handleInputChange(event) {
        var value = event.target.value;
        this.inputData = value;
        this.forceUpdate();
    }

    onCoverChange(event) {
        var value = event.target.value;
        this.coverData = value;
        this.forceUpdate();
    }

    add() {
        const min = 3; // Longitud mínima del texto
        const max = 100; // Longitud máxima del texto
        const forbidden = ['prohibited', 'forbidden', 'banned'];
        let temp = false;
        try {
            new URL(this.coverData);
            temp = true;
        }
        catch (e) {
            temp = false;
        }
        if (!temp) {
            alert('Error: The cover url is not valid');
        }
        // Validación de longitud mínima y máxima
        else if (this.inputData.length < min || this.inputData.length > max) {
            alert(`Error: The title must be between ${min} and ${max} characters long.`);
        } else if (/[^a-zA-Z0-9\s]/.test(this.inputData)) {
            // Validación de caracteres especiales
            alert('Error: The title can only contain letters, numbers, and spaces.');
        } else {
            // Validación de palabras prohibidas
            const words = this.inputData.split(/\s+/);
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
                for (let i = 0; i < this.collection.length; i++) {
                    if (this.collection[i].title === this.inputData) {
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
                        body: JSON.stringify({id:uuid(), title: this.inputData, pictureUrl: this.coverData, completed: false }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            this.collection.push(data);
                            this.inputData = '';
                            this.coverData = '';
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
            new URL(this.coverUpdateData);
            temp = true;
        }
        catch (e) {
            temp = false;
        }
        if (!temp) {
            alert('Error: The cover url is not valid');
        }
        // Validación de longitud mínima y máxima
        else if (this.inputUpdateData.length < min || this.inputUpdateData.length > max) {
            alert(`Error: The title must be between ${min} and ${max} characters long.`);
        } else if (/[^a-zA-Z0-9\s]/.test(this.inputUpdateData)) {
            // Validación de caracteres especiales
            alert('Error: The title can only contain letters, numbers, and spaces.');
        } else {
            // Validación de palabras prohibidas
            let temp1 = false;
            for (let word of this.inputUpdateData.split(/\s+/)) {
                if (words.includes(word)) {
                    alert(`Error: The title cannot include the prohibited word "${word}"`);
                    temp1 = true;
                    break;
                }
            }

            if (!temp1) {
                // Validación de texto repetido (excluyendo el índice actual)
                let temp2 = false;
                for (let i = 0; i < this.collection.length; i++) {
                    if (i !== index && this.collection[i].title === this.inputUpdateData) {
                        temp2 = true;
                        break;
                    }
                }

                if (temp2) {
                    alert('Error: The title is already in the collection.');
                } else {
                    // Si pasa todas las validaciones, actualizar el libro
                    fetch(`http://localhost:3000/api/${this.collection[index].id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: this.inputUpdateData, pictureUrl:this.coverUpdateData, completed: this.collection[index].completed }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            this.collection[index] = data;
                            this.close(index);
                            this.forceUpdate();
                        });
                }
            }
        }
    }

    handleUpdateInputChange(event) {
        var value = event.target.value;
        this.inputUpdateData = value;
        this.forceUpdate();
    }

    handlePicture(event) {
        var value = event.target.value;
        this.coverUpdateData = value;
        this.forceUpdate();
    }


    delete(index) {
        fetch(`http://localhost:3000/api/${this.collection[index].id}`, { method: 'DELETE' })
            .then(() => {
                if (this.collection[index].completed) {
                    this.counter--;
                }
                this.collection.splice(index, 1);
                this.forceUpdate();
            })
    }

    toggleComplete(index) {
        this.collection[index].completed = !this.collection[index].completed;
        fetch(`http://localhost:3000/api/${this.collection[index].id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: this.collection[index].completed }),
        })
            .then(response => response.json())
            .then(data => {
                // this.collection[index] = data;
                this.collection[index].completed ? this.counter++ : this.counter--;
                this.forceUpdate();
            })
    }


    setFilter(filter) {
        this.f = filter;
        this.forceUpdate();
    }

    getBooks() {
        var fBooks = [];
        for (var i = 0; i < this.collection.length; i++) {
            if (
                this.f === 'all' ||
                (this.f === 'completed' && this.collection[i].completed) ||
                (this.f === 'incomplete' && !this.collection[i].completed)
            ) {
                fBooks.push(this.collection[i]);
            }
        }
        return fBooks;
    }

    edit(index, text, url){
        this.inputUpdateData = text;
        this.coverUpdateData = url;
        this.updating[index] = true;
        this.forceUpdate();
    }

    close(index){
        this.updating[index] = false;
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
                        value={this.inputData}
                        placeholder={'Book Title'}
                        onChange={this.handleInputChange.bind(this)}
                        data-testid={"book-title-input"}
                    />
                    <input
                        className="library-input"
                        value={this.coverData}
                        placeholder={'Cover Url'}
                        onChange={this.onCoverChange.bind(this)}
                        data-testid={"book-cover-input"}
                    />
                </div>
                <button className="library-button add-book-button" onClick={this.add.bind(this)} data-testid={"add-book-button"}>
                    Add Book
                </button>
                <h2>Books Read: {this.counter}</h2>
                <div>
                <button className="library-button all-filter" onClick={this.setFilter.bind(this, 'all')}>All</button>
                    <button className="library-button completed-filter" onClick={this.setFilter.bind(this, 'completed')} data-testid={"filter-read-button"}>Read</button>
                    <button className="library-button incomplete-filter" onClick={this.setFilter.bind(this, 'incomplete')} data-testid={"filter-unread-button"}>Unread</button>
                </div>
                <ul className="book-list" data-testid={"book-list"}>
                {books.map((b, index) => (
                    <li className="book">
                        {
                            this.updating[index]
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
                                        {!this.updating[index] &&
                                            <button className="book-button"
                                                    onClick={this.toggleComplete.bind(this, index)}
                                                    data-testid={"mark-as-read-button"}>
                                                {b.completed ? 'Mark as Unread' : 'Mark as Read'}
                                            </button>}
                                        {!this.updating[index] &&
                                            <button className="book-button"
                                                    onClick={() => this.edit(index, b.title, b.pictureUrl)} data-testId={"edit-book-button"}><IonIcon icon={createOutline}/>
                                            </button>
                                        }
                                        {!this.updating[index] &&
                                            <button className="book-button book-delete-button"
                                                    onClick={this.delete.bind(this, index)} data-testid={"delete-book-button"}>
                                                <IonIcon icon={trash}/>
                                            </button>}
                                    </div>
                                </div>
                        }

                        {this.updating[index] &&
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
