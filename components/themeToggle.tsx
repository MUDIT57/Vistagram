"use client";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const newTheme = isDark ? "light" : "dark";
    root.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="cursor-pointer p-2 rounded-full border border-border bg-surface-muted text-foreground hover:scale-105 duration-200"
    >
      <Moon size={20} className="dark:hidden" />
      <Sun size={20} className="hidden dark:block" />
    </button>
  );
}
