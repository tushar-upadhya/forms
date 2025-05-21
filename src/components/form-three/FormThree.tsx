import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { sections } from "@/lib/section";
import type { FormValues } from "@/lib/type/type";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { FormAppSidebar } from "./form-sidebar/FormSidebar";

export default function FormThree() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeSection, setActiveSection] = useState(sections[0].id);
    const form = useForm<FormValues>({ defaultValues: {} });

    const onSubmit = useCallback(
        (data: FormValues) => {
            if (
                !window.confirm(
                    "Are you sure you want to submit the evaluation?"
                )
            ) {
                return;
            }
            setIsSubmitting(true);
            setTimeout(() => {
                console.log("Form submitted:", data);
                setIsSubmitting(false);
                form.reset();
            }, 1500);
        },
        [form]
    );

    const handleSectionChange = useCallback((sectionId: string) => {
        setActiveSection(sectionId);
    }, []);

    const ActiveSectionComponent = sections.find(
        (section) => section.id === activeSection
    )?.component;

    const activeSectionLabel = sections.find(
        (section) => section.id === activeSection
    )?.label;

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "19rem",
                } as React.CSSProperties
            }
        >
            <FormAppSidebar
                sections={sections}
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
            />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                    <SidebarTrigger
                        className="-ml-1"
                        aria-label="Toggle sidebar"
                    />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {activeSectionLabel}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 animate-in fade-in duration-500"
                    >
                        {ActiveSectionComponent && (
                            <ActiveSectionComponent form={form} />
                        )}
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
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
