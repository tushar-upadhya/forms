/* eslint-disable react-refresh/only-export-components */

import { Button } from "@/components/ui/button";
import { useFormSchema } from "@/hooks/useFormSchema";
import { useSubmitForm } from "@/hooks/useSubmitForm";
import type { FormValues, Question, Section } from "@/lib/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CheckboxField from "../form-fields/CheckboxField";
import InputField from "../form-fields/InputField";
import RadioField from "../form-fields/RadioGroupField";
import SelectField from "../form-fields/SelectField";
import TextareaField from "../form-fields/TextareaField";
import Error from "../skeleton/error/Error";
import LoadingSkeleton from "../skeleton/loading/LoadingSkeleton";
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

const FORM_ID = import.meta.env.VITE_FORM_ID;

const getFieldName = (label?: string) =>
    label ? label.toLowerCase().replace(/\s+/g, "_") : "";

const generateDefaultValues = (sections: Section[]) => {
    const fields: Record<string, string | string[] | undefined> = {};
    sections.forEach((section) => {
        section.questions.forEach((question: Question) => {
            const fieldName = getFieldName(question.label);
            if (question.field_type === "checkbox") {
                fields[fieldName] = question.is_required
                    ? question.default_value
                        ? Array.isArray(question.default_value)
                            ? question.default_value
                            : [question.default_value]
                        : []
                    : undefined;
            } else {
                fields[fieldName] = question.is_required
                    ? question.default_value || ""
                    : undefined;
            }
        });
    });
    return fields;
};

const CheckboxFieldWrapper: React.FC<{
    question: Question;
    form: ReturnType<typeof useForm<FormValues>>;
}> = ({ question, form }) => (
    <CheckboxField
        form={form}
        fieldName={getFieldName(question.label)}
        label={question.label}
        options={question.options || []}
        isRequired={question.is_required}
        isDisabled={question.is_disabled}
    />
);

export const fieldComponents: Record<
    string,
    React.ComponentType<{
        question: Question;
        form: ReturnType<typeof useForm<FormValues>>;
    }>
> = {
    input: InputField,
    textarea: TextareaField,
    radio: RadioField,
    select: SelectField,
    checkbox: CheckboxFieldWrapper,
};

export default function FormOne() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: formSchema, isLoading, error } = useFormSchema();
    const form = useForm<FormValues>({
        defaultValues: {},
    });

    const { mutate: submitForm } = useSubmitForm(
        FORM_ID,
        (data) => {
            setIsSubmitting(false);
            form.reset();
            console.log("Form submitted successfully:", data);
        },
        (error) => {
            setIsSubmitting(false);
            console.error("Submission error:", error.message);
        }
    );

    useEffect(() => {
        if (
            formSchema &&
            formSchema.versions &&
            formSchema.versions[0]?.sections
        ) {
            form.reset(generateDefaultValues(formSchema.versions[0].sections));
        }
    }, [formSchema, form]);

    function onSubmit(data: FormValues) {
        // Transform data to ensure field names are used as keys
        const transformedData: FormValues = {};
        Object.entries(data).forEach(([key, value]) => {
            // Ensure only non-empty values are included
            if (
                value !== undefined &&
                (Array.isArray(value) ? value.length > 0 : value !== "")
            ) {
                transformedData[key] = value;
            }
        });
        console.log("Submitting transformed data:", transformedData);
        setIsSubmitting(true);
        submitForm(transformedData);
    }

    if (isLoading) return <LoadingSkeleton />;

    if (
        error ||
        !formSchema ||
        !formSchema.versions ||
        !formSchema.versions[0]?.sections
    ) {
        return <Error message={error?.message || "Invalid schema"} />;
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
