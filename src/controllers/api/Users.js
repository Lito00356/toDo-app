import User from "../../models/User.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.query();
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: "No categories found" });
    return;
  }
};

export const getSingleUser = async (req, res, next) => {
  const { id } = req.params;
  //   const userID = req.user.id;
  const users = await User.query().findById(id);

  if (!users) {
    res.status(404).json({ message: "This category was not found!" });
    return;
  }

  res.json(users);
};
