const board = document.querySelector(".board");

/* RESTORE BOARD STRUCTURE */
const savedBoard = localStorage.getItem("boardHTML");
if (savedBoard) {
  board.innerHTML = savedBoard;
}

let boardData = JSON.parse(localStorage.getItem("trelloBoard")) || [[], [], []];

function save() {
  localStorage.setItem("trelloBoard", JSON.stringify(boardData));
  localStorage.setItem("boardHTML", board.innerHTML);
}

function render() {
  const lists = document.querySelectorAll(".list");

  lists.forEach((list, listIndex) => {
    const tasksContainer = list.querySelector(".tasks");

    if (!boardData[listIndex]) {
      boardData[listIndex] = [];
    }

    /* DELETE CARD BUTTON */
    let deleteCardBtn = list.querySelector(".delete-card");

    if (!deleteCardBtn) {
      deleteCardBtn = document.createElement("button");
      deleteCardBtn.className = "delete-card";
      deleteCardBtn.textContent = "Delete Card";
      list.appendChild(deleteCardBtn);
    }

    deleteCardBtn.onclick = () => {
      if (!confirm("Delete this card?")) return;

      boardData.splice(listIndex, 1);
      list.remove();
      render();
    };

    tasksContainer.innerHTML = "";

    boardData[listIndex].forEach((task, taskIndex) => {
      const taskDiv = document.createElement("div");

      taskDiv.className = "task";
      taskDiv.draggable = true;

      taskDiv.dataset.list = listIndex;

      taskDiv.innerHTML = `
<span>${task}</span>
<button class="delete">x</button>
`;

      taskDiv.querySelector(".delete").onclick = function () {
        boardData[listIndex].splice(taskIndex, 1);
        render();
      };

      taskDiv.addEventListener("dragstart", dragStart);

      tasksContainer.appendChild(taskDiv);
    });

    const addBtn = list.querySelector(".add-task");

    addBtn.onclick = () => {
      const text = prompt("Enter task");

      if (!text) return;

      boardData[listIndex].push(text);
      render();
    };

    tasksContainer.addEventListener("dragover", (e) => e.preventDefault());

    tasksContainer.addEventListener("drop", () => {
      const taskIndex = boardData[fromList].indexOf(draggedTask);

      if (taskIndex === -1) return;

      boardData[fromList].splice(taskIndex, 1);
      boardData[listIndex].push(draggedTask);

      render();
    });
  });

  save();
}

let draggedTask;
let fromList;

function dragStart() {
  draggedTask = this.querySelector("span").innerText;
  fromList = Number(this.dataset.list);
}

function getRandomColor() {
  const colors = [
    "#ff6b6b",
    "#6bc5ff",
    "#6bff95",
    "#ffc46b",
    "#d96bff",
    "#6b8bff",
    "#ff6bd6",
    "#00a8a8",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

const addCardBtn = document.getElementById("addColumn");

addCardBtn.addEventListener("click", function () {
  const cardName = prompt("Enter Card Name");

  if (!cardName) return;

  const newCard = document.createElement("div");

  newCard.classList.add("list");

  newCard.style.backgroundColor = getRandomColor();

  newCard.innerHTML = `
<h3 class="headings">${cardName}</h3>
<div class="tasks"></div>
<button class="add-task">Add Task</button>
<button class="delete-card">Delete Card</button>
`;

  board.appendChild(newCard);

  boardData.push([]);

  render();
});

render();
