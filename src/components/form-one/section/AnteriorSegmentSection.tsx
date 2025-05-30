import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import type { PatientInfoSectionProps } from "@/lib/types";
import type { RootState } from "@/store/store";
import clsx from "clsx";
import { Eye } from "lucide-react";
import { useSelector } from "react-redux";
import { fieldComponents } from "../FormOne";

export default function AnteriorSegmentSection({
    form,
}: PatientInfoSectionProps) {
    const formSchema = useSelector(
        (state: RootState) => state.formSchema.schema
    );

    if (!form || !form.control) {
        console.error(
            "Form prop is undefined or invalid in AnteriorSegmentSection"
        );
        return (
            <div className="text-red-500 text-sm sm:text-base">
                Error: Form is not properly initialized
            </div>
        );
    }

    if (!formSchema || !formSchema.versions || !formSchema.versions[0]) {
        console.log(
            "Form schema is invalid or empty in AnteriorSegmentSection"
        );
        return (
            <div className="text-red-500 text-sm sm:text-base">
                Error: Form schema is not available
            </div>
        );
    }

    const sections = formSchema.versions[0]?.sections || [];

    // Get the Anterior Segment Examination section
    const anteriorSegmentSection = sections.find(
        (section) => section.title === "ANTERIOR SEGMENT EXAMINATION"
    );

    if (!anteriorSegmentSection) {
        console.error(
            "Anterior Segment Examination section not found in schema"
        );
        return (
            <div className="text-red-500 text-sm sm:text-base">
                Error: Anterior Segment Examination section not found
            </div>
        );
    }

    return (
        <div className="space-y-3 sm:space-y-4">
            {sections
                .filter(
                    (section) =>
                        section.title === "ANTERIOR SEGMENT EXAMINATION"
                )
                .map((section, index) => (
                    <Accordion
                        key={index}
                        type="single"
                        defaultValue={`section-${index}`}
                        collapsible
                        className="border rounded-lg overflow-hidden bg-card"
                    >
                        <AccordionItem
                            value={`section-${index}`}
                            className="border-0"
                        >
                            <AccordionTrigger className="px-2 sm:px-4 py-2 sm:py-3 hover:bg-muted/50 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-2 w-full">
                                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                                    <span className="font-medium text-sm sm:text-base">
                                        {section.title}
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <CardContent className="p-2 sm:p-4 pt-1 sm:pt-2">
                                    <Form {...form}>
                                        <div
                                            className={clsx(
                                                "grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2"
                                            )}
                                        >
                                            {anteriorSegmentSection.questions.map(
                                                (question, qIndex) => {
                                                    const FieldComponent =
                                                        fieldComponents[
                                                            question.field_type
                                                        ];
                                                    return FieldComponent ? (
                                                        <div
                                                            key={
                                                                question._id
                                                                    ? `${question._id}-${qIndex}`
                                                                    : `${question.label}-${qIndex}`
                                                            }
                                                            className="col-span-1"
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
                                    </Form>
                                </CardContent>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))}
        </div>
    );
}
