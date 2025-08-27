// tasks.js
import { fetchAllTasks, createNewTask } from "./api.js";
import { updateTaskLists } from "./dom.js";
import { setupEventListeners } from "./events.js";

export async function initializeTasks() {
  const tasks = await fetchAllTasks();
  updateTaskLists(document.querySelector(".pending"), document.querySelector(".completed"), tasks);
}

export async function addNewTask(taskData) {
  await createNewTask(taskData);
  initializeTasks();
}
initializeTasks();
setupEventListeners();
