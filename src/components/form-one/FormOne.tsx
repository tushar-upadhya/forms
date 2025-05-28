/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useFormSchema } from "@/hooks/useFormSchema";
import type { FormValues } from "@/lib/types";
import formSchemaJson from "@/mock/mock.json" assert { type: "json" };
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "../form-fields/InputField";
import RadioField from "../form-fields/RadioGroupField";
import SelectField from "../form-fields/SelectField";
import TextareaField from "../form-fields/TextareaField";
import AnteriorSegmentSection from "./section/AnteriorSegmentSection";
import ClinicalHistorySection from "./section/ClinicalHistorySection";
import InvestigationsSection from "./section/InvestigationsSection";
import OtherTreatmentSection from "./section/OtherTreatmentSection";
import PatientInfoSection from "./section/PatientInfoSection";
import PosteriorSegmentSection from "./section/PosteriorSegmentSection";
import ProvisionalDiagnosisSection from "./section/ProvisionalDiagnosisSection";
import PupilAssessmentSection from "./section/PupilAssessmentSection";
import TreatmentPlanSection from "./section/TreatmentPlanSection";
import VisionAssessmentSection from "./section/VisionAssessmentSection";

const getFieldName = (label: string) =>
    label.toLowerCase().replace(/\s+/g, "_");

const generateDefaultValues = (sections: any[]) => {
    const fields: Record<string, string | undefined> = {};
    sections.forEach((section) => {
        section.questions.forEach((question: any) => {
            const fieldName = getFieldName(question.label);
            fields[fieldName] = question.is_required ? "" : undefined;
        });
    });
    return fields;
};

export const fieldComponents: Record<string, React.ComponentType<any>> = {
    input: InputField,
    textarea: TextareaField,
    radio: RadioField,
    select: SelectField,
};

export default function FormOne() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: formSchema, isLoading, error } = useFormSchema();
    const form = useForm<FormValues>({
        defaultValues: {},
    });

    useEffect(() => {
        if (formSchema && formSchema.versions && formSchema.versions[0]) {
            form.reset(generateDefaultValues(formSchema.versions[0].sections));
        } else if (error) {
            console.warn("Using mock.json as fallback due to API error");
            form.reset(
                generateDefaultValues(formSchemaJson.versions[0].sections)
            );
        }
    }, [formSchema, error, form]);

    function onSubmit(data: FormValues) {
        setIsSubmitting(true);
        setTimeout(() => {
            console.log("Form submitted:", data);
            setIsSubmitting(false);
            form.reset();
        }, 1500);
    }

    if (isLoading) {
        return (
            <div className="w-full max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto p-2 sm:p-4 md:p-6 lg:p-8 text-xs sm:text-sm md:text-base">
                Loading form...
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto p-2 sm:p-4 md:p-6 lg:p-8 text-red-500 text-xs sm:text-sm md:text-base">
                Failed to load form schema: {error.message}. Using mock data as
                fallback.
            </div>
        );
    }

    if (!formSchema || !formSchema.versions || !formSchema.versions[0]) {
        return (
            <div className="w-full max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto p-2 sm:p-4 md:p-6 lg:p-8 text-red-500 text-xs sm:text-sm md:text-base">
                Form schema is invalid or empty. Using mock data as fallback.
            </div>
        );
    }

    return (
        <div className="w-full max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto p-2 sm:p-4 md:p-6 lg:p-8">
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-6 md:space-y-8"
            >
                {form ? (
                    <>
                        <PatientInfoSection form={form} />
                        <ClinicalHistorySection form={form} />
                        <VisionAssessmentSection form={form} />
                        <PupilAssessmentSection form={form} />
                        <AnteriorSegmentSection form={form} />
                        <PosteriorSegmentSection form={form} />
                        <InvestigationsSection form={form} />
                        <ProvisionalDiagnosisSection form={form} />
                        <TreatmentPlanSection form={form} />
                        <OtherTreatmentSection form={form} />
                    </>
                ) : (
                    <div className="text-red-500 text-xs sm:text-sm md:text-base">
                        Error: Form not initialized
                    </div>
                )}
                <div className="pt-4 sm:pt-6 flex justify-end">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base transition-all duration-200"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Evaluation"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
