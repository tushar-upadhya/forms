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
import { formSchemaJson } from "@/lib/schemas";
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import PatientInfoSection from "./section/PatientInfoSection";

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
        console.error(fieldName);
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
                                    question.is_required ? "required" : ""
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
                                    question.is_required ? "required" : ""
                                }
                            >
                                {question.label}
                            </FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex space-y-1"
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
        <div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {form ? (
                    <PatientInfoSection form={form} />
                ) : (
                    <div>Error: Form not initialized</div>
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
