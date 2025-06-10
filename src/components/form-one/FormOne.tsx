import { Button } from "@/components/ui/button";
import { useFormSchema } from "@/hooks/useFormSchema";
import { useSubmitForm } from "@/hooks/useSubmitForm";
import type { FormValues, Question, Section } from "@/lib/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CheckboxField from "../form-fields/CheckboxField";
import InputField from "../form-fields/InputField";
import RadioGroupField from "../form-fields/RadioGroupField";
import SelectField from "../form-fields/SelectField";
import TextareaField from "../form-fields/TextareaField";
import SectionRenderer from "../SectionRenderer";
import Error from "../skeleton/error/Error";
import LoadingSkeleton from "../skeleton/loading/LoadingSkeleton";
import RepeatableQuestionWrapper from "../wrapper/RepeatableQuestionWrapper";

const FORM_ID = import.meta.env.VITE_FORM_ID;

const getFieldName = (label?: string) =>
    label ? label.toLowerCase().replace(/\s+/g, "_") : "";

const generateDefaultValues = (sections: Section[]) => {
    const fields: Record<string, string | string[] | undefined> = {};
    sections.forEach((section) => {
        section.questions.forEach((question: Question) => {
            const baseFieldName = getFieldName(question.label);
            if (question.is_repeatable_question) {
                fields[`${baseFieldName}_0`] =
                    question.field_type === "checkbox"
                        ? question.is_required
                            ? question.default_value
                                ? Array.isArray(question.default_value)
                                    ? question.default_value
                                    : [question.default_value]
                                : []
                            : []
                        : question.is_required
                        ? question.default_value || ""
                        : "";
            } else {
                fields[baseFieldName] =
                    question.field_type === "checkbox"
                        ? question.is_required
                            ? question.default_value
                                ? Array.isArray(question.default_value)
                                    ? question.default_value
                                    : [question.default_value]
                                : []
                            : []
                        : question.is_required
                        ? question.default_value || ""
                        : "";
            }
        });
    });
    console.log("Generated default values:", fields);
    return fields;
};

const CheckboxFieldWrapper: React.FC<{
    question: Question;
    form: ReturnType<typeof useForm<FormValues>>;
}> = ({ question, form }) => (
    <RepeatableQuestionWrapper
        question={question}
        form={form}
        FieldComponent={({ question, form, fieldName }) => (
            <CheckboxField
                form={form}
                fieldName={fieldName || getFieldName(question.label)}
                label={question.label}
                options={question.options || []}
                isRequired={question.is_required}
                isDisabled={question.is_disabled}
            />
        )}
    />
);

export const fieldComponents: Record<
    string,
    React.ComponentType<{
        question: Question;
        form: ReturnType<typeof useForm<FormValues>>;
    }>
> = {
    input: ({ question, form }) => (
        <RepeatableQuestionWrapper
            question={question}
            form={form}
            FieldComponent={InputField}
        />
    ),
    textarea: ({ question, form }) => (
        <RepeatableQuestionWrapper
            question={question}
            form={form}
            FieldComponent={TextareaField}
        />
    ),
    radio: ({ question, form }) => (
        <RepeatableQuestionWrapper
            question={question}
            form={form}
            FieldComponent={RadioGroupField}
        />
    ),
    select: ({ question, form }) => (
        <RepeatableQuestionWrapper
            question={question}
            form={form}
            FieldComponent={SelectField}
        />
    ),
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
            form.reset({});
            console.error(
                "Submission error:",
                error.message,
                error.response?.data
            );
        }
    );

    useEffect(() => {
        if (
            formSchema &&
            formSchema.versions &&
            formSchema.versions[0]?.sections
        ) {
            const defaultValues = generateDefaultValues(
                formSchema.versions[0].sections
            );
            console.log("Setting form default values:", defaultValues);
            form.reset(defaultValues);
        }
    }, [formSchema, form]);

    function onSubmit(data: FormValues) {
        const transformedData: FormValues = {};
        const repeatableFields: Record<string, (string | string[])[]> = {};

        Object.entries(data).forEach(([key, value]) => {
            const normalizedKey = key.toLowerCase();
            if (
                value !== undefined &&
                (Array.isArray(value) ? value.length > 0 : value !== "")
            ) {
                const match = normalizedKey.match(/^(.+)_(\d+)$/);
                if (match) {
                    const baseFieldName = match[1];
                    repeatableFields[baseFieldName] =
                        repeatableFields[baseFieldName] || [];
                    repeatableFields[baseFieldName].push(value);
                } else {
                    transformedData[normalizedKey] = value;
                }
            }
        });

        Object.entries(repeatableFields).forEach(([key, values]) => {
            const nonEmptyValues = values.filter((v) =>
                Array.isArray(v) ? v.length > 0 : v !== ""
            );
            if (nonEmptyValues.length > 0) {
                transformedData[key] = nonEmptyValues.flat();
            }
        });

        console.log("Raw form data:", data);
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
                        {formSchema.versions[0].sections.map(
                            (section, index) => (
                                <SectionRenderer
                                    key={section.title}
                                    section={section}
                                    form={form}
                                    index={index}
                                />
                            )
                        )}
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
