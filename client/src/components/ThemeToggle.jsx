import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
    const { darkMode, setDarkMode } =
        useTheme();

    return (
        <button
            onClick={() =>
                setDarkMode(!darkMode)
            }
            className="btn btn-outline-secondary"
        >
            {darkMode ? (
                <FaSun />
            ) : (
                <FaMoon />
            )}
        </button>
    );
}

export default ThemeToggle;