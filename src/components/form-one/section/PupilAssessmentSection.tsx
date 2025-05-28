import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import type { PatientInfoSectionProps, Question } from "@/lib/types";
import type { RootState } from "@/store/store";
import clsx from "clsx";
import { EyeIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { fieldComponents } from "../FormOne";

export default function PupilAssessmentSection({
    form,
}: PatientInfoSectionProps) {
    const formSchema = useSelector(
        (state: RootState) => state.formSchema.schema
    );

    if (!form || !form.control) {
        console.error(
            "Form prop is undefined or invalid in PupilAssessmentSection"
        );
        return (
            <div className="text-red-500 text-sm sm:text-base">
                Error: Form is not properly initialized
            </div>
        );
    }

    if (!formSchema || !formSchema.versions || !formSchema.versions[0]) {
        console.log(
            "Form schema is invalid or empty in PupilAssessmentSection"
        );
        return (
            <div className="text-red-500 text-sm sm:text-base">
                Error: Form schema is not available
            </div>
        );
    }

    const sections = formSchema.versions[0]?.sections || [];

    // Get the Pupil section
    const pupilSection = sections.find((section) => section.title === "Pupil");

    if (!pupilSection) {
        console.error("Pupil section not found in schema");
        return (
            <div className="text-red-500 text-sm sm:text-base">
                Error: Pupil section not found
            </div>
        );
    }

    // Group questions by eye for rendering
    const rightEyeQuestions = pupilSection.questions.filter((q) =>
        q.label.toLowerCase().includes("right eye")
    );
    const leftEyeQuestions = pupilSection.questions.filter((q) =>
        q.label.toLowerCase().includes("left eye")
    );

    return (
        <div className="space-y-3 sm:space-y-4">
            <Accordion
                type="single"
                defaultValue="pupil-assessment"
                collapsible
                className="border rounded-lg overflow-hidden bg-card"
            >
                <AccordionItem value="pupil-assessment" className="border-0">
                    <AccordionTrigger className="px-2 sm:px-4 py-2 sm:py-3 hover:bg-muted/50 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-2">
                            <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            <span className="font-medium text-sm sm:text-base">
                                {pupilSection.title}
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <CardContent className="p-2 sm:p-4 pt-1 sm:pt-2">
                            <Form {...form}>
                                <div
                                    className={`grid gap-4 sm:gap-6 ${
                                        pupilSection.ui === "grid-cols-2"
                                            ? "grid-cols-1 sm:grid-cols-2"
                                            : "grid-cols-1"
                                    }`}
                                >
                                    {/* Right Eye Column */}
                                    <div className="space-y-3 sm:space-y-4">
                                        <h4 className="text-sm sm:text-base font-medium text-muted-foreground">
                                            Right Eye
                                        </h4>
                                        {rightEyeQuestions.map(
                                            (question: Question) => {
                                                const FieldComponent =
                                                    fieldComponents[
                                                        question.field_type
                                                    ];
                                                return FieldComponent ? (
                                                    <div
                                                        key={
                                                            question._id ||
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
                                                            question={question}
                                                            form={form}
                                                        />
                                                    </div>
                                                ) : null;
                                            }
                                        )}
                                    </div>
                                    {/* Left Eye Column */}
                                    <div className="space-y-3 sm:space-y-4">
                                        <h4 className="text-sm sm:text-base font-medium text-muted-foreground">
                                            Left Eye
                                        </h4>
                                        {leftEyeQuestions.map(
                                            (question: Question) => {
                                                const FieldComponent =
                                                    fieldComponents[
                                                        question.field_type
                                                    ];
                                                return FieldComponent ? (
                                                    <div
                                                        key={
                                                            question._id ||
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
                                                            question={question}
                                                            form={form}
                                                        />
                                                    </div>
                                                ) : null;
                                            }
                                        )}
                                    </div>
                                </div>
                            </Form>
                        </CardContent>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
