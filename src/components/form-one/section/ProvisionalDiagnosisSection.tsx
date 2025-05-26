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
import { ClipboardCheck } from "lucide-react";
import { renderField, type PatientInfoSectionProps } from "../FormOne";

export default function ProvisionalDiagnosisSection({
    form,
}: PatientInfoSectionProps) {
    if (!form || !form.control) {
        console.error(
            "Form prop is undefined or invalid in ProvisionalDiagnosisSection"
        );
        return (
            <div className="text-red-500">
                Error: Form is not properly initialized
            </div>
        );
    }

    const sections = formSchemaJson.versions[0]?.sections || [];

    const provisionalDiagnosisSection = sections.find(
        (section) => section.title === "PROVISIONAL DIAGNOSIS"
    );

    if (!provisionalDiagnosisSection) {
        console.error("Provisional Diagnosis section not found in schema");
        return (
            <div className="text-red-500">
                Error: Provisional Diagnosis section not found
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sections
                .filter((section) => section.title === "PROVISIONAL DIAGNOSIS")
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
                            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-2 w-full">
                                    <ClipboardCheck className="h-5 w-5 text-primary" />
                                    <span className="font-medium truncate w-[10rem] sm:w-auto text-left">
                                        {section.title}
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <CardContent className="p-4 pt-2">
                                    <Form {...form}>
                                        <div
                                            className={clsx(
                                                "grid gap-6",
                                                section.ui === "flex"
                                                    ? "grid-cols-1 sm:grid-cols-2"
                                                    : section.ui ===
                                                      "grid-cols-2"
                                                    ? "grid-cols-1 md:grid-cols-2"
                                                    : "grid-cols-1"
                                            )}
                                        >
                                            {provisionalDiagnosisSection.questions.map(
                                                (question) => (
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
