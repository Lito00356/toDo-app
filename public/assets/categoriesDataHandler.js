const API_URL = "http://localhost:2007";

// ============ TOAST ============

function showToast(message, type = "success") {
  let $container = document.querySelector(".toast-container");
  if (!$container) {
    $container = document.createElement("div");
    $container.className = "toast-container";
    document.body.appendChild($container);
  }

  const $toast = document.createElement("div");
  $toast.className = `toast toast--${type}`;
  $toast.textContent = message;
  $container.appendChild($toast);

  setTimeout(() => {
    $toast.classList.add("toast--out");
    $toast.addEventListener("animationend", () => $toast.remove(), { once: true });
  }, 3000);
}

// ============ API HELPER ============

async function apiFetch(path, method = "GET", body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body !== null) options.body = JSON.stringify(body);
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unknown error");
  return data;
}

// ============ FETCH ============

async function fetchCategories() {
  try {
    return await apiFetch("/api/categories");
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

// ============ RENDER ============

const $categoryContainer = document.querySelector(".category__list-container");

function createCategoriesList(categories, tasks) {
  let totalCount = 0;
  let html = "";

  for (const category of categories) {
    totalCount += category.tasks.length;
    html += `
    <article class="category__list-item" data-id="${category.id}" data-title="${category.category}" id="category-nav-${category.id}">
        <button class="button category__list-item-btn" data-title="${category.category}" id="${category.id}">
            ${category.category}
        </button>
        <div class="category__list-settings">
            <span class="category__list-item-count">${category.tasks.length}</span>
            <button class="button category__list-settings-btn" id="${category.id}">
                <img class="button__icon" src="/images/settings.png" alt="settings logo">
            </button>
            <button class="button category__list-settings-btn close">&#10006;</button>
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

  const allCategoriesItem = `
  <article class="category__list-item">
    <button class="button category__list-item-btn" id="0">
      All tasks
      <span class="category__list-item-count counter">${totalCount}</span>
    </button>
  </article>
  `;

  $categoryContainer.innerHTML = allCategoriesItem + html;

  addEventListenerToSettings($categoryContainer);
  addEventListenerToCategory(document.querySelectorAll(".category__list-item-btn"));
}

// ============ SETTINGS PANEL ============

function addEventListenerToSettings($container) {
  $container.addEventListener("click", async function (event) {
    // Settings button (exclude the close button which shares the class)
    const $settingsBtn = event.target.closest(".category__list-settings-btn:not(.close)");
    if ($settingsBtn) {
      const $categoryItem = $settingsBtn.closest(".category__list-item");
      $categoryItem.classList.add("open");
      $categoryItem.querySelector(".category__list-actions").classList.add("open");
      $settingsBtn.classList.add("open");
      $categoryItem.querySelector(".close").classList.add("open");
    }

    // Close button — use $closeButton (not $settingsBtn) to avoid the original null-reference bug
    const $closeButton = event.target.closest(".close");
    if ($closeButton) {
      const $categoryItem = $closeButton.closest(".category__list-item");
      $categoryItem.classList.remove("open");
      $categoryItem.querySelector(".category__list-actions").classList.remove("open");
      $categoryItem.querySelector(".category__list-settings-btn:not(.close)").classList.remove("open");
      $closeButton.classList.remove("open");
    }

    const $deleteBtn = event.target.closest(".category__list-delete-btn");
    if ($deleteBtn) {
      const categoryID = $deleteBtn.getAttribute("id");
      openConfirmation(null, categoryID, "category__list-delete-btn");
    }

    const $editBtn = event.target.closest(".category__list-edit-btn");
    if ($editBtn) {
      startInlineEditCategory($editBtn.closest(".category__list-item"));
    }
  });
}

// ============ INLINE EDIT (CATEGORY) ============

function startInlineEditCategory($categoryItem) {
  if ($categoryItem.classList.contains("editing")) return;
  $categoryItem.classList.add("editing");

  const $nameBtn = $categoryItem.querySelector(".category__list-item-btn");
  const currentName = $nameBtn.textContent.trim();
  const categoryID = $categoryItem.dataset.id;

  const $editWrapper = document.createElement("div");
  $editWrapper.className = "category__inline-edit";
  $editWrapper.innerHTML = `
    <input class="category__edit-input" type="text" value="${currentName}">
    <button class="button category__edit-save" type="button">OK</button>
    <button class="button category__edit-cancel" type="button">&#10006;</button>
  `;
  $nameBtn.replaceWith($editWrapper);

  const $input = $editWrapper.querySelector(".category__edit-input");
  const $saveBtn = $editWrapper.querySelector(".category__edit-save");
  const $cancelBtn = $editWrapper.querySelector(".category__edit-cancel");

  $input.focus();
  $input.select();

  $saveBtn.addEventListener("click", async function () {
    const newName = $input.value.trim();
    if (newName && newName !== currentName) {
      await editCategory({ category: newName }, categoryID);
      showToast("Category updated");
    }
    const [categories, tasks] = await Promise.all([fetchCategories(), fetchAllTasks()]);
    createCategoriesList(categories, tasks);
  });

  $cancelBtn.addEventListener("click", async function () {
    const [categories, tasks] = await Promise.all([fetchCategories(), fetchAllTasks()]);
    createCategoriesList(categories, tasks);
  });

  $input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") $saveBtn.click();
    if (e.key === "Escape") $cancelBtn.click();
  });
}

// ============ CRUD ============

async function deleteCategory(content, categoryID) {
  try {
    await apiFetch(`/api/categories/${categoryID}`, "DELETE", content);
    const [categories, tasks] = await Promise.all([fetchCategories(), fetchAllTasks()]);
    createCategoriesList(categories, tasks);
    renderTasks(tasks, 0);
    updateCategoryTitle("All tasks");
  } catch (error) {
    console.error("Error deleting category:", error);
  }
}

async function editCategory(content, categoryID) {
  try {
    return await apiFetch(`/api/categories/${categoryID}`, "PATCH", content);
  } catch (error) {
    console.error("Error editing category:", error);
  }
}

async function createCategory(content) {
  try {
    return await apiFetch("/api/categories", "POST", content);
  } catch (error) {
    console.error("Error creating category:", error);
  }
}

// ============ HELPERS ============

function createCategoryArray(categories) {
  return ["All tasks", ...categories.map((c) => c.category.charAt(0).toUpperCase() + c.category.slice(1))];
}

function createCategoriesDropDown(categories) {
  return categories.map((c) => `<option value="${c.id}">${c.category}</option>`).join("");
}

function slugCreation(slugContent) {
  return slugContent.toLowerCase().split(" ").join("-");
}

// ============ UI HELPERS ============

const $categoryTitle = document.querySelector(".category-bg__title");

function updateCategoryTitle(title) {
  $categoryTitle.textContent = title || "All tasks";
}

function makeActive($article) {
  document.querySelectorAll(".category__list-item").forEach((item) => item.classList.remove("active"));
  $article.classList.add("active");
}

let globalCategoryID = 0;

function addEventListenerToCategory(categoryBtns) {
  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", function (event) {
      const $button = event.target.closest(".category__list-item-btn");
      if (!$button) return;

      const id = $button.getAttribute("id");
      globalCategoryID = id;
      window.location.href = id !== "0" ? "/category/" + id : "/";
    });
  });
}

// ============ CREATE CATEGORY FORM ============

const $formCreateCategory = document.querySelector(".form--create-category");
const $btnAddCategory = document.querySelector(".category__list-item-add");
const $btnCancelCategoryCreate = document.getElementById("cancel-create-category");

function hideCreateCategoryWindow() {
  $formCreateCategory.classList.remove("show");
  $formCreateCategory.reset();
}

$btnAddCategory.addEventListener("click", function () {
  $formCreateCategory.classList.add("show");
});

$btnCancelCategoryCreate.addEventListener("click", function () {
  hideCreateCategoryWindow();
});

function initFormCategoryCreation() {
  if (!$formCreateCategory) return;

  $formCreateCategory.addEventListener("submit", async function (event) {
    event.preventDefault();
    const $input = $formCreateCategory.querySelector(".form__input");
    const name = $input.value.trim();

    await createCategory({ category: name, slug: slugCreation(name) });
    showToast("Category created!");

    const [categories, tasks] = await Promise.all([fetchCategories(), fetchAllTasks()]);
    createCategoriesList(categories, tasks);
    hideCreateCategoryWindow();
    initFormTaskCreation(categories);
  });
}
