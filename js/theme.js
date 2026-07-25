const THEME_KEY = "theme";

// Load Theme
function loadTheme() {

    const theme = localStorage.getItem(THEME_KEY);

    if (theme === "dark") {
        document.body.classList.add("dark");
    }

}

// Toggle Theme
function toggleTheme() {

    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");

}

loadTheme();