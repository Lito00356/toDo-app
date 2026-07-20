// ============ FETCH ============

async function fetchAllTasks() {
  try {
    return await apiFetch("/api/tasks");
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

function taskTemplate(task) {
  return `
    <article class="task-item" data-id="${task.id}">
        <label>
            <input class="checkbox" type="checkbox" name="progress" ${task.is_completed ? "checked" : ""}>
        </label>
        <div class="task-item__description">
            <p class="task-item__name">${task.taskName}</p>
            <small>${task.categories.category}</small>
        </div>
        <div class="task-item__buttons">
            <button class="task-item_btn task-settings-icon">
                <img src="/images/settings.png" alt="settings logo">
            </button>
            <button class="task-item_btn close">&#10006;</button>
            <div class="task-item__settings">
                <button class="task-item_btn edit">
                    <img src="/images/edit-icon.png" alt="edit logo">
                </button>
                <button class="task-item_btn delete">
                    <img src="/images/delete.png" alt="delete logo">
                </button>
            </div>
        </div>
    </article>
  `;
}

const $pendingTaskContainer = document.querySelector(".pending");
const $completedTaskContainer = document.querySelector(".completed");

function renderTasks(tasks, filterCategoryId = 0) {
  let htmlPending = "";
  let htmlCompleted = "";

  for (const task of tasks) {
    if (filterCategoryId == 0 || task.category_id == filterCategoryId) {
      if (task.is_completed == 0) {
        htmlPending += taskTemplate(task);
      } else {
        htmlCompleted += taskTemplate(task);
      }
    }
  }

  $pendingTaskContainer.innerHTML = htmlPending;
  $completedTaskContainer.innerHTML = htmlCompleted;
}

async function refreshTasks(filterCategoryId = globalCategoryID) {
  const tasks = await fetchAllTasks();
  if (tasks) renderTasks(tasks, filterCategoryId);
  return tasks;
}

function bindTaskEvents($container) {
  $container.addEventListener("click", function (event) {
    const $settingsBtn = event.target.closest(".task-settings-icon");
    if ($settingsBtn) {
      const $taskItem = $settingsBtn.closest(".task-item");
      $settingsBtn.classList.add("open");
      $taskItem.querySelector(".close").classList.add("open");
      $taskItem.querySelector(".task-item__settings").classList.add("open");
      $taskItem.classList.add("open");
      return;
    }

    const $closeBtn = event.target.closest(".close");
    if ($closeBtn) {
      const $taskItem = $closeBtn.closest(".task-item");
      $taskItem.querySelector(".task-settings-icon").classList.remove("open");
      $closeBtn.classList.remove("open");
      $taskItem.querySelector(".task-item__settings").classList.remove("open");
      $taskItem.classList.remove("open");
      return;
    }

    const $deleteBtn = event.target.closest(".delete");
    if ($deleteBtn) {
      const taskId = $deleteBtn.closest(".task-item").dataset.id;
      openConfirmation(taskId, globalCategoryID, "task-item_btn");
      return;
    }

    const $editBtn = event.target.closest(".edit");
    if ($editBtn) {
      startInlineEditTask($editBtn.closest(".task-item"));
      return;
    }

    const $checkbox = event.target.closest(".checkbox");
    if ($checkbox) {
      const taskId = $checkbox.closest(".task-item").dataset.id;
      shootConfettiOnCheckedStatus($checkbox);
      setCompleteStatus($checkbox, taskId);
    }
  });
}

function startInlineEditTask($taskItem) {
  if ($taskItem.classList.contains("editing")) return;
  $taskItem.classList.add("editing");

  const $description = $taskItem.querySelector(".task-item__description");
  const currentName = $taskItem.querySelector(".task-item__name").textContent.trim();
  const taskId = $taskItem.dataset.id;

  $description.innerHTML = `
    <input class="form__input task-item__edit-input" type="text" value="${currentName}">
    <div class="task-item__edit-actions">
      <button class="button form__button task-edit-save" type="button">OK</button>
      <button class="button form__button task-edit-cancel" type="button">Cancel</button>
    </div>
  `;

  const $input = $description.querySelector(".task-item__edit-input");
  const $saveBtn = $description.querySelector(".task-edit-save");
  const $cancelBtn = $description.querySelector(".task-edit-cancel");

  $input.focus();
  $input.select();

  $saveBtn.addEventListener("click", async function () {
    const newName = $input.value.trim();
    if (newName && newName !== currentName) {
      await patchTask(taskId, { taskName: newName });
      showToast("Task updated");
    }
    await refreshTasks();
  });

  $cancelBtn.addEventListener("click", async function () {
    await refreshTasks();
  });

  $input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") $saveBtn.click();
    if (e.key === "Escape") $cancelBtn.click();
  });
}

