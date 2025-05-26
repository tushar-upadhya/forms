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
import { ClipboardListIcon } from "lucide-react";
import { renderField, type PatientInfoSectionProps } from "../FormOne";

export default function InvestigationsSection({
    form,
}: PatientInfoSectionProps) {
    if (!form || !form.control) {
        console.error(
            "Form prop is undefined or invalid in InvestigationsSection"
        );
        return (
            <div className="text-red-500">
                Error: Form is not properly initialized
            </div>
        );
    }

    const sections = formSchemaJson.versions[0]?.sections || [];

    // Get the Investigations section
    const investigationsSection = sections.find(
        (section) =>
            section.title === "INVESTIGATIONS (GIVE OPTION TO SELECT WHICH EYE)"
    );

    if (!investigationsSection) {
        console.error("Investigations section not found in schema");
        return (
            <div className="text-red-500">
                Error: Investigations section not found
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sections
                .filter(
                    (section) =>
                        section.title ===
                        "INVESTIGATIONS (GIVE OPTION TO SELECT WHICH EYE)"
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
                                        <ClipboardListIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                        <span className="font-medium text-sm sm:text-base">
                                            {section.title}
                                        </span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <CardContent className="p-4 pt-2">
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
                                            {investigationsSection.questions.map(
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
