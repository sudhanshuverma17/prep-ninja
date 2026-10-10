import { createContext, useContext, useEffect, useState } from "react";
import { enable, disable } from "darkreader";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        if (darkMode) {
            enable({
                brightness: 100,
                contrast: 90,
                sepia: 0,
            });

            localStorage.setItem("theme", "dark");
        } else {
            disable();
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        <ThemeContext.Provider
            value={{
                darkMode,
                setDarkMode,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};