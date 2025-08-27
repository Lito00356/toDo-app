import Task from "../../models/Task.js";

export const getAllTasks = async (req, res, next) => {
  const userId = req.user.id;
  const tasksList = await Task.query().withGraphFetched("categories").where("users_id", userId);
  res.json(tasksList);
};

export const getSingleTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.query().findById(id);

    if (!task) {
      res.status(404).json({ message: "This task was not found." });
      return;
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" + error });
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { taskName, is_completed } = req.body;
    const category_id = parseInt(req.body.category_id);
    const userId = req.user.id;

    if (category_id == 0) {
      return res.status(400).json({ message: "Please select a category before creating a task!" });
    }

    const task = await Task.query().insert({
      taskName,
      category_id,
      is_completed,
      users_id: userId,
    });

    res.status(200).json({
      message: "You have created a task " + task.taskName,
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" + error });
  }
};

export const updateTask = async (req, res, next) => {
  const { id } = req.params;
  const { taskName, is_completed } = req.body;
  console.log(req.body);
  console.log(taskName);

  try {
    const task = await Task.query().findById(id);
    if (!task) {
      res.status(404).json({
        message: "Task not found",
      });
      return;
    }

    if (taskName === undefined) {
      const updateCompletedStatus = await Task.query().patchAndFetchById(id, {
        is_completed,
      });
      res.json({
        message: "Task has been updated",
        is_completed: updateCompletedStatus,
      });
    }
    if (taskName !== undefined) {
      const updatedTask = await Task.query().patchAndFetchById(id, {
        taskName,
      });
      res.json({
        message: "Task has been updated",
        is_completed: updatedTask,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." + error });
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const numDeleted = await Task.query().deleteById(id);

    if (numDeleted === 0) {
      res.status(404).json({ message: "Task was not found" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" + error });
  }

  res.json({ message: "Task deleted" });
};
