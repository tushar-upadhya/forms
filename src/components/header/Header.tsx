import { EyeIcon } from "lucide-react";
import { ThemeToggle } from "../theme-toggle/ThemeToggle";

const Header = () => {
    return (
        <header className="mb-8 text-center px-2 sm:px-4">
            <div className="relative flex flex-col items-center gap-2 md:flex-row md:justify-center md:gap-4 mb-2 w-full">
                <EyeIcon className="h-8 w-8 text-primary " />0
                <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl text-muted-foreground font-bold tracking-tight break-words max-w-[90vw] md:max-w-none">
                    Patient Ophthalmic Evaluation
                </h1>
                <div className="absolute right-2 top-0 md:static md:ml-auto">
                    <ThemeToggle />
                </div>
            </div>
            <p className="text-muted-foreground text-xs xs:text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md md:max-w-xl mx-auto px-1 break-words">
                Comprehensive eye examination and treatment planning form.
            </p>
        </header>
    );
};
export default Header;
