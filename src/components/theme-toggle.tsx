"use client";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  }

  return (
    <button
      type="button"
      className="btn btn-secondary shrink-0 !px-2.5 sm:!px-3"
      onClick={toggle}
      aria-label="Toggle color theme"
    >
      <span className="dark:hidden">
        <span className="sm:hidden" aria-hidden>☾</span>
        <span className="hidden sm:inline">Dark</span>
      </span>
      <span className="hidden dark:inline">
        <span className="sm:hidden" aria-hidden>☀</span>
        <span className="hidden sm:inline">Light</span>
      </span>
    </button>
  );
}
