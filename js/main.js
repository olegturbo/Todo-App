const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

//Masiv care pastreaza/modifica informatia despre sarcinile mele
let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

chekEmptyList();

//Adaugarea sarcinei
form.addEventListener("submit", addTask);

//Stergerea sarcinei
tasksList.addEventListener("click", deleteTask);

//Notam sarcina ca indeplinita
tasksList.addEventListener("click", doneTask);

//Functia adaugarii
function addTask(event) {
  //Anulam trimiterea ,,Adauga"(nu dam voie sa se faca reload la pagina)
  event.preventDefault("submit");

  //Scoatem textul din Input
  const taskText = taskInput.value;

  //Descriem sarcina
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  //Adaugam sarcina in masivul cu sarcini
  tasks.push(newTask);

  //Lucram cu JSON pentru a aduaga in masiv sarcinile
  saveToLocalStorage();

  renderTask(newTask);

  //Elibereaza placeholder si intoarce din nou focusul
  taskInput.value = "";
  taskInput.focus();

  chekEmptyList();

  saveToLocalStorage();
}

//Functia stergerii
function deleteTask(event) {
  //Daca am apasat NU pe butonul "Sterge sarcina"
  if (event.target.dataset.action !== "delete") {
    return;
  }

  //Vereficam ca am apasat be butonul delete
  const parenNode = event.target.closest(".list-group-item");

  //ID sarcini
  const id = Number(parenNode.id);

  //Gasim idexul sarcinii in masiv
  const index = tasks.findIndex((task) => task.id === id);

  //Stergem din masiv
  tasks.splice(index, 1);

  //Stergem sarcina din lista
  parenNode.remove();

  // Salvăm array-ul actualizat în localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  chekEmptyList();
}

//Functia Notarii
function doneTask(event) {
  //Daca am apasat NU pe butonul "Done sarcina"
  if (event.target.dataset.action !== "done") {
    return;
  }

  const parentNode = event.target.closest(".list-group-item");

  const id = Number(parentNode.id);

  const task = tasks.find(function (task) {
    if (task.id === id) {
      return true;
    }
  });
  task.done = !task.done;

  //Lucram cu JSON pentru a aduaga in masiv sarcinile
  saveToLocalStorage();

  //Vereficam ca am apasat be butonul DONE
  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function chekEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `  <li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
            <div class="empty-list__title">Lista de sarcini este goală</div>
          </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  //Formam CSS class
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  //Formam o noua sarcina
  const taskHTML = ` <li id ="${task.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}">${task.text}</span>
            <div class="task-item__buttons">
              <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18" />
              </button>
              <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18" />
              </button>
            </div>
          </li>`;

  //Acum adaug pe ecran
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
