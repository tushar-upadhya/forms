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
import clsx from "clsx";
import { useEffect, useState } from "react";
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

const generateDefaultValues = (sections: any[]) => {
    const fields: Record<string, string | string[] | undefined> = {};
    sections.forEach((section) => {
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

type FormValues = Record<string, string | string[] | undefined>;

export interface PatientInfoSectionProps {
    form: UseFormReturn<FormValues>;
    formSchema?: any;
}

export const renderField = (question: any, form: UseFormReturn<FormValues>) => {
    const fieldName = getFieldName(question.label);
    const truncatePlaceholder = (text: string, maxLength: number = 30) =>
        text.length > maxLength
            ? `${text.substring(0, maxLength - 3)}...`
            : text;

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
                                        ? "required after:content-['*'] after:text-red-500 text-sm sm:text-base"
                                        : "text-sm sm:text-base"
                                }
                            >
                                {question.label}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={truncatePlaceholder(
                                        `Enter ${question.label.toLowerCase()}`
                                    )}
                                    disabled={question.is_disabled}
                                    {...field}
                                    value={field.value ?? ""}
                                    className="w-full text-sm sm:text-base h-9 sm:h-10"
                                />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
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
                                        ? "required after:content-['*'] after:text-red-500 text-sm sm:text-base"
                                        : "text-sm sm:text-base"
                                }
                            >
                                {question.label}
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder={truncatePlaceholder(
                                        `Enter ${question.label.toLowerCase()}`
                                    )}
                                    disabled={question.is_disabled}
                                    {...field}
                                    value={field.value ?? ""}
                                    className="w-full min-h-[80px] sm:min-h-[100px] resize-y text-sm sm:text-base"
                                />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
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
                        <FormItem className="space-y-2 sm:space-y-3">
                            <FormLabel
                                className={
                                    question.is_required
                                        ? "required after:content-['*'] after:text-red-500 text-sm sm:text-base"
                                        : "text-sm sm:text-base"
                                }
                            >
                                {question.label}
                            </FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4"
                                    disabled={question.is_disabled}
                                >
                                    {question.options.map((option: any) => (
                                        <FormItem
                                            key={option._id}
                                            className="flex items-center space-x-2 sm:space-x-3 space-y-0"
                                        >
                                            <FormControl>
                                                <RadioGroupItem
                                                    value={option.option_value}
                                                    disabled={
                                                        option.is_disabled
                                                    }
                                                    className="h-4 w-4 sm:h-5 sm:w-5"
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer text-sm sm:text-base">
                                                {option.option_label}
                                            </FormLabel>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
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
                                        ? "required after:content-['*'] after:text-red-500 text-sm sm:text-base"
                                        : "text-sm sm:text-base"
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
                                    <SelectTrigger className="w-full h-9 sm:h-10 text-sm sm:text-base truncate">
                                        <SelectValue
                                            placeholder={truncatePlaceholder(
                                                `Select ${question.label.toLowerCase()}`
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent className="max-w-full">
                                        {question.options.map((option: any) => (
                                            <SelectItem
                                                key={option._id}
                                                value={option.option_value}
                                                disabled={option.is_disabled}
                                                className="text-sm sm:text-base py-2 sm:py-2.5 max-w-full truncate"
                                            >
                                                {option.option_label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                    )}
                />
            );

        case "checkbox":
            return (
                <FormField
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                        <FormItem className="space-y-2 sm:space-y-3">
                            <FormLabel
                                className={
                                    question.is_required
                                        ? "required after:content-['*'] after:text-red-500 text-sm sm:text-base"
                                        : "text-sm sm:text-base"
                                }
                            >
                                {question.label}
                            </FormLabel>
                            <FormControl>
                                <div
                                    className={clsx(
                                        "grid gap-2 sm:gap-3",
                                        question.options.length > 10
                                            ? "grid-cols-1 sm:grid-cols-2"
                                            : "grid-cols-1"
                                    )}
                                >
                                    {question.options.map((option: any) => (
                                        <label
                                            key={option._id}
                                            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                value={option.option_value}
                                                checked={field.value?.includes(
                                                    option.option_value
                                                )}
                                                onChange={(e) => {
                                                    const updatedValue = e
                                                        .target.checked
                                                        ? [
                                                              ...(field.value ||
                                                                  []),
                                                              option.option_value,
                                                          ]
                                                        : (
                                                              field.value || []
                                                          ).filter(
                                                              (v: string) =>
                                                                  v !==
                                                                  option.option_value
                                                          );
                                                    field.onChange(
                                                        updatedValue
                                                    );
                                                }}
                                                disabled={
                                                    option.is_disabled ||
                                                    question.is_disabled
                                                }
                                                className="h-4 w-4 sm:h-5 sm:w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm sm:text-base">
                                                {option.option_label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
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
    const [formSchema, setFormSchema] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const defaultValues = formSchema
        ? generateDefaultValues(formSchema.versions[0].sections)
        : {};
    const form = useForm<FormValues>({
        defaultValues,
    });

    useEffect(() => {
        const fetchFormSchema = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    "https://rpcapplication.aiims.edu/form/api/v1/form/dc8e18b4-b0ad-4b76-a4c5-cd340f84d494",
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error(
                            "Unauthorized: Invalid or missing authentication credentials"
                        );
                    }
                    throw new Error(
                        `Failed to fetch form schema: ${response.statusText}`
                    );
                }
                const data = await response.json();
                setFormSchema(data);
            } catch (err: any) {
                setError(err.message || "Error fetching form schema");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFormSchema();
    }, []);

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
            <div className="w-full max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto p-2 sm:p-4 md:p-6 text-center">
                <p className="text-sm sm:text-base text-gray-500">
                    Loading form schema...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto p-2 sm:p-4 md:p-6 text-center">
                <p className="text-red-500 text-sm sm:text-base">{error}</p>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 text-sm sm:text-base"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto p-2 sm:p-4 md:p-6">
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-6"
            >
                {form && formSchema ? (
                    <>
                        <PatientInfoSection
                            form={form}
                            formSchema={formSchema}
                        />
                        <ClinicalHistorySection
                            form={form}
                            formSchema={formSchema}
                        />
                        <VisionAssessmentSection
                            form={form}
                            formSchema={formSchema}
                        />
                        <PupilAssessmentSection
                            form={form}
                            formSchema={formSchema}
                        />
                        <AnteriorSegmentSection
                            form={form}
                            formSchema={formSchema}
                        />
                        <PosteriorSegmentSection
                            form={form}
                            formSchema={formSchema}
                        />
                        <InvestigationsSection
                            form={form}
                            formSchema={formSchema}
                        />
                        <ProvisionalDiagnosisSection
                            form={form}
                            formSchema={formSchema}
                        />
                        <TreatmentPlanSection
                            form={form}
                            formSchema={formSchema}
                        />
                        <OtherTreatmentSection
                            form={form}
                            formSchema={formSchema}
                        />
                    </>
                ) : (
                    <div className="text-red-500 text-sm sm:text-base">
                        Error: Form not initialized
                    </div>
                )}
                <div className="pt-4 flex justify-end sticky bottom-0 bg-background py-2 sm:py-4 z-10">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto transition-all duration-200 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6 rounded-md"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Evaluation"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
