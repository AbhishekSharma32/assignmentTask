// Mock authentication service
const authService = {
  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Login function
  login: async (username, password) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication logic
    if (username === "admin" && password === "admin123") {
      const user = { id: 1, username: "admin", role: "admin" };
      const token = "mock-jwt-token-admin";

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true, user, token };
    } else if (username === "user" && password === "user123") {
      const user = { id: 2, username: "user", role: "user" };
      const token = "mock-jwt-token-user";

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true, user, token };
    }

    throw new Error("Invalid credentials");
  },

  // Logout function
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Check if user is authenticated
  isAuthenticated: () => !!localStorage.getItem("token"),
};

export default authService;
