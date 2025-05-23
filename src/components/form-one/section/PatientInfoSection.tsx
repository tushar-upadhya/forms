/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import QuestionWrapper from "@/lib/QuestionWrapper";
import formSchemaJson from "@/mock/mock.json" assert { type: "json" };
import { ClipboardListIcon } from "lucide-react";
import type { PatientInfoSectionProps } from "../FormOne";

export default function PatientInfoSection({ form }: PatientInfoSectionProps) {
    if (!form || !form.control) {
        console.error(
            "Form prop is undefined or invalid in PatientInfoSection"
        );
        return (
            <div className="text-red-500">
                Error: Form is not properly initialized
            </div>
        );
    }

    const sections = formSchemaJson.versions[0]?.sections || [];

    // Get the Basic Information section
    const basicInfoSection = sections.find(
        (section) => section.title === "Basic Information"
    );

    const fieldNames =
        basicInfoSection?.questions.map((question: any) =>
            question.label.toLowerCase().replace(/\s+/g, "_")
        ) || [];

    // console.log("PatientInfoSection: fieldNames", fieldNames);
    // console.log("PatientInfoSection: fieldValues", form.watch());

    return (
        <div className="space-y-4">
            {sections
                .filter((section) => section.title === "Basic Information")
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
                                <div className="flex items-center gap-2">
                                    <ClipboardListIcon className="h-5 w-5 text-primary" />
                                    <span className="font-medium">
                                        {section.title}
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <CardContent className="p-4 pt-2">
                                    <Form {...form}>
                                        <div
                                            className={`grid gap-6 ${
                                                section.ui === "flex"
                                                    ? "grid-cols-1 sm:grid-cols-2"
                                                    : "grid-cols-1"
                                            }`}
                                        >
                                            {section.questions.map(
                                                (
                                                    question: any,
                                                    qIndex: number
                                                ) => (
                                                    <QuestionWrapper
                                                        key={
                                                            question._id ||
                                                            question.label
                                                        }
                                                        question={question}
                                                        form={form}
                                                        qIndex={qIndex}
                                                        fieldNames={fieldNames}
                                                    />
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
