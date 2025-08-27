async function fetchAllTasks() {
  try {
    const tasks = await fetch(`${API_URL}/api/tasks`);
    const tasksData = await tasks.json();

    if (!tasksData) {
      return;
    }
    return tasksData;
  } catch (error) {
    console.error("Error fetching tasks: ", error);
  }
}

const $pendingTaskContainer = document.querySelector(".pending");
const $completedTaskContainer = document.querySelector(".completed");

function taskTemplate(task) {
  if (task.is_completed == 0) {
    return `
      <article class="task-item">
          <label>
              <input class="checkbox" type="checkbox" id="${task.id}" name="progress">
          </label>
  
          <div class="task-item__description">
  
              <p> ${task.taskName} </p>
              <small>
                  ${task.categories.category}
              </small>
  
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
      </article>
  `;
  } else {
    return `
      <article class="task-item">
          <label>
              <input class="checkbox" type="checkbox" id="${task.id}" name="progress" checked >
          </label>
  
          <div class="task-item__description">
  
              <p> ${task.taskName} </p>
              <small>
                  ${task.categories.category}
              </small>
  
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
      </article>
  `;
  }
}

// ============+++ EVENT LISTENERS +++============

function addClasslistForTaskSettings($target, $btnClose, $taskItem, $taskModifiers) {
  $target.classList.add("open");
  $btnClose.classList.add("open");
  $taskItem.classList.add("open");
  $taskModifiers.classList.add("open");
}
function removeClasslistForSettings($closeButton, $taskItem, $taskModifiers, $taskSettings) {
  $closeButton.classList.remove("open");
  $taskItem.classList.remove("open");
  $taskModifiers.classList.remove("open");
  $taskSettings.classList.remove("open");
}
function findTargetSettings($pendingTaskContainer) {
  $pendingTaskContainer.addEventListener("click", function (event) {
    const $target = event.target.closest(".task-settings-icon");
    if ($target) {
      console.log("hier zit ook een probleem");
      const $taskItem = $target.closest(".task-item");
      const $taskModifiers = $taskItem.querySelector(".task-item__settings");
      const $btnClose = $taskItem.querySelector(".close");

      addClasslistForTaskSettings($target, $btnClose, $taskItem, $taskModifiers);
    }
    const $closeButton = event.target.closest(".close");
    if ($closeButton) {
      const $taskItem = $closeButton.closest(".task-item");
      const $taskModifiers = $taskItem.querySelector(".task-item__settings");
      const $taskSettings = $taskItem.querySelector(".task-settings-icon");

      removeClasslistForSettings($closeButton, $taskItem, $taskModifiers, $taskSettings);
    }
  });
}
function addEventListenerToTaskDelete($tasksDeleteBtns) {
  for (const $taskDeleteBtn of $tasksDeleteBtns) {
    $taskDeleteBtn.addEventListener("click", function (event) {
      const $target = event.currentTarget.getAttribute("id");
      const $targetClassName = $taskDeleteBtn.className;

      openConfirmation($target, globalCategoryID, $targetClassName);
    });
  }
}

function openConfirmation($target, globalID, $className) {
  const $dialog = document.querySelector(".dialog");
  $dialog.showModal();
  const $closeDialog = document.getElementById("close-dialog");
  const $confirmDelete = document.getElementById("confirm-delete");

  confirmDeletion($confirmDelete, $target, globalID, $dialog, $className);
  cancelConfirm($closeDialog, $dialog);
}

async function confirmDeletion(button, $target, globalID, $dialog, $className) {
  button.addEventListener("click", async function (event) {
    if ($className.includes("task-item_btn")) {
      console.log("clicked");
      deleteTask($target, globalID);
    } else {
      console.log("correct");

      await deleteCategory(
        {
          id: globalID,
        },
        globalID
      );
    }
    $dialog.close();
  });
}

function cancelConfirm($cancel, $dialog) {
  $cancel.addEventListener("click", function (event) {
    $dialog.close();
  });
}

