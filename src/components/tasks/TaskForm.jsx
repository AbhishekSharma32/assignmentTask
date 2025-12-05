import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTasks } from "../../context/TaskContext";
import { TASK_STATUS } from "../../utils/constants";
import { validateTaskForm } from "../../utils/validators";
// import "./TaskForm.css";

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, addTask, updateTask } = useTasks();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: TASK_STATUS.PENDING,
    dueDate: "",
  });

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      // Find the task from the tasks array
      const taskToEdit = tasks.find((t) => t.id === parseInt(id));
      if (taskToEdit) {
        setTask({
          title: taskToEdit.title,
          description: taskToEdit.description,
          status: taskToEdit.status,
          dueDate: taskToEdit.dueDate,
        });
      }
    }
  }, [id, tasks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateTaskForm(task);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      if (isEdit) {
        await updateTask(id, task);
      } else {
        await addTask(task);
      }
      navigate("/tasks");
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/tasks");
  };

  const isCompleted = task.status === TASK_STATUS.COMPLETED;

  return (
    <div className="task-form-container">
      <h2>{isEdit ? "Edit Task" : "Add New Task"}</h2>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={task.title}
            onChange={handleChange}
            className={errors.title ? "error" : ""}
            disabled={isCompleted}
          />
          {errors.title && <div className="field-error">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            rows={4}
            className={errors.description ? "error" : ""}
            disabled={isCompleted}
          />
          {errors.description && (
            <div className="field-error">{errors.description}</div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={task.status}
              onChange={handleChange}
              className={errors.status ? "error" : ""}
              disabled={isCompleted}
            >
              <option value={TASK_STATUS.PENDING}>Pending</option>
              <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
              <option value={TASK_STATUS.COMPLETED}>Completed</option>
            </select>
            {errors.status && (
              <div className="field-error">{errors.status}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
              className={errors.dueDate ? "error" : ""}
              disabled={isCompleted}
            />
            {errors.dueDate && (
              <div className="field-error">{errors.dueDate}</div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
