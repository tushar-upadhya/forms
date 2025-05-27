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
import { Zap } from "lucide-react";
import { renderField, type PatientInfoSectionProps } from "../FormOne";

export default function OtherTreatmentSection({
    form,
}: PatientInfoSectionProps) {
    if (!form || !form.control) {
        console.error(
            "Form prop is undefined or invalid in OtherTreatmentSection"
        );
        return (
            <div className="text-red-500 text-sm sm:text-base">
                Error: Form is not properly initialized
            </div>
        );
    }

    const sections = formSchemaJson.versions[0]?.sections || [];

    // Get the Other Treatment section
    const otherTreatmentSection = sections.find(
        (section) => section.title === "OTHER TREATMENT"
    );

    if (!otherTreatmentSection) {
        console.error("Other Treatment section not found in schema");
        return (
            <div className="text-red-500 text-sm sm:text-base">
                Error: Other Treatment section not found
            </div>
        );
    }

    return (
        <div className="space-y-3 sm:space-y-4">
            {sections
                .filter((section) => section.title === "OTHER TREATMENT")
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
                                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0" />
                                    <span className="font-medium text-sm sm:text-base">
                                        {section.title}
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <CardContent className="p-2 sm:p-4 pt-1 sm:pt-2">
                                    <Form {...form}>
                                        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                                            {otherTreatmentSection.questions.map(
                                                (question) => (
                                                    <div
                                                        key={
                                                            question._id ||
                                                            question.label
                                                        }
                                                        className="col-span-1"
                                                    >
                                                        {question.field_type ===
                                                            "checkbox" &&
                                                        question.options
                                                            .length > 10 ? (
                                                            <ScrollArea className="h-[200px] sm:h-[250px] w-full">
                                                                {renderField(
                                                                    question,
                                                                    form
                                                                )}
                                                            </ScrollArea>
                                                        ) : (
                                                            renderField(
                                                                question,
                                                                form
                                                            )
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
