const API_URL = "http://localhost:2007";

async function fetchCategories() {
  try {
    const categories = await fetch(`${API_URL}/api/categories`);
    const categoriesData = await categories.json();

    if (!categoriesData) {
      return;
    }

    return categoriesData;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

const $categoryContainer = document.querySelector(".category__list-container");

function createCategoriesList(categories, tasks) {
  const categoryArray = createCategoryArray(categories);
  let counter = 0;
  let html = "";

  for (const category of categories) {
    counter += category.tasks.length;
    html += `
    <article class="category__list-item" data-title="${category.category}" id="category-nav-${category.id}">
        <button class="button category__list-item-btn" data-title="${category.category}" id="${category.id}">
            ${category.category}
        </button>

        <div class="category__list-settings">
            <span class="category__list-item-count">${category.tasks.length}</span>

            <button class="button category__list-settings-btn" id="${category.id}">
                <img class="button__icon" src="/images/settings.png" alt="settings logo">
            </button>
            <button class="button category__list-settings-btn close">
            &#10006;
            </button>

            <div class="category__list-actions">
                <button class="button category__list-edit-btn" id="${category.id}">
                    <img class="button__icon-action" src="/images/edit-icon.png" alt="edit logo">
                </button>
                <button class="button category__list-delete-btn" id="${category.id}">
                    <img class="button__icon-action" src="/images/delete.png" alt="delete logo">
                </button>
            </div>
        </div>
    </article>
    `;
  }

  let allCategories = `
  <article class="category__list-item">
    <button class="button category__list-item-btn" id="0">
    All tasks
      <span class="category__list-item-count counter">
      ${counter}
    </span>
    </button>
  </article>
  `;
  $categoryContainer.innerHTML = allCategories + html;
  const $categoryName = document.querySelectorAll(".category__list-item-btn");

  addEventListenerToCategory($categoryName, categoryArray, tasks);
  addEventListenerToSettings($categoryContainer);
}

function addClasslistForCategorySettings($categoryItem, $categoryModifiers, $target, $closeButton, id) {
  $categoryItem.classList.add("open");
  $categoryModifiers.classList.add("open");
  $target.classList.add("open");
  $closeButton.classList.add("open");
}

function removeClasslistForCategorySettings($closeButton, $categoryItem, $categoryModifiers, $categorySettings) {
  $categoryItem.classList.remove("open");
  $categoryModifiers.classList.remove("open");
  $categorySettings.classList.remove("open");
  $closeButton.classList.remove("open");
}

function initEditCategory($categoryItem, $editCategoryForm, id) {
  $editCategoryForm.classList.add("open");
  initFormCategoryEdit($editCategoryForm, id);
}

function updateCategoryTaskCounter(categories) {
  const $taskCounter = document.querySelector(".category__list-item-count");
  let counter = 0;
  let html = "";
  for (const category of categories) {
    counter += category.tasks.length;
    html += category.tasks.length;
  }
  $taskCounter.innerHTML = html;
}

function addEventListenerToSettings($container) {
  $container.addEventListener("click", async function (event) {
    const $target = event.target.closest(".category__list-settings-btn");
    if ($target) {
      const $categoryItem = $target.closest(".category__list-item");
      const $categoryModifiers = $categoryItem.querySelector(".category__list-actions");
      const $closeButton = $categoryItem.querySelector(".close");

      addClasslistForCategorySettings($categoryItem, $categoryModifiers, $target, $closeButton);
    }
    const $closeButton = event.target.closest(".close");
    if ($closeButton) {
      const $categoryItem = $target.closest(".category__list-item");
      const $categoryModifiers = $categoryItem.querySelector(".category__list-actions");
      const $categorySettings = $categoryItem.querySelector(".category__list-settings-btn");

      removeClasslistForCategorySettings($closeButton, $categoryItem, $categoryModifiers, $categorySettings);
    }
    const $deleteTarget = event.target.closest(".category__list-delete-btn");
    if ($deleteTarget) {
      const categoryID = $deleteTarget.getAttribute("id");
      const $className = $deleteTarget.className;
      console.log("hier zit een probleem!!");

      openConfirmation(null, categoryID, $className);
    }

    const $editTarget = event.target.closest(".category__list-edit-btn");
    if ($editTarget) {
      const $categoryItem = $editTarget.closest(".category__list-item");
      const categoryID = $editTarget.getAttribute("id");
      const $editCategoryForm = document.querySelector(".form--edit-category");
      initEditCategory($categoryItem, $editCategoryForm, categoryID);
    }
  });
}

async function deleteCategory(content, categoryID) {
  try {
    const response = await fetch(`${API_URL}/api/categories/${categoryID}`, {
      method: "DELETE",
      body: JSON.stringify(content),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error: ${data.message || "Unknown error"}`);
    }

    const categories = await fetchCategories();
    const tasks = await fetchAllTasks();

    createCategoriesList(categories, tasks);
    selectAllTasks(categories);
  } catch (error) {
    console.error("Something went wrong: " + error);
  }
}

function selectAllTasks(categories) {
  const catArr = createCategoryArray(categories);
  updateTasksHTML(0);
  updateCategoryTitle(catArr[0]);
}

function initFormCategoryEdit($editCategoryForm, categoryID) {
  console.log($editCategoryForm);
  if ($editCategoryForm) {
    $editCategoryForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const $categoryName = $editCategoryForm.querySelector(".form__input");

      await editCategory(
        {
          category: $categoryName.value,
        },
        categoryID
      );

      const categories = await fetchCategories();
      createCategoriesList(categories);
      $editCategoryForm.reset();
      $editCategoryForm.classList.remove("open");

      window.location.href = "http://localhost:2007/category/" + categoryID;
    });
  }
}

async function editCategory(content, categoryID) {
  try {
    const response = await fetch(`${API_URL}/api/categories/${categoryID}`, {
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

function createCategoryArray(categories) {
  const categoriesList = ["All tasks"];
  for (const category of categories) {
    categoriesList.push(category.category);
  }
  const capitalizedCategories = categoriesList.map((category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  });

  return capitalizedCategories;
}

function createCategoriesDropDown(categories) {
  let html = "";
  for (const category of categories) {
    html += `
    <option value="${category.category}">${category.category}</option>
    `;
  }
  return html;
}

const $categoryTitle = document.querySelector(".category-bg__title");

function updateCategoryTitle(categoryArray) {
  $categoryTitle.textContent = categoryArray;
}

function makeActive($article) {
  const $categoryItems = document.querySelectorAll(".category__list-item");
  $categoryItems.forEach((item) => {
    item.classList.remove("active");
  });

  $article.classList.add("active");
}

let globalCategoryID = 0;

function addEventListenerToCategory(categories, array) {
  categories.forEach((category, index) => {
    category.addEventListener("click", function (event) {
      const currentTarget = event.currentTarget.getAttribute("id");
      const categoryName = event.currentTarget.dataset.title;
      const $button = event.target.closest(".category__list-item-btn");

      if ($button) {
        const $article = $button.closest(".category__list-item");
        // makeActive($article);
        window.location.href = currentTarget != "0" ? "/category/" + currentTarget : "/";
      }
      if (currentTarget) {
        globalCategoryID = currentTarget;
        updateCategoryTitle(categoryName);
        updateTasksHTML(currentTarget);
      }
    });
  });
}

const $formCreateCategory = document.querySelector(".form--create-category");

function initFormCategoryCreation() {
  if ($formCreateCategory) {
    $formCreateCategory.addEventListener("submit", async function (event) {
      const $category = $formCreateCategory.querySelector(".form__input");
      const slug = slugCreation($category.value);

      event.preventDefault();

      await createCategory({
        category: $category.value,
        slug: slug,
      });

      const tasks = await fetchAllTasks();
      const categories = await fetchCategories();
      createCategoriesList(categories, tasks);
      createCategoryArray(categories);
      createCategoriesDropDown(categories);
      hideCreateCategoryWindow();
      initFormTaskCreation(categories);
    });
  }
}

async function createCategory(content) {
  try {
    const response = await fetch(`${API_URL}/api/categories`, {
      method: "POST",
      body: JSON.stringify(content),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Error: ${data.message || "Uknown error"}`);
    }
    const categories = await fetchCategories();
    createCategoryArray(categories);
  } catch (error) {
    console.log("Something went wrong: " + error);
  }
}

function slugCreation(slugContent) {
  const lowerCaseSlugcontent = slugContent.toLowerCase();
  const splitMultipleWords = lowerCaseSlugcontent.split(" ");
  const sluggify = splitMultipleWords.join("-");

  return sluggify;
}

const $btnAddCategory = document.querySelector(".category__list-item-add");
const $btnCancelCategoryCreate = document.getElementById("cancel-create-category");

function hideCreateCategoryWindow() {
  $formCreateCategory.classList.remove("show");
  $formCreateCategory.reset();
}

$btnAddCategory.addEventListener("click", function () {
  $formCreateCategory.classList.add("show");
});

$btnCancelCategoryCreate.addEventListener("click", function (event) {
  hideCreateCategoryWindow();
});

function printCategories(categories) {
  for (const category of categories) {
    console.log(category.users_id);
  }
}
// ========= RUN SCRIPT =========
(async function init() {
  const categories = await fetchCategories();
  const tasks = await fetchAllTasks();

  createTaskList(tasks, categories);
  // printCategories(categories);
  initFormCategoryCreation();
  initFormTaskCreation(categories);
  createCategoriesList(categories, tasks);

  const urlParts = window.location.pathname.split("/");

  if (urlParts.length >= 3 && urlParts[1] === "category") {
    console.log("ID:", urlParts[2]);
    const id = urlParts[2];

    const $article = document.getElementById("category-nav-" + id);
    $article.classList.add("active");

    updateCategoryTitle($article.dataset.title);
    updateTasksHTML(id);
  }
})();
