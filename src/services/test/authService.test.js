// import { authService } from '../authService';

import { authService } from "../AuthService";

describe("authService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should login with valid credentials", async () => {
    const result = await authService.login("admin", "admin123");

    expect(result.success).toBe(true);
    expect(result.user.username).toBe("admin");
    expect(result.token).toBeDefined();
    expect(localStorage.getItem("token")).toBe(result.token);
  });

  test("should throw error with invalid credentials", async () => {
    await expect(authService.login("invalid", "credentials")).rejects.toThrow(
      "Invalid credentials"
    );
  });

  test("should logout and clear storage", () => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("user", JSON.stringify({ id: 1, username: "test" }));

    authService.logout();

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  test("should return current user from storage", () => {
    const user = { id: 1, username: "test" };
    localStorage.setItem("user", JSON.stringify(user));

    expect(authService.getCurrentUser()).toEqual(user);
  });

  test("should return null when no user in storage", () => {
    expect(authService.getCurrentUser()).toBeNull();
  });

  test("should check authentication status correctly", () => {
    expect(authService.isAuthenticated()).toBe(false);

    localStorage.setItem("token", "test-token");
    expect(authService.isAuthenticated()).toBe(true);
  });
});
