// Validate task form
export const validateTaskForm = (task) => {
  const errors = {};

  if (!task.title || task.title.trim() === "") {
    errors.title = "Title is required";
  } else if (task.title.length < 3) {
    errors.title = "Title must be at least 3 characters";
  }

  if (!task.description || task.description.trim() === "") {
    errors.description = "Description is required";
  } else if (task.description.length < 10) {
    errors.description = "Description must be at least 10 characters";
  }

  if (!task.status) {
    errors.status = "Status is required";
  }

  if (!task.dueDate) {
    errors.dueDate = "Due date is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate login form
export const validateLoginForm = (credentials) => {
  const errors = {};

  if (!credentials.username || credentials.username.trim() === "") {
    errors.username = "Username is required";
  }

  if (!credentials.password || credentials.password.trim() === "") {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