async function patchTask(id, content) {
  try {
    return await apiFetch(`/api/tasks/${id}`, "PATCH", content);
  } catch (error) {
    console.error("Error updating task:", error);
  }
}

async function createNewTask(content) {
  try {
    const data = await apiFetch("/api/tasks", "POST", content);
    showToast("Task created!");
    const [categories, tasks] = await Promise.all([fetchCategories(), fetchAllTasks()]);
    createCategoriesList(categories, tasks);
    return data;
  } catch (error) {
    console.error("Error creating task:", error);
  }
}

async function deleteTask(itemID, categoryID) {
  try {
    await apiFetch(`/api/tasks/${itemID}`, "DELETE");
    const [categories, tasks] = await Promise.all([fetchCategories(), fetchAllTasks()]);
    createCategoriesList(categories, tasks);
    renderTasks(tasks, categoryID);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

async function setCompleteStatus($checkbox, taskId) {
  await patchTask(taskId, { is_completed: $checkbox.checked ? 1 : 0 });
  refreshTasks();
}

// ============ CREATE TASK FORM ============

const $btnAddTask = document.querySelector(".btn-add-task");
const $formCreateTask = document.getElementById("form-task");

async function initFormTaskCreation(categories) {
  const $existingSelect = $formCreateTask.querySelector("#categories");

  if ($existingSelect) {
    $existingSelect.innerHTML = createCategoriesDropDown(categories);
    preselectActiveCategory($existingSelect);
    return;
  }

  $formCreateTask.innerHTML = `
    <h3 class="form__title">New task</h3>
    <div class="form__field">
      <label class="form__label" for="categories">Category</label>
      <select class="form__input" name="categories" id="categories">
        ${createCategoriesDropDown(categories)}
      </select>
    </div>
    <div class="form__field">
      <label class="form__label" for="create-task-input">Task name</label>
      <input class="form__input" id="create-task-input" type="text" placeholder="What do you need to do?" required>
    </div>
    <div class="form__actions">
      <button class="form__btn form__btn--cancel" id="cancel-create-task" type="button">Cancel</button>
      <button class="form__btn form__btn--submit" id="create-task">Create</button>
    </div>
  `;

  preselectActiveCategory($formCreateTask.querySelector("#categories"));

  $formCreateTask.querySelector("#cancel-create-task").addEventListener("click", function () {
    setTimeout(() => hideAddTaskWindow(), 10);
  });

  $formCreateTask.addEventListener("submit", async function (e) {
    e.preventDefault();
    const catID = parseInt($formCreateTask.querySelector("#categories").value);
    const taskName = $formCreateTask.querySelector("#create-task-input").value;

    await createNewTask({ taskName, category_id: catID, is_completed: 0 });
    $formCreateTask.reset();
    await refreshTasks(catID);
    hideAddTaskWindow();
  });
}

function preselectActiveCategory($select) {
  if ($select && globalCategoryID != 0) {
    $select.value = String(globalCategoryID);
  }
}

function showAddTaskWindow() {
  $formCreateTask.classList.add("show");
}

function hideAddTaskWindow() {
  $formCreateTask.classList.remove("show");
}

$btnAddTask.addEventListener("click", async function () {
  const categories = await fetchCategories();
  await initFormTaskCreation(categories);
  preselectActiveCategory($formCreateTask.querySelector("#categories"));
  showAddTaskWindow();
});

function openConfirmation(targetId, globalID, className) {
  const $dialog = document.querySelector(".dialog");
  $dialog.showModal();

  const $oldConfirm = document.getElementById("confirm-delete");
  const $confirmDelete = $oldConfirm.cloneNode(true);
  $oldConfirm.replaceWith($confirmDelete);

  const $oldClose = document.getElementById("close-dialog");
  const $closeDialog = $oldClose.cloneNode(true);
  $oldClose.replaceWith($closeDialog);

  $confirmDelete.addEventListener("click", async function () {
    if (className.includes("task-item_btn")) {
      await deleteTask(targetId, globalID);
    } else {
      await deleteCategory({ id: globalID }, globalID);
    }
    $dialog.close();
  });

  $closeDialog.addEventListener("click", function () {
    $dialog.close();
  });
}

(async function init() {
  bindTaskEvents($pendingTaskContainer);
  bindTaskEvents($completedTaskContainer);

  const [categories, tasks] = await Promise.all([fetchCategories(), fetchAllTasks()]);

  renderTasks(tasks, 0);
  initFormCategoryCreation();
  initFormTaskCreation(categories);
  createCategoriesList(categories, tasks);

  const urlParts = window.location.pathname.split("/");
  if (urlParts.length >= 3 && urlParts[1] === "category") {
    const id = urlParts[2];
    const $article = document.getElementById("category-nav-" + id);
    if ($article) {
      makeActive($article);
      updateCategoryTitle($article.dataset.title);
      renderTasks(tasks, id);
      globalCategoryID = id;
    }
  }
})();
