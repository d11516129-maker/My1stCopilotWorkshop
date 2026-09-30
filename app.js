const STORAGE_KEY = "daily-todo-items";
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const remainingCount = document.querySelector("#remaining-count");

let todos = loadTodos();

function loadTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(savedTodos)) return [];

    return savedTodos.filter(
      (todo) =>
        todo &&
        typeof todo.id === "string" &&
        typeof todo.text === "string" &&
        typeof todo.completed === "boolean",
    );
  } catch {
    return [];
  }
}

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // 儲存空間不可用時，仍保留目前頁面中的清單。
  }
}

function renderTodos() {
  list.replaceChildren();

  if (todos.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = "還沒有任何待辦事項,新增一個吧!";
    list.append(emptyState);
  } else {
    todos.forEach((todo) => {
      const item = document.createElement("li");
      item.className = `todo-item${todo.completed ? " is-complete" : ""}`;

      const checkbox = document.createElement("input");
      checkbox.className = "todo-checkbox";
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.setAttribute(
        "aria-label",
        `標記「${todo.text}」為${todo.completed ? "未完成" : "已完成"}`,
      );
      checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;
        saveTodos();
        renderTodos();
      });

      const text = document.createElement("span");
      text.className = "todo-text";
      text.textContent = todo.text;

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.type = "button";
      deleteButton.textContent = "×";
      deleteButton.setAttribute("aria-label", `刪除「${todo.text}」`);
      deleteButton.addEventListener("click", () => {
        todos = todos.filter((itemTodo) => itemTodo.id !== todo.id);
        saveTodos();
        renderTodos();
      });

      item.append(checkbox, text, deleteButton);
      list.append(item);
    });
  }

  const unfinishedCount = todos.filter((todo) => !todo.completed).length;
  remainingCount.textContent = `未完成:${unfinishedCount} 項`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    text,
    completed: false,
  });
  saveTodos();
  renderTodos();
  input.value = "";
  input.focus();
});

renderTodos();