import { Button } from "@/components/ui/button";
import type { FormValues } from "@/lib/type/type";
import { EyeIcon, MoonIcon, SunIcon } from "lucide-react";
import { useState } from "react";
import PatientInfoSection from "./section/PatientInfoSection";

import { useForm } from "react-hook-form";

export default function FormOne() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const form = useForm<FormValues>();

    function onSubmit(data: FormValues) {
        setIsSubmitting(true);
        setTimeout(() => {
            console.log("Form submitted:", data);
            setIsSubmitting(false);
            form.reset();
        }, 1500);
    }

    function toggleTheme() {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle("dark");
    }

    return (
        <div
            className={`container mx-auto py-8 px-4 md:px-6 max-w-4xl animate-in fade-in duration-500 ${
                isDarkMode ? "dark" : ""
            }`}
        >
            <header className="mb-8 text-center">
                <div className="flex justify-center items-center gap-2 mb-2 relative">
                    <EyeIcon className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">
                        Patient Ophthalmic Evaluation
                    </h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="absolute right-0 top-0"
                        aria-label={
                            isDarkMode
                                ? "Switch to light mode"
                                : "Switch to dark mode"
                        }
                    >
                        {isDarkMode ? (
                            <SunIcon className="h-5 w-5 text-primary" />
                        ) : (
                            <MoonIcon className="h-5 w-5 text-primary" />
                        )}
                    </Button>
                </div>
                <p className="text-muted-foreground">
                    Comprehensive eye examination and treatment planning form.
                </p>
            </header>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <PatientInfoSection />

                <div className="pt-4 flex justify-end">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="transition-all duration-200"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Evaluation"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
