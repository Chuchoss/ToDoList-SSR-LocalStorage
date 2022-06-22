import {
  createTodoApp
} from "./view.js";

export function choosingStorage(changer, owner, title) {
  (async () => {
    let raw = localStorage.getItem(changer);
    let statusChanger = JSON.parse(raw);

    statusChanger
      ?
      import("./api.js").then(
        async ({
          getTodoList,
          createTodoItem,
          switchTodoItemDone,
          deleteTodoItem,
        }) => {
          const todoItemList = await getTodoList(owner);
          createTodoApp(
            document.getElementById("todo-app"),
            document.getElementById("containerHeader"),
            {
              title: title,
              changer,
              owner,
              todoItemList,
              onCreateFormSubmit: createTodoItem,
              onDoneClick: switchTodoItemDone,
              onDeleteClick: deleteTodoItem,
            }
          );
        }
      ) :
      import("./localStorage.js").then(
        ({
          getTodoList,
          createTodoItem,
          switchTodoItemDone,
          deleteTodoItem,
        }) => {
          if (getTodoList([owner]) == null) {
            localStorage.setItem(
              owner,
              JSON.stringify([{
                  owner,
                  name: "Сходить в зал",
                  done: false
                },
                {
                  owner,
                  name: "Побегать",
                  done: false
                },
              ])
            );
          }
          const todoItemList = getTodoList([owner]);
          createTodoApp(document.getElementById("todo-app"),
          document.getElementById("containerHeader"), {
            title: title,
            changer,
            owner,
            todoItemList,
            onCreateFormSubmit: createTodoItem,
            onDoneClick: switchTodoItemDone,
            onDeleteClick: deleteTodoItem,
          });
        }
      );
  })();
}
