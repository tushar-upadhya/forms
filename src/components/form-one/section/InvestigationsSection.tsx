import { renderField } from "@/components/renderField";
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
import type { PatientInfoSectionProps } from "../FormOne";

export default function InvestigationsSection({
    form,
}: PatientInfoSectionProps) {
    if (!form || !form.control) {
        console.error(
            "Form prop is undefined or invalid in InvestigationsSection"
        );
        return (
            <div className="text-red-500 text-sm sm:text-base">
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
            <div className="text-red-500 text-sm sm:text-base">
                Error: Investigations section not found
            </div>
        );
    }

    return (
        <div className="space-y-3 sm:space-y-4">
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
                            <AccordionTrigger className="px-2 sm:px-4 py-2 sm:py-3 hover:bg-muted/50 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-2 w-full">
                                    <ClipboardListIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
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
                                            {investigationsSection.questions.map(
                                                (question) => (
                                                    <div
                                                        key={
                                                            question._id ||
                                                            question.label
                                                        }
                                                        className="col-span-1"
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
