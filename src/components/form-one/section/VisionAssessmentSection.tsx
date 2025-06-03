import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PatientInfoSectionProps, Question } from "@/lib/types";
import type { RootState } from "@/store/store";
import clsx from "clsx";
import { EyeIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { fieldComponents } from "../FormOne";

export default function VisionAssessmentSection({
    form,
}: PatientInfoSectionProps) {
    const formSchema = useSelector(
        (state: RootState) => state.formSchema.schema
    );

    if (!form || !form.control) {
        console.error(
            "Form prop is undefined or invalid in VisionAssessmentSection"
        );
        return (
            <div className="text-red-500 text-sm sm:text-base">
                Error: Form is not properly initialized
            </div>
        );
    }

    if (!formSchema || !formSchema.versions || !formSchema.versions[0]) {
        console.error(
            "Form schema is invalid or empty in VisionAssessmentSection"
        );
        return (
            <div className="text-red-500 text-sm sm:text-base">
                Error: Form schema is not available
            </div>
        );
    }

    const sections = formSchema.versions[0]?.sections || [];
    const visionSection = sections.find(
        (section) => section.title.toLowerCase() === "vision assessment"
    );

    if (!visionSection) {
        console.error("Vision Assessment section not found in schema");
        return (
            <div className="text-red-500 text-sm sm:text-base">
                Error: Vision Assessment section not found
            </div>
        );
    }

    const rightEyeQuestions = visionSection.questions.filter(
        (q) => q.label && q.label.includes("Right Eye")
    );
    const leftEyeQuestions = visionSection.questions.filter(
        (q) => q.label && q.label.includes("Left Eye")
    );

    const gridClass =
        visionSection.ui === "grid-cols-2" || visionSection.ui === "flex"
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1";

    return (
        <div className="space-y-3 sm:space-y-4">
            <Accordion
                type="single"
                defaultValue="vision-assessment"
                collapsible
                className="border rounded-lg overflow-hidden bg-card"
            >
                <AccordionItem value="vision-assessment" className="border-0">
                    <AccordionTrigger className="px-2 sm:px-4 py-2 sm:py-3 hover:bg-muted/50 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-2">
                            <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            <span className="font-medium text-sm sm:text-base">
                                {visionSection.title}
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <CardContent className="p-2 sm:p-4 pt-1 sm:pt-2">
                            <Form {...form}>
                                <div className="w-full">
                                    <ScrollArea className="w-full">
                                        <div
                                            className={`grid ${gridClass} gap-4 sm:gap-6`}
                                        >
                                            <div className="space-y-3 sm:space-y-4">
                                                <h3 className="font-medium text-sm sm:text-base text-muted-foreground">
                                                    Right Eye
                                                </h3>
                                                {rightEyeQuestions.map(
                                                    (question: Question) => {
                                                        const FieldComponent =
                                                            fieldComponents[
                                                                question
                                                                    .field_type
                                                            ];
                                                        return FieldComponent ? (
                                                            <div
                                                                key={
                                                                    question.id ||
                                                                    question.label
                                                                }
                                                                className={clsx(
                                                                    question.field_type ===
                                                                        "textarea"
                                                                        ? "col-span-1 sm:col-span-2"
                                                                        : "col-span-1"
                                                                )}
                                                            >
                                                                <FieldComponent
                                                                    question={
                                                                        question
                                                                    }
                                                                    form={form}
                                                                />
                                                            </div>
                                                        ) : null;
                                                    }
                                                )}
                                            </div>
                                            <div className="space-y-3 sm:space-y-4">
                                                <h3 className="font-medium text-sm sm:text-base text-muted-foreground">
                                                    Left Eye
                                                </h3>
                                                {leftEyeQuestions.map(
                                                    (question: Question) => {
                                                        const FieldComponent =
                                                            fieldComponents[
                                                                question
                                                                    .field_type
                                                            ];
                                                        return FieldComponent ? (
                                                            <div
                                                                key={
                                                                    question.id ||
                                                                    question.label
                                                                }
                                                                className={clsx(
                                                                    question.field_type ===
                                                                        "textarea"
                                                                        ? "col-span-1 sm:col-span-2"
                                                                        : "col-span-1"
                                                                )}
                                                            >
                                                                <FieldComponent
                                                                    question={
                                                                        question
                                                                    }
                                                                    form={form}
                                                                />
                                                            </div>
                                                        ) : null;
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </div>
                            </Form>
                        </CardContent>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
