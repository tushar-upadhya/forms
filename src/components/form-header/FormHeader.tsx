import { EyeIcon } from "lucide-react";
import { ThemeToggle } from "../theme-toggle/ThemeToggle";

export function FormHeader() {
    return (
        <header className="mb-8 text-center">
            <div className="relative flex flex-col items-center gap-2 md:flex-row md:justify-center md:gap-2 mb-2">
                <EyeIcon className="h-8 w-8 text-primary" />
                <h1 className="text-2xl md:text-3xl text-muted-foreground  font-bold tracking-tight">
                    Patient Ophthalmic Evaluation
                </h1>
                <div className="absolute right-4 top-0 md:static md:ml-auto">
                    <ThemeToggle />
                </div>
            </div>
            <p className="text-muted-foreground text-sm md:text-base">
                Comprehensive eye examination and treatment planning form.
            </p>
        </header>
    );
}
