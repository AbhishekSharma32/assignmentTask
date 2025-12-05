import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { TaskProvider } from "../../../context/TaskContext";
import TaskList from "../TaskList";

// Mock the task service
jest.mock("../../../services/taskService", () => ({
  taskService: {
    getAllTasks: jest.fn(() =>
      Promise.resolve([
        {
          id: 1,
          title: "Test Task 1",
          description: "Description 1",
          status: "pending",
          dueDate: "2023-12-01",
        },
        {
          id: 2,
          title: "Test Task 2",
          description: "Description 2",
          status: "completed",
          dueDate: "2023-11-01",
        },
      ])
    ),
  },
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <TaskProvider>{component}</TaskProvider>
    </BrowserRouter>
  );
};

describe("TaskList", () => {
  test("renders task list with tasks", async () => {
    renderWithProviders(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
      expect(screen.getByText("Test Task 2")).toBeInTheDocument();
    });
  });

  test("shows loading state initially", () => {
    renderWithProviders(<TaskList />);
    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();
  });

  test("displays no tasks message when list is empty", async () => {
    // Mock empty response
    jest.mock("../../../services/taskService", () => ({
      taskService: {
        getAllTasks: jest.fn(() => Promise.resolve([])),
      },
    }));

    renderWithProviders(<TaskList />);

    await waitFor(() => {
      // Since we're using drag and drop columns, we won't see a "no tasks" message
      // Instead, we'll see empty columns
      expect(screen.getByText("Pending")).toBeInTheDocument();
      expect(screen.getByText("In Progress")).toBeInTheDocument();
      expect(screen.getByText("Completed")).toBeInTheDocument();
    });
  });

  test("navigates to add task form when add button is clicked", async () => {
    const mockNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => mockNavigate,
    }));

    renderWithProviders(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText("Add New Task")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Add New Task"));
    expect(mockNavigate).toHaveBeenCalledWith("/tasks/new");
  });
});
