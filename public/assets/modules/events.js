// events.js
import { fetchAllTasks, deleteTask, editTask, changeCompleteStatus } from "./api.js";
import { updateTaskLists } from "./dom.js";

export function setupEventListeners() {
  document.addEventListener("click", async (event) => {
    const target = event.target.closest(".task-item_btn");
    if (!target) return;
    const taskId = target.id;
    if (target.classList.contains("delete")) {
      await deleteTask(taskId);
      refreshTaskList();
    }
    if (target.classList.contains("edit")) {
      // Open edit modal
    }
    if (target.classList.contains("task-settings-icon")) {
      // Toggle visibility van de instellingen-knoppen
      const taskItem = target.closest(".task-item");
      const settingsMenu = taskItem.querySelector(".task-item__settings");
      settingsMenu.classList.toggle("open");
    }

    if (target.classList.contains("edit")) {
    }
  });

  document.addEventListener("change", async (event) => {
    if (event.target.classList.contains("checkbox")) {
      await changeCompleteStatus(event.target.id, { is_completed: event.target.checked ? 1 : 0 });
      refreshTaskList();
    }
  });
}

async function refreshTaskList() {
  const tasks = await fetchAllTasks();
  updateTaskLists(document.querySelector(".pending"), document.querySelector(".completed"), tasks);
}
