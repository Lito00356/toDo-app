// dom.js
export function taskTemplate(task) {
  return `
      <article class="task-item">
          <label>
              <input class="checkbox" type="checkbox" id="${task.id}" name="progress" ${task.is_completed ? "checked" : ""}>
          </label>
          <div class="task-item__description">
              <p>${task.taskName}</p>
              <small>${task.categories.category}</small>
          </div>
          <div class="task-item__buttons">
              <button class="task-item_btn task-settings-icon" id="task-settings">
                  <img src="/images/settings.png" alt="settings logo">
              </button>
              <button class="task-item_btn close">&#10006;</button>
              <div class="task-item__settings">
                  <button class="task-item_btn edit" id="${task.id}">
                      <img src="/images/edit-icon.png" alt="edit logo">
                  </button>
                  <button class="task-item_btn delete" id="${task.id}">
                      <img src="/images/delete.png" alt="delete logo">
                  </button>
              </div>
          </div>
      </article>`;
}

export function updateTaskLists(pendingContainer, completedContainer, tasks) {
  pendingContainer.innerHTML = tasks
    .filter((t) => !t.is_completed)
    .map(taskTemplate)
    .join("");
  completedContainer.innerHTML = tasks
    .filter((t) => t.is_completed)
    .map(taskTemplate)
    .join("");
}
