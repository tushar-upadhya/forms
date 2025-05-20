import { EyeIcon } from "lucide-react";
import { ThemeToggle } from "../theme-toggle/ThemeToggle";

export function FormHeader() {
    return (
        <header className="mb-8 text-center">
            <div className="flex justify-center items-center gap-2 mb-2 relative">
                <EyeIcon className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">
                    Patient Ophthalmic Evaluation
                </h1>
                <ThemeToggle className="absolute right-0 top-0" />
            </div>
            <p className="text-muted-foreground">
                Comprehensive eye examination and treatment planning form.
            </p>
        </header>
    );
}
