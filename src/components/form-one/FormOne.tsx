/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import formSchemaJson from "@/mock/mock.json";
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
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

export const getFieldName = (label: string) =>
    label.toLowerCase().replace(/\s+/g, "_");

const generateDefaultValues = () => {
    const fields: Record<string, string | string[] | undefined> = {};
    formSchemaJson.versions[0].sections.forEach((section) => {
        section.questions.forEach((question: any) => {
            const fieldName = getFieldName(question.label);
            fields[fieldName] =
                question.field_type === "checkbox"
                    ? question.is_required
                        ? []
                        : undefined
                    : question.is_required
                    ? ""
                    : undefined;
        });
    });
    return fields;
};

export type FormValues = Record<string, string | string[] | undefined>;

export interface PatientInfoSectionProps {
    form: UseFormReturn<FormValues>;
}

export default function FormOne() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const defaultValues = generateDefaultValues();
    const form = useForm<FormValues>({
        defaultValues,
    });

    function onSubmit(data: FormValues) {
        setIsSubmitting(true);
        setTimeout(() => {
            console.log("Form submitted:", data);
            setIsSubmitting(false);
            form.reset();
        }, 1500);
    }

    return (
        <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl 2xl:max-w-5xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8"
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
                    <div className="text-red-500 text-xs xs:text-sm sm:text-base">
                        Error: Form not initialized
                    </div>
                )}
                <div className="pt-4 xs:pt-5 sm:pt-6 flex justify-end sticky bottom-0 bg-background py-3 xs:py-4 sm:py-5 shadow-md z-10">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto min-w-[120px] xs:min-w-[140px] h-11 xs:h-12 sm:h-14 px-4 xs:px-5 sm:px-6 text-base xs:text-lg transition-all duration-200"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Evaluation"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
