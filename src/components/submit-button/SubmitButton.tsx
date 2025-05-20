import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

interface Section {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.ComponentType<{ form: any }>;
}

interface SubmitButtonProps {
    activeSection: Section | null;
    form: ReturnType<typeof useForm>;
    isSubmitting: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: (data: any) => void;
}

export function SubmitButton({
    activeSection,
    form,
    isSubmitting,
    onSubmit,
}: SubmitButtonProps) {
    const handleSubmit = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data: any) => {
            if (
                !window.confirm(
                    "Are you sure you want to submit the evaluation?"
                )
            ) {
                return;
            }
            onSubmit(data);
        },
        [onSubmit]
    );

    const ActiveSectionComponent = activeSection?.component;

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {ActiveSectionComponent && <ActiveSectionComponent form={form} />}
            <div className="pt-4 flex justify-end">
                <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="transition-all duration-200"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <svg
                                className="animate-spin h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Submitting...
                        </span>
                    ) : (
                        "Submit Evaluation"
                    )}
                </Button>
            </div>
        </form>
    );
}
