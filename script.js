//Selectors
const form = document.querySelector("#form");
const inputTitle = document.querySelector("#title");
const inputAuthor = document.querySelector("#author");
const inputPriority = document.querySelector("#priority");
const inputType = document.querySelector("#type");
const btnSubmit = document.querySelector(".form--btn");
const booksList = document.querySelector(".books-list");

class Model {
  constructor() {
    this.books = JSON.parse(localStorage.getItem("books")) || []; //initially get data stored in localStorage
  }

  //update books array and store one in localStorage
  addBook(bookData) {
    const { title, author, type, priority } = bookData;
    this.books.push({
      id: Date.now(),
      title,
      author,
      type,
      priority,
    });

    localStorage.setItem("books", JSON.stringify(this.books));
  }
}

class View {
  constructor() {}

  //create html template for list item
  _createBookListItem(book) {
    const { title, author, type, priority } = book;

    return `
        <li class="book">
            <p class="book--type">${type}</p>
            <div>
                <div>
                    <h2 class="book--title">${title}</h2>
                    <h3 class="book--author">${author}</h3>
                </div>
                <span class="book--priority">${priority}</span>
            </div>
        </li>`;
  }

  //display list of books saved in local storage
  generateBookList(booksArr) {
    booksArr.forEach((book) => {
      const html = this._createBookListItem(book);
      booksList.insertAdjacentHTML("afterbegin", html);
    });
  }

  //update list witch newly added book
  addBookToList(book) {
    booksList.insertAdjacentHTML("afterbegin", this._createBookListItem(book));
  }

  //INPUTS CONTROL
  getTitle() {
    return inputTitle.value;
  }

  getAuthor() {
    return inputAuthor.value;
  }

  getPriority() {
    return inputPriority.value;
  }

  getType() {
    return inputType.value;
  }

  resetInputs() {
    inputTitle.value = "";
    inputAuthor.value = "";
    inputPriority.value = "";
    inputType.value = "";
  }

  //VALIDATION
  titleValidation() {
    if (inputTitle.value.length >= 1) {
      inputTitle.classList.remove("invalid");
      return true;
    }

    inputTitle.classList.add("invalid");
    return false;
  }

  authorValidation() {
    if (inputAuthor.value.length >= 3) {
      inputAuthor.classList.remove("invalid");
      return true;
    }

    inputAuthor.classList.add("invalid");
    return false;
  }

  priorityValidation() {
    if (+inputPriority.value >= 1 && +inputPriority.value <= 5) {
      inputPriority.classList.remove("invalid");
      return true;
    }

    inputPriority.classList.add("invalid");
    return false;
  }

  typeValidation() {
    if (inputType.value) {
      inputType.classList.remove("invalid");
      return true;
    }

    inputType.classList.add("invalid");
    return false;
  }

  formValidation() {
    //I store validations results in seperate variables to execute each function and show invalid inputs
    const titleIsValid = this.titleValidation();
    const authorIsValid = this.authorValidation();
    const priorityIsValid = this.priorityValidation();
    const typeIsValid = this.typeValidation();

    if (titleIsValid && authorIsValid && priorityIsValid && typeIsValid)
      return true;

    return false;
  }
}

class Controler {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.generateBookList(this.model.books); //initially get books from localStorage and display list
    form.addEventListener("submit", this._submitHandler.bind(this));
    form.addEventListener("blur", this._formBlurHandler.bind(this), true);
    inputType.addEventListener("change", this._typeChangeHandler.bind(this));
  }

  _submitHandler(event) {
    event.preventDefault();

    if (!this.view.formValidation()) return;

    const bookData = {
      title: this.view.getTitle(),
      author: this.view.getAuthor(),
      type: this.view.getType(),
      priority: this.view.getPriority(),
    };

    this.model.addBook(bookData);
    this.view.addBookToList(bookData);

    this.view.resetInputs();
  }

  //If input field loses focus validate provided input and display error message if necessary
  //Select input is checked with 'change' listener to give user immediate feedback
  _formBlurHandler(event) {
    if (event.target.id === "title") this.view.titleValidation();
    if (event.target.id === "author") this.view.authorValidation();
    if (event.target.id === "priority") this.view.priorityValidation();
  }

  _typeChangeHandler() {
    this.view.typeValidation();
  }
}

const app = new Controler(new Model(), new View());
