import React, { createContext, useContext, useState, useEffect } from "react";
import { taskService } from "../services/taskService";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError("Failed to add task");
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, ...updatedTask } : task
        )
      );
      return updatedTask;
    } catch (err) {
      setError("Failed to update task");
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError("Failed to delete task");
      throw err;
    }
  };

  const markAsCompleted = async (id) => {
    try {
      await updateTask(id, { status: "completed" });
    } catch (err) {
      console.error(err);
    }
  };

  const value = {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    markAsCompleted,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
