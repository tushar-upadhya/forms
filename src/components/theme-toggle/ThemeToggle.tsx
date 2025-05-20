import { Button } from "@/components/ui/button";
import { useTheme } from "@/theme-provider";
import { MoonIcon, SunIcon } from "lucide-react";
import { useCallback } from "react";

interface ThemeToggleProps {
    className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();

    const toggleTheme = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark");
    }, [theme, setTheme]);

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={className}
            aria-label={
                theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            }
        >
            {theme === "dark" ? (
                <SunIcon className="h-5 w-5 text-primary" />
            ) : (
                <MoonIcon className="h-5 w-5 text-primary" />
            )}
        </Button>
    );
}
