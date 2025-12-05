import React from "react";
import { TASK_STATUS, SORT_OPTIONS } from "../../utils/constants";
// import "./TaskFilter.css";

const TaskFilter = ({ filter, setFilter }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="task-filter">
      <div className="filter-group">
        <input
          type="text"
          name="search"
          value={filter.search}
          onChange={handleChange}
          placeholder="Search tasks..."
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <select
          name="status"
          value={filter.status}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value={TASK_STATUS.PENDING}>Pending</option>
          <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
          <option value={TASK_STATUS.COMPLETED}>Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <select
          name="sortBy"
          value={filter.sortBy}
          onChange={handleChange}
          className="filter-select"
        >
          <option value={SORT_OPTIONS.DUE_DATE}>Sort by Due Date</option>
          <option value={SORT_OPTIONS.TITLE}>Sort by Title</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilter;
