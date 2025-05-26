/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import formSchemaJson from "@/mock/mock.json" assert { type: "json" };
import { EyeIcon } from "lucide-react";
import { renderField, type PatientInfoSectionProps } from "../FormOne";

export default function VisionAssessmentSection({
    form,
}: PatientInfoSectionProps) {
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

    const sections = formSchemaJson.versions[0]?.sections || [];
    const visionSection = sections.find(
        (section: any) => section.title === "Vision Assessment"
    );

    if (!visionSection) {
        console.error("Vision Assessment section not found in schema");
        return (
            <div className="text-red-500 text-sm sm:text-base">
                Error: Vision Assessment section not found
            </div>
        );
    }

    const rightEyeQuestions = visionSection.questions.filter((q: any) =>
        q.label.includes("Right Eye")
    );
    const leftEyeQuestions = visionSection.questions.filter((q: any) =>
        q.label.includes("Left Eye")
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
                                    <ScrollArea className="w-full sm:whitespace-nowrap">
                                        <div
                                            className={`grid ${gridClass} gap-4 sm:gap-6`}
                                        >
                                            <div className="space-y-3 sm:space-y-4">
                                                <h3 className="font-medium text-sm sm:text-base text-muted-foreground">
                                                    Right Eye
                                                </h3>
                                                {rightEyeQuestions.map(
                                                    (question: any) => (
                                                        <div
                                                            key={
                                                                question._id ||
                                                                question.label
                                                            }
                                                            className={
                                                                question.field_type ===
                                                                "textarea"
                                                                    ? "col-span-1 sm:col-span-2"
                                                                    : "col-span-1"
                                                            }
                                                        >
                                                            {renderField(
                                                                question,
                                                                form
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            <div className="space-y-3 sm:space-y-4">
                                                <h3 className="font-medium text-sm sm:text-base text-muted-foreground">
                                                    Left Eye
                                                </h3>
                                                {leftEyeQuestions.map(
                                                    (question: any) => (
                                                        <div
                                                            key={
                                                                question._id ||
                                                                question.label
                                                            }
                                                            className={
                                                                question.field_type ===
                                                                "textarea"
                                                                    ? "col-span-1 sm:col-span-2"
                                                                    : "col-span-1"
                                                            }
                                                        >
                                                            {renderField(
                                                                question,
                                                                form
                                                            )}
                                                        </div>
                                                    )
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
