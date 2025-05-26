/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import formSchemaJson from "@/mock/mock.json" assert { type: "json" };
import clsx from "clsx";
import { EyeIcon } from "lucide-react";
import { renderField, type PatientInfoSectionProps } from "../FormOne";

export default function PupilAssessmentSection({
    form,
}: PatientInfoSectionProps) {
    if (!form || !form.control) {
        console.error(
            "Form prop is undefined or invalid in PupilAssessmentSection"
        );
        return (
            <div className="text-red-500">
                Error: Form is not properly initialized
            </div>
        );
    }

    const sections = formSchemaJson.versions[0]?.sections || [];

    // Get the Pupil section
    const pupilSection = sections.find((section) => section.title === "Pupil");

    if (!pupilSection) {
        console.error("Pupil section not found in schema");
        return (
            <div className="text-red-500">Error: Pupil section not found</div>
        );
    }

    // Group questions by eye for rendering
    const rightEyeQuestions = pupilSection.questions.filter((q: any) =>
        q.label.toLowerCase().includes("right eye")
    );
    const leftEyeQuestions = pupilSection.questions.filter((q: any) =>
        q.label.toLowerCase().includes("left eye")
    );

    return (
        <Accordion
            type="single"
            defaultValue="pupil-assessment"
            collapsible
            className="border rounded-lg overflow-hidden bg-card"
        >
            <AccordionItem value="pupil-assessment" className="border-0">
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-2">
                        <EyeIcon className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                            {pupilSection.title}
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <CardContent className="p-4 pt-2">
                        <Form {...form}>
                            <div
                                className={`grid gap-4 ${
                                    pupilSection.ui === "grid-cols-2"
                                        ? "grid-cols-1 sm:grid-cols-2"
                                        : "grid-cols-1"
                                }`}
                            >
                                {/* Right Eye Column */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                        Right Eye
                                    </h4>
                                    {rightEyeQuestions.map((question: any) => (
                                        <div
                                            key={question._id || question.label}
                                            className={clsx(
                                                question.field_type ===
                                                    "textarea"
                                                    ? "col-span-1 sm:col-span-2"
                                                    : "col-span-1"
                                            )}
                                        >
                                            {renderField(question, form)}
                                        </div>
                                    ))}
                                </div>
                                {/* Left Eye Column */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                        Left Eye
                                    </h4>
                                    {leftEyeQuestions.map((question: any) => (
                                        <div
                                            key={question._id || question.label}
                                            className={clsx(
                                                question.field_type ===
                                                    "textarea"
                                                    ? "col-span-1 sm:col-span-2"
                                                    : "col-span-1"
                                            )}
                                        >
                                            {renderField(question, form)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Form>
                    </CardContent>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
