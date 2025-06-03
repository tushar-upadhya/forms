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
import { ClipboardListIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { fieldComponents } from "../FormOne";

export default function PosteriorSegmentSection({
    form,
}: PatientInfoSectionProps) {
    const formSchema = useSelector(
        (state: RootState) => state.formSchema.schema
    );

    if (!form || !form.control) {
        console.error(
            "Form prop is undefined or invalid in PosteriorSegmentSection"
        );
        return (
            <div className="text-red-500 text-sm sm:text-base">
                Error: Form is not properly initialized
            </div>
        );
    }

    if (!formSchema || !formSchema.versions || !formSchema.versions[0]) {
        console.log(
            "Form schema is invalid or empty in PosteriorSegmentSection"
        );
        return (
            <div className="text-red-500 text-sm sm:text-base">
                Error: Form schema is not available
            </div>
        );
    }

    const sections = formSchema.versions[0]?.sections || [];

    const posteriorSegmentSection = sections.find(
        (section) => section.title === "POSTERIOR SEGMENT EVALUATION"
    );

    if (!posteriorSegmentSection) {
        console.error(
            "Posterior Segment Evaluation section not found in schema"
        );
        return (
            <div className="text-red-500 text-sm sm:text-base">
                Error: Posterior Segment Evaluation section not found
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {sections
                .filter(
                    (section) =>
                        section.title === "POSTERIOR SEGMENT EVALUATION"
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
                            <AccordionTrigger className="px-3 py-2 sm:px-4 sm:py-3 hover:bg-muted/50 transition-colors group cursor-pointer">
                                <div className="flex items-center justify-between w-full gap-2">
                                    <div className="flex items-center gap-2">
                                        <ClipboardListIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                                        <span className="font-medium text-sm sm:text-base">
                                            {section.title}
                                        </span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <CardContent className="p-3 sm:p-4 lg:p-6 pt-2 sm:pt-3">
                                    <Form {...form}>
                                        <div
                                            className={clsx(
                                                "grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2"
                                            )}
                                        >
                                            {posteriorSegmentSection.questions.map(
                                                (question: Question) => {
                                                    const FieldComponent =
                                                        fieldComponents[
                                                            question.field_type
                                                        ];
                                                    return FieldComponent ? (
                                                        <div
                                                            key={
                                                                question.id ||
                                                                question.label
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
