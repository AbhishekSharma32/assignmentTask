import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../../context/TaskContext";
import {
  formatDate,
  getStatusColor,
  getStatusLabel,
} from "../../utils/helpers";
// import "./TaskCard.css";

const TaskCard = ({ task }) => {
  const { deleteTask, markAsCompleted } = useTasks();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    navigate(`/tasks/edit/${task.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setIsDeleting(true);
      try {
        await deleteTask(task.id);
      } catch (error) {
        console.error("Failed to delete task:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleMarkCompleted = async () => {
    try {
      await markAsCompleted(task.id);
    } catch (error) {
      console.error("Failed to mark task as completed:", error);
    }
  };

  const isCompleted = task.status === "completed";

  return (
    <div className={`task-card ${isCompleted ? "completed" : ""}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span
          className="task-status"
          style={{ backgroundColor: getStatusColor(task.status) }}
        >
          {getStatusLabel(task.status)}
        </span>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-meta">
        <span className="task-due-date">Due: {formatDate(task.dueDate)}</span>
      </div>

      <div className="task-actions">
        {!isCompleted && (
          <>
            <button className="edit-btn" onClick={handleEdit}>
              Edit
            </button>
            <button className="complete-btn" onClick={handleMarkCompleted}>
              Complete
            </button>
          </>
        )}
        <button
          className="delete-btn"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
