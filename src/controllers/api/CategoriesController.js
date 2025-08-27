import Category from "../../models/Category.js";

export const getAllCategories = async (req, res, next) => {
  try {
    const categoriesList = await Category.query().withGraphFetched("tasks");
    res.json(categoriesList);
  } catch (error) {
    res.status(400).json({ message: "No categories found" });
    return;
  }
};

export const getCategoriesUser = async (req, res) => {
  try {
    const userId = req.user.id;
    // const categories = await Category.query().where("users_id", userId).withGraphFetched("tasks");
    const categories = await Category.query()
      .where("users_id", userId)
      .withGraphFetched("tasks(filterByUser)")
      .modifiers({ filterByUser: (builder) => builder.where("users_id", userId) });

    res.json(categories);
  } catch (error) {
    res.status(400).json({ message: "something went wrong" + error });
  }
};

export const getSingleCategory = async (req, res, next) => {
  const { id } = req.params;
  const categoriesList = await Category.query().findById(id);

  if (!categoriesList) {
    res.status(404).json({ message: "This category was not found!" });
    return;
  }

  res.json(categoriesList);
};

export const createCategory = async (req, res, next) => {
  try {
    const { category, slug } = req.body;
    const userId = req.user.id;

    const newCategory = await Category.query().insert({
      category,
      slug,
      users_id: userId,
    });

    res.status(200).json({ message: "You have created a category " + newCategory.category });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" + error });
  }
};

export const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { category } = req.body;

  try {
    if (!category) {
      res.status(400).json({
        message: "id and category are required",
      });
      return;
    }

    const categoryList = await Category.query().findById(id);
    if (!categoryList) {
      res.status(404).json({
        message: "Category not found",
      });
      return;
    }

    const existingCategory = await Category.query().where("category", category).first();
    if (existingCategory) {
      res.status(400).json({
        message: "Categroy with the same name already exists",
      });
      return;
    }

    const updatedCategory = await Category.query().patchAndFetchById(id, {
      category,
    });

    res.json({
      message: "Category has been updated",
      interest: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." + error });
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.body;

    const numDeleted = await Category.query().deleteById(id);

    if (numDeleted === 0) {
      res.status(404).json({ message: "Category was not found" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" + error });
  }

  res.json({ message: "Category deleted" });
};
