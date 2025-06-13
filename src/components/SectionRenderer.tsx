import { fieldComponents } from "@/components/form-one/FormOne";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { getFieldName, type FormValues, type Section } from "@/lib/types";
import { buildVariableMap, evaluateVisibilityCondition } from "@/lib/utils";
import clsx from "clsx";
import { ClipboardListIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { useFormContext } from "react-hook-form";

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
    const { watch } = useFormContext();

    if (!form || !form.control) {
        console.error(`Form prop is invalid in Section: ${section.title}`);
        return (
            <div className="text-red-500 text-sm sm:text-base">
                Error: Form is not properly initialized
            </div>
        );
    }

    // Validate schema for HMCF
    section.questions.forEach((question) => {
        if (question.options?.some((option) => option.id === "HMCF")) {
            console.error(
                `HMCF found in section ${section.id} (${section.title}), question ${question.id} (${question.label}):`,
                question.options
            );
        }
    });

    const formValues = watch();
    const variableMap = buildVariableMap(section.questions);

    const fieldTypePriority = {
        select: 1,
        textarea: 2,
        input: 3,
        radio: 4,
        checkbox: 4,
    };

    const sortedQuestions = [...section.questions].sort((a, b) => {
        return (
            (fieldTypePriority[a.field_type] || 5) -
            (fieldTypePriority[b.field_type] || 5)
        );
    });

    const leftEyeQuestions = sortedQuestions.filter((q) =>
        q.label.toLowerCase().includes("left eye")
    );
    const rightEyeQuestions = sortedQuestions.filter((q) =>
        q.label.toLowerCase().includes("right eye")
    );
    const otherQuestions = sortedQuestions.filter(
        (q) =>
            !q.label.toLowerCase().includes("left eye") &&
            !q.label.toLowerCase().includes("right eye")
    );

    const gridClass =
        section.ui === "grid-cols-2"
            ? "grid-cols-1 md:grid-cols-2"
            : section.ui === "flex"
            ? "grid-cols-1"
            : "grid-cols-1";

    return (
        <div className="space-y-3 sm:space-y-4">
            <Accordion
                type="single"
                defaultValue={`section-${index}`}
                collapsible
                className="border rounded-lg overflow-hidden bg-card"
            >
                <AccordionItem value={`section-${index}`} className="border-0">
                    <AccordionTrigger className="px-2 sm:px-4 py-2 sm:py-3 hover:bg-muted/50 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-2">
                            <ClipboardListIcon className="w-4 h-4 sm:h-5 sm:w-5 text-primary" />
                            <span className="font-medium text-sm sm:text-base truncate sm:truncate-none">
                                {section.title}
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <CardContent className="p-2 sm:p-4 pt-1 sm:pt-2">
                            <Form {...form}>
                                <div
                                    className={clsx(
                                        "grid gap-4 sm:gap-6",
                                        gridClass
                                    )}
                                >
                                    {/* Left Eye Column */}
                                    <div className="space-y-4">
                                        {leftEyeQuestions.map((question) => {
                                            if (
                                                !evaluateVisibilityCondition(
                                                    question.visibility_condition,
                                                    formValues,
                                                    variableMap
                                                )
                                            ) {
                                                return null;
                                            }
                                            return (
                                                <div
                                                    key={
                                                        question.id ||
                                                        `${
                                                            section.id
                                                        }-${getFieldName(
                                                            question.label
                                                        )}`
                                                    }
                                                    className={clsx(
                                                        question.field_type ===
                                                            "textarea" ||
                                                            question.is_repeatable_question
                                                            ? "col-span-1"
                                                            : "col-span-1"
                                                    )}
                                                >
                                                    {(() => {
                                                        const FieldComponent =
                                                            fieldComponents[
                                                                question
                                                                    .field_type
                                                            ];
                                                        return FieldComponent ? (
                                                            <FieldComponent
                                                                question={
                                                                    question
                                                                }
                                                                form={form}
                                                            />
                                                        ) : (
                                                            <div className="text-red-500 text-sm">
                                                                Error: Unknown
                                                                field type{" "}
                                                                {
                                                                    question.field_type
                                                                }
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {/* Right Eye Column */}
                                    <div className="space-y-4">
                                        {rightEyeQuestions.map((question) => {
                                            if (
                                                !evaluateVisibilityCondition(
                                                    question.visibility_condition,
                                                    formValues,
                                                    variableMap
                                                )
                                            ) {
                                                return null;
                                            }
                                            return (
                                                <div
                                                    key={
                                                        question.id ||
                                                        `${
                                                            section.id
                                                        }-${getFieldName(
                                                            question.label
                                                        )}`
                                                    }
                                                    className={clsx(
                                                        question.field_type ===
                                                            "textarea" ||
                                                            question.is_repeatable_question
                                                            ? "col-span-1"
                                                            : "col-span-1"
                                                    )}
                                                >
                                                    {(() => {
                                                        const FieldComponent =
                                                            fieldComponents[
                                                                question
                                                                    .field_type
                                                            ];
                                                        return FieldComponent ? (
                                                            <FieldComponent
                                                                question={
                                                                    question
                                                                }
                                                                form={form}
                                                            />
                                                        ) : (
                                                            <div className="text-red-500 text-sm">
                                                                Error: Unknown
                                                                field type{" "}
                                                                {
                                                                    question.field_type
                                                                }
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {/* Other Questions (full width) */}
                                    {otherQuestions.length > 0 && (
                                        <div className="col-span-1 md:col-span-2 space-y-4 mt-4">
                                            {otherQuestions.map((question) => {
                                                if (
                                                    !evaluateVisibilityCondition(
                                                        question.visibility_condition,
                                                        formValues,
                                                        variableMap
                                                    )
                                                ) {
                                                    return null;
                                                }
                                                return (
                                                    <div
                                                        key={
                                                            question.id ||
                                                            `${
                                                                section.id
                                                            }-${getFieldName(
                                                                question.label
                                                            )}`
                                                        }
                                                        className={clsx(
                                                            question.field_type ===
                                                                "textarea" ||
                                                                question.is_repeatable_question
                                                                ? "col-span-1 md:col-span-2"
                                                                : "col-span-1"
                                                        )}
                                                    >
                                                        {(() => {
                                                            const FieldComponent =
                                                                fieldComponents[
                                                                    question
                                                                        .field_type
                                                                ];
                                                            return FieldComponent ? (
                                                                <FieldComponent
                                                                    question={
                                                                        question
                                                                    }
                                                                    form={form}
                                                                />
                                                            ) : (
                                                                <div className="text-red-500 text-sm">
                                                                    Error:
                                                                    Unknown
                                                                    field type{" "}
                                                                    {
                                                                        question.field_type
                                                                    }
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </Form>
                        </CardContent>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
