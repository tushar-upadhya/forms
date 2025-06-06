import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import type { FormValues, Question, Section } from "@/lib/types";
import clsx from "clsx";
import { ClipboardListIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { fieldComponents } from "../components/form-one/FormOne";

interface SectionRendererProps {
    section: Section;
    form: UseFormReturn<FormValues>;
    index: number;
}

export default function SectionRenderer({
    section,
    form,
    index,
}: SectionRendererProps) {
    if (!form || !form.control) {
        console.error(`Form prop is invalid in Section: ${section.title}`);
        return (
            <div className="text-red-500 text-sm sm:text-base">
                Error: Form is not properly initialized
            </div>
        );
    }

    return (
        <div className="space-y-3 sm:space-y-4">
            <Card className="border rounded-lg overflow-hidden bg-card">
                <div className="px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <ClipboardListIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <span className="font-medium text-sm sm:text-base">
                            {section.title}
                        </span>
                    </div>
                </div>

                <CardContent className="p-2 sm:p-4 pt-1 sm:pt-2">
                    <Form {...form}>
                        <div
                            className={clsx(
                                "grid gap-4 sm:gap-6",
                                section.ui === "flex"
                                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                                    : "grid-cols-1"
                            )}
                        >
                            {section.questions.map((question: Question) => {
                                console.log(
                                    `Rendering question in ${section.title}: ID=${question.id}, Label=${question.label}, Type=${question.field_type}`
                                );
                                if (!question.id) {
                                    console.warn(
                                        `Missing ID for question: ${question.label}`
                                    );
                                }
                                return (
                                    <div
                                        key={question.id}
                                        className={clsx(
                                            question.field_type === "textarea"
                                                ? "col-span-1 sm:col-span-2 lg:col-span-3"
                                                : ""
                                        )}
                                    >
                                        {(() => {
                                            const FieldComponent =
                                                fieldComponents[
                                                    question.field_type
                                                ];
                                            return FieldComponent ? (
                                                <FieldComponent
                                                    question={question}
                                                    form={form}
                                                />
                                            ) : (
                                                <div className="text-red-500 text-sm">
                                                    Error: Unknown field type{" "}
                                                    {question.field_type}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                );
                            })}
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
