export function getTodoList(owner) {
  const raw = localStorage.getItem(owner);
  return JSON.parse(raw);
}

export function createTodoItem({
  owner,
  name
}) {
  if (getTodoList(owner)) {
    let localStorageArray = getTodoList(owner);
    localStorageArray.push({
      owner,
      name
    });
    localStorage.setItem(owner, JSON.stringify(localStorageArray));
  }
  return {
    owner,
    name
  };
}

export function switchTodoItemDone({
  todoItem
}) {
  todoItem.done = !todoItem.done;
  let localStorageArray = getTodoList(todoItem.owner);
  localStorageArray.forEach((item) => {
    if (item.name === todoItem.name) {
      item.done = todoItem.done;
    }
  });
  localStorage.setItem(todoItem.owner, JSON.stringify(localStorageArray));
}

export function deleteTodoItem({
  element,
  todoItem
}) {
  if (!confirm("Вы уверены?")) {
    return;
  }
  element.remove();
  let localStorageArray = getTodoList(todoItem.owner);
  for (let index in localStorageArray) {
    if (localStorageArray[index].name === todoItem.name) {
      localStorageArray.splice(index, 1);
      localStorage.setItem(todoItem.owner, JSON.stringify(localStorageArray));
    }
  }
}