function addEventListenerToTaskEdit($taskEditBtns) {
  for (const $taskEditBtn of $taskEditBtns) {
    $taskEditBtn.addEventListener("click", function (event) {
      const $target = event.currentTarget.getAttribute("id");

      showEditTaskWindow();
      initFormTaskEdit($target);
    });
  }
}

function addEventListenerToCheckBox($taskCheckboxes) {
  for (const $checkbox of $taskCheckboxes) {
    $checkbox.addEventListener("click", function (event) {
      const $target = event.currentTarget.getAttribute("id");
      shootConfettiOnCheckedStatus($checkbox);
      setCompleteStatus($checkbox, $target);
    });
  }
}

function getTaskName(tasks, $target) {
  for (const task of tasks) {
    if (task.id == $target) {
      return task.taskName;
    }
  }
}

function getTargetId($target) {
  let myTarget = $target;
  return myTarget;
}

function addEventListenerToTaskSettings($pendingTaskContainer, $completedTaskContainer, $tasksDeleteBtns, $taskEditBtns, $taskCheckboxes, tasks) {
  findTargetSettings($pendingTaskContainer, $completedTaskContainer);
  addEventListenerToTaskDelete($tasksDeleteBtns, tasks);
  addEventListenerToTaskEdit($taskEditBtns);
  addEventListenerToCheckBox($taskCheckboxes, tasks);
}
// ==========================================
// ============+++ HTML FILL +++============
function createTaskList(tasks) {
  let htmlPending = "";
  let htmlCompleted = "";
  for (const task of tasks) {
    if (task.is_completed == 0) {
      htmlPending += taskTemplate(task);
    } else {
      htmlCompleted += taskTemplate(task);
    }
  }
  $pendingTaskContainer.innerHTML = htmlPending;
  $completedTaskContainer.innerHTML = htmlCompleted;

  const $tasksDeleteBtns = document.querySelectorAll(".delete");
  const $taskEditBtns = document.querySelectorAll(".edit");
  const $taskCheckboxes = document.querySelectorAll(".checkbox");
  addEventListenerToTaskSettings($pendingTaskContainer, $completedTaskContainer, $tasksDeleteBtns, $taskEditBtns, $taskCheckboxes, tasks);
}

async function updateTasksHTML(target) {
  const tasks = await fetchAllTasks();

  let htmlPending = "";
  let htmlCompleted = "";

  for (const task of tasks) {
    if (target == task.category_id || target == 0) {
      if (task.is_completed == 0) {
        htmlPending += taskTemplate(task);
      } else {
        htmlCompleted += taskTemplate(task);
      }
    }
  }

  $pendingTaskContainer.innerHTML = htmlPending;
  $completedTaskContainer.innerHTML = htmlCompleted;

  const $tasksDeleteBtns = document.querySelectorAll(".delete");
  const $taskEditBtns = document.querySelectorAll(".edit");
  const $taskCheckboxes = document.querySelectorAll(".checkbox");
  addEventListenerToTaskSettings($pendingTaskContainer, $completedTaskContainer, $tasksDeleteBtns, $taskEditBtns, $taskCheckboxes, tasks);

  return [htmlPending, htmlCompleted];
}
// ==========================================
// ============+++ CREATE TASKS +++============

async function initFormTaskCreation(categories) {
  $formCreateTask.innerHTML = `
  <label class="form__wrapper">
    Select a category!
    <select name="categories" id="categories" class="categories">
      ${createCategoriesDropDown(categories)}
    </select>
    What task do you need to do?
    <input class="form__input" id="create-task-input" type="text" required>
  </label>
  <button class="button form__button" id="cancel-create-task" type="button">Cancel</button>
  <button class="button form__button" id="create-task">Create</button>
`;
  const $btnCancel = document.getElementById("cancel-create-task");

  cancelTaskCreation($btnCancel);

  if ($formCreateTask) {
    const $inputDropd = document.getElementById("categories");
    const $inputField = document.getElementById("create-task-input");
    const catArray = createCategoryArray(categories);

    $formCreateTask.addEventListener("submit", async function (e) {
      e.preventDefault();
      const dropDvalue = $inputDropd.value;
      const inputFieldValue = $inputField.value;
      let catID = 0;
      let catIndex = 0;
      categories.forEach((category, index) => {
        catArray.push(category.category);
        if (dropDvalue == category.category) {
          catID = category.id;

          catIndex = index + 1;
        }
      });

      await createNewTask({
        taskName: inputFieldValue,
        category_id: catID,
        is_completed: 0,
      });
      $formCreateTask.reset();
      updateCategoryTitle(catArray[catIndex]);
      updateTasksHTML(catID);
      hideAddTaskWindow();
    });
  }
}

