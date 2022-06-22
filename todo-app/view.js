export function getItemLocalStorage(item) {
  const raw = localStorage.getItem(item);
  return JSON.parse(raw);
}

function createAppTitle(title) {
  let appTitle = document.createElement("h2");
  appTitle.innerHTML = title;
  return appTitle;
}

function createChangerElement(changer) {
  let div = document.createElement("div");
  let input = document.createElement("input");
  let label = document.createElement("label");
  let storageStatus = getItemLocalStorage(changer);

  if (storageStatus) {
    input.checked = true;
    label.textContent = "Перейти на локальное хранилище"
  } else {
    label.textContent = "Перейти на серверное хранилище"
  }

  div.classList.add(
    "form-check",
    "form-switch",
    "d-flex",
    "align-items-center"
  );
  input.classList.add("form-check-input");
  label.classList.add("form-check-label");
  input.type = "checkbox";
  input.role = "switch";

  div.append(label);
  label.append(input);

  return {
    input,
    div,
  };
}

function createTodoItemForm() {
  let form = document.createElement("form");
  let input = document.createElement("input");
  let buttonWrapper = document.createElement("div");
  let button = document.createElement("button");

  form.classList.add("input-group", "mb-3");
  input.classList.add("form-control", "mr-3");
  input.placeholder = "Введите название нового дела";
  buttonWrapper.classList.add("input-group-append");
  button.classList.add("btn", "btn-primary");
  input.addEventListener("input", buttonED);

  function buttonED() {
    if (input.value == "") {
      button.disabled = true;
    } else {
      button.disabled = false;
    }
  }
  buttonED();
  button.textContent = "Добавить дело";
  buttonWrapper.append(button);
  form.append(input);
  form.append(buttonWrapper);

  return {
    form,
    input,
    button,
  };
}

function createTodoList() {
  let list = document.createElement("ul");
  list.classList.add("list-group");

  return list;
}

function createTodoItemElement(todoItem, { onDone, onDelete }) {
  const doneClass = "list-group-item-success";

  let item = document.createElement("li");
  //Кнопки помещаем в элемент, который красиво покажет их в одной группе
  let buttonGroup = document.createElement("div");
  let doneButton = document.createElement("button");
  let deleteButton = document.createElement("button");

  item.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "align-items-center"
  );
  if (todoItem.done) {
    item.classList.add(doneClass);
  }
  item.textContent = todoItem.name;

  //Устанавливаем стили для элемента списка, а также для размещения кнопок
  //в его правой части с помощью flex

  buttonGroup.classList.add("btn-group", "btn-goup-sm");
  doneButton.classList.add("btn", "btn-success");
  doneButton.textContent = "Готово";
  deleteButton.classList.add("btn", "btn-danger");
  deleteButton.textContent = "Удалить";

  doneButton.addEventListener("click", function () {
    onDone({
      todoItem,
      element: item,
    });
    item.classList.toggle(doneClass, todoItem.done);
  });
  deleteButton.addEventListener("click", function () {
    onDelete({
      todoItem,
      element: item,
    });
  });

  //вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
  buttonGroup.append(doneButton);
  buttonGroup.append(deleteButton);
  item.append(buttonGroup);

  return item;
}

async function createTodoApp(
  container,
  headerContainer,
  {
    title,
    changer,
    owner,
    todoItemList = [],
    onCreateFormSubmit,
    onDoneClick,
    onDeleteClick,
  }
) {

  const todoChanger = createChangerElement(changer);
  const todoAppTitle = createAppTitle(title);
  const todoItemForm = createTodoItemForm();
  const todoList = createTodoList();
  const handlers = {
    onDone: onDoneClick,
    onDelete: onDeleteClick,
  };

  headerContainer.append(todoChanger.div)
  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  todoItemList.forEach((todoItem) => {
    const todoItemElement = createTodoItemElement(todoItem, handlers);
    todoList.append(todoItemElement);
  });

  todoChanger.input.addEventListener("change", function () {
    let parsRow = getItemLocalStorage(changer);
    parsRow = !parsRow;
    localStorage.setItem(changer, JSON.stringify(parsRow));
    setTimeout(() => {
      location.reload();
    }, 200);
  });

  todoItemForm.input.addEventListener("input", function () {
    todoItemForm.button.disabled = false;
    if (!todoItemForm.input.value) {
      todoItemForm.button.disabled = true;
    }
  });
  todoItemForm.form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!todoItemForm.input.value) {
      return;
    }

    const todoItem = await onCreateFormSubmit({
      owner,
      name: todoItemForm.input.value.trim(),
    });

    const todoItemElement = createTodoItemElement(todoItem, handlers);

    todoList.append(todoItemElement);
    todoItemForm.input.value = "";
    todoItemForm.button.disabled = true;
  });
}

export { createTodoApp };
