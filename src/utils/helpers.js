import { format } from "date-fns";

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "MMM dd, yyyy");
};

// Get status color
export const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "#ffc107";
    case "in-progress":
      return "#17a2b8";
    case "completed":
      return "#28a745";
    default:
      return "#6c757d";
  }
};

// Get status label
export const getStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "in-progress":
      return "In Progress";
    case "completed":
      return "Completed";
    default:
      return status;
  }
};