async function createNewTask(content) {
  try {
    const response = await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      body: JSON.stringify(content),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error: ${data.message || "Unknown error"}`);
    }
    const tasks = await fetchAllTasks();
    const categories = await fetchCategories();
    createCategoriesList(categories, tasks);

    return data;
  } catch (error) {
    console.error("Something went wrong: " + error);
  }
}

// ==========================================
// ============+++ DELETE TASKS +++============
async function deleteTask(itemID, categoryID) {
  try {
    const response = await fetch(`${API_URL}/api/tasks/${itemID}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error: ${data.message || "Unknown error"}`);
    }
    const tasks = await fetchAllTasks();
    const categories = await fetchCategories();

    updateTasksHTML(categoryID);
    createCategoriesList(categories, tasks);
  } catch (error) {
    console.error("Something went wrong: " + error);
  }
}

const $btnAddTask = document.querySelector(".btn-add-task");
const $formCreateTask = document.getElementById("form-task");
const $btnCancelEdit = document.getElementById("cancel-edit-task");
const $editForm = document.querySelector(".form-edit");

// ==========================================
// ============+++ EDIT TASKS +++============
async function initFormTaskEdit($target) {
  if ($editForm) {
    $editForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const $taskName = $editForm.querySelector(".form__input");

      await editTask(
        {
          taskName: $taskName.value,
        },
        $target
      );

      $editForm.reset();
      updateTasksHTML(globalCategoryID);
      hideEditTaskWindow();
      window.location.reload();
    });
  }
}

async function editTask(content, id) {
  try {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(content),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      throw new Error(`Error: ${data.message || "Unknown error"}`);
    }
    return data;
  } catch (error) {
    console.error("Something went wrong: " + error);
  }
}
// ==========================================
// ============+++ COMPLETE A TASK +++============
async function setCompleteStatus($checkbox, taskID) {
  const checkboxStatus = $checkbox.checked;
  if (checkboxStatus) {
    await changeCompleteStatus(
      {
        is_completed: 1,
      },
      taskID
    );
  } else {
    await changeCompleteStatus(
      {
        is_completed: 0,
      },
      taskID
    );
  }

  updateTasksHTML(globalCategoryID);
}

async function changeCompleteStatus(content, id) {
  try {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(content),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error: ${data.message || "Unknown error"}`);
    }
    return data;
  } catch (error) {
    console.error("Something went wrong: " + error);
  }
}

// ==========================================
// ============+++ OPEN SETTINGS +++============

function cancelTaskCreation($btnCancel) {
  $btnCancel.addEventListener("click", function (event) {
    setTimeout(() => {
      hideAddTaskWindow();
    }, 10);
  });
}

function showAddTaskWindow() {
  $formCreateTask.classList.add("show");
}
function hideAddTaskWindow() {
  $formCreateTask.classList.remove("show");
}

function showEditTaskWindow() {
  $editForm.classList.add("show");
}
function hideEditTaskWindow() {
  $editForm.classList.remove("show");
}

$btnAddTask.addEventListener("click", async function (event) {
  const categories = await fetchCategories();

  createCategoriesDropDown(categories);
  showAddTaskWindow(categories);
});

$btnCancelEdit.addEventListener("click", function (event) {
  hideEditTaskWindow();
});

// ==========================================
