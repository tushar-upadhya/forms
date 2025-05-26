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
import { Eye } from "lucide-react";
import { renderField, type PatientInfoSectionProps } from "../FormOne";

export default function AnteriorSegmentSection({
    form,
}: PatientInfoSectionProps) {
    if (!form || !form.control) {
        console.error(
            "Form prop is undefined or invalid in AnteriorSegmentSection"
        );
        return (
            <div className="text-red-500">
                Error: Form is not properly initialized
            </div>
        );
    }

    const sections = formSchemaJson.versions[0]?.sections || [];

    // Get the Anterior Segment Examination section
    const anteriorSegmentSection = sections.find(
        (section) => section.title === "ANTERIOR SEGMENT EXAMINATION"
    );

    if (!anteriorSegmentSection) {
        console.error(
            "Anterior Segment Examination section not found in schema"
        );
        return (
            <div className="text-red-500">
                Error: Anterior Segment Examination section not found
            </div>
        );
    }

    return (
        <div className="space-y-4">
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
                            <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium">
                                        {section.title}
                                    </span>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs text-muted-foreground mr-4">
                                        Examination findings for anterior
                                        segment of both eyes
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <CardContent className="p-6">
                                    <Form {...form}>
                                        <div
                                            className={clsx(
                                                "grid gap-6",
                                                section.ui === "grid-cols-2"
                                                    ? "grid-cols-1 md:grid-cols-2"
                                                    : section.ui === "flex"
                                                    ? "grid-cols-1 sm:grid-cols-2"
                                                    : "grid-cols-1"
                                            )}
                                        >
                                            {anteriorSegmentSection.questions.map(
                                                (question) => (
                                                    <div
                                                        key={
                                                            question._id ||
                                                            question.label
                                                        }
                                                        className={clsx(
                                                            question.field_type ===
                                                                "textarea"
                                                                ? "col-span-1 md:col-span-2"
                                                                : "col-span-1"
                                                        )}
                                                    >
                                                        {renderField(
                                                            question,
                                                            form
                                                        )}
                                                    </div>
                                                )
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
