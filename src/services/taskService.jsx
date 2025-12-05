import { apiService } from "./apiService";

// Generate random due date
const generateRandomDueDate = () => {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 30);
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Generate random description
const generateDescription = () => {
  const descriptions = [
    "Complete this task as soon as possible",
    "This task requires careful attention to detail",
    "Important task that needs to be completed",
    "Follow the guidelines provided in the documentation",
    "Review and submit before the deadline",
    "Collaborate with team members for this task",
    "Ensure all requirements are met",
    "This task is part of the current sprint",
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

// Transform API data to our format
const transformTask = (task) => ({
  id: task.id,
  title: task.title,
  description: generateDescription(),
  status: task.completed
    ? "completed"
    : Math.random() > 0.5
    ? "pending"
    : "in-progress",
  dueDate: generateRandomDueDate(),
  userId: task.userId,
});

export const taskService = {
  // Get all tasks
  getAllTasks: async () => {
    const response = await apiService.get("/todos");
    return response.data.map(transformTask);
  },

  // Get task by ID
  getTaskById: async (id) => {
    const response = await apiService.get(`/todos/${id}`);
    return transformTask(response.data);
  },

  // Create new task (mock)
  createTask: async (taskData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newTask = {
      id: Math.floor(Math.random() * 1000),
      ...taskData,
      userId: 1, // Mock user ID
    };

    return newTask;
  },

  // Update task (mock)
  updateTask: async (id, taskData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      id,
      ...taskData,
    };
  },

  // Delete task (mock)
  deleteTask: async (id) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  },
};
