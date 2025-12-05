import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useTasks } from "../../context/TaskContext";
import { TASK_STATUS, SORT_OPTIONS } from "../../utils/constants";
import TaskCard from "./TaskCard";
import TaskFilter from "./TaskFilter";
// import "./TaskList.css";

const TaskList = () => {
  const { tasks, loading, error } = useTasks();
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    status: "all",
    search: "",
    sortBy: SORT_OPTIONS.DUE_DATE,
  });

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by status
    if (filter.status !== "all") {
      filtered = filtered.filter((task) => task.status === filter.status);
    }

    // Filter by search
    if (filter.search) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(filter.search.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (filter.sortBy === SORT_OPTIONS.DUE_DATE) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return a.title.localeCompare(b.title);
    });

    return filtered;
  }, [tasks, filter]);

  const handleDragEnd = (result) => {
    // In a real app, this would update the task order/status in the backend
    if (!result.destination) return;

    const source = result.source;
    const destination = result.destination;

    // Don't do anything if dragging to the same location
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Get the task being moved
    const task = filteredAndSortedTasks[source.index];

    // Update the task status based on the destination column
    let newStatus;
    switch (destination.droppableId) {
      case "pending-tasks":
        newStatus = TASK_STATUS.PENDING;
        break;
      case "in-progress-tasks":
        newStatus = TASK_STATUS.IN_PROGRESS;
        break;
      case "completed-tasks":
        newStatus = TASK_STATUS.COMPLETED;
        break;
      default:
        newStatus = task.status;
    }

    // If status changed, update the task
    if (newStatus !== task.status) {
      // In a real app, this would call the updateTask service
      // For demo purposes, we'll just show a toast
      console.log(`Task moved to ${newStatus.replace("-", " ")} status`);
    }
  };

  // Group tasks by status for drag and drop
  const pendingTasks = filteredAndSortedTasks.filter(
    (task) => task.status === TASK_STATUS.PENDING
  );
  const inProgressTasks = filteredAndSortedTasks.filter(
    (task) => task.status === TASK_STATUS.IN_PROGRESS
  );
  const completedTasks = filteredAndSortedTasks.filter(
    (task) => task.status === TASK_STATUS.COMPLETED
  );

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>Tasks</h2>
        <button className="add-task-btn" onClick={() => navigate("/tasks/new")}>
          Add New Task
        </button>
      </div>

      <TaskFilter filter={filter} setFilter={setFilter} />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="task-columns">
          <div className="task-column">
            <h3>Pending</h3>
            <Droppable droppableId="pending-tasks">
              {(provided) => (
                <div
                  className="task-list"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {pendingTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div className="task-column">
            <h3>In Progress</h3>
            <Droppable droppableId="in-progress-tasks">
              {(provided) => (
                <div
                  className="task-list"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {inProgressTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div className="task-column">
            <h3>Completed</h3>
            <Droppable droppableId="completed-tasks">
              {(provided) => (
                <div
                  className="task-list"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {completedTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskList;
