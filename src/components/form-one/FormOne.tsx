/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import formSchemaJson from "@/mock/mock.json" assert { type: "json" };
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

    if (!form || !form.control) {
        console.error("Form control is undefined for field:", fieldName);
        return null;
    }

    switch (question.field_type) {
        case "input":
            return (
                <FormField
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className={
                                    question.is_required
                                        ? "required after:content-['*'] after:text-red-500"
                                        : ""
                                }
                            >
                                {question.label}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={`Enter ${question.label.toLowerCase()}`}
                                    disabled={question.is_disabled}
                                    {...field}
                                    value={field.value ?? ""}
                                    className="w-full"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            );

        case "textarea":
            return (
                <FormField
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className={
                                    question.is_required
                                        ? "required after:content-['*'] after:text-red-500"
                                        : ""
                                }
                            >
                                {question.label}
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder={`Enter ${question.label.toLowerCase()}`}
                                    disabled={question.is_disabled}
                                    {...field}
                                    value={field.value ?? ""}
                                    className="w-full min-h-[100px] resize-y"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            );

        case "radio":
            return (
                <FormField
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel
                                className={
                                    question.is_required
                                        ? "required after:content-['*'] after:text-red-500"
                                        : ""
                                }
                            >
                                {question.label}
                            </FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex flex-wrap gap-4"
                                    disabled={question.is_disabled}
                                >
                                    {question.options.map((option: any) => (
                                        <FormItem
                                            key={option._id}
                                            className="flex items-center space-x-3 space-y-0"
                                        >
                                            <FormControl>
                                                <RadioGroupItem
                                                    value={option.option_value}
                                                    disabled={
                                                        option.is_disabled
                                                    }
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                {option.option_label}
                                            </FormLabel>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            );

        case "select":
            return (
                <FormField
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className={
                                    question.is_required
                                        ? "required after:content-['*'] after:text-red-500"
                                        : ""
                                }
                            >
                                {question.label}
                            </FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={question.is_disabled}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue
                                            placeholder={`Select ${question.label.toLowerCase()}`}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {question.options.map((option: any) => (
                                            <SelectItem
                                                key={option._id}
                                                value={option.option_value}
                                                disabled={option.is_disabled}
                                            >
                                                {option.option_label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
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

    // console.log("FormOne: form object", form);

    function onSubmit(data: FormValues) {
        setIsSubmitting(true);
        setTimeout(() => {
            console.log("Form submitted:", data);
            setIsSubmitting(false);
            form.reset();
        }, 1500);
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <div className="text-red-500">
                        Error: Form not initialized
                    </div>
                )}
                <div className="pt-4 flex justify-end">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="transition-all duration-200"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Evaluation"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
