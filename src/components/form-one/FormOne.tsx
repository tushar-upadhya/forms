/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import formSchemaJson from "@/mock/mock.json" assert { type: "json" };
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import InputField from "../form-fields/InputField";
import RadioGroupField from "../form-fields/RadioGroupField";
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

const generateDefaultValues = () => {
    const fields: Record<string, string | undefined> = {};
    formSchemaJson.versions[0].sections.forEach((section) => {
        section.questions.forEach((question: any) => {
            const fieldName = getFieldName(question.label);
            fields[fieldName] = question.is_required ? "" : undefined;
        });
    });
    return fields;
};

type FormValues = Record<string, string | undefined>;

export interface PatientInfoSectionProps {
    form: UseFormReturn<FormValues>;
}

export const renderField = (question: any, form: UseFormReturn<FormValues>) => {
    const fieldName = getFieldName(question.label);

    switch (question.field_type) {
        case "input":
            return (
                <InputField
                    form={form}
                    fieldName={fieldName}
                    label={question.label}
                    isRequired={question.is_required}
                    isDisabled={question.is_disabled}
                />
            );
        case "textarea":
            return (
                <TextareaField
                    form={form}
                    fieldName={fieldName}
                    label={question.label}
                    isRequired={question.is_required}
                    isDisabled={question.is_disabled}
                />
            );
        case "radio":
            return (
                <RadioGroupField
                    form={form}
                    fieldName={fieldName}
                    label={question.label}
                    options={question.options}
                    isRequired={question.is_required}
                    isDisabled={question.is_disabled}
                />
            );
        case "select":
            return (
                <SelectField
                    form={form}
                    fieldName={fieldName}
                    label={question.label}
                    options={question.options}
                    isRequired={question.is_required}
                    isDisabled={question.is_disabled}
                />
            );
        default:
            return null;
    }
};

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
        <div className="w-full max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto p-2 sm:p-4 md:p-6">
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-6"
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
                    <div className="text-red-500 text-sm sm:text-base">
                        Error: Form not initialized
                    </div>
                )}
                <div className="pt-4 flex justify-end">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto transition-all duration-200 text-sm sm:text-base"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Evaluation"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
