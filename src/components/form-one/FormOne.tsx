import { Button } from "@/components/ui/button";
import { useFormSchema } from "@/hooks/useFormSchema";
import { useSubmitForm } from "@/hooks/useSubmitForm";
import {
    getFieldName,
    type FormValues,
    type Question,
    type Section,
} from "@/lib/types";
import { setFormSubmissionStatus } from "@/store/slices/formSchemaSlice";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import CheckboxField from "../form-fields/CheckboxField";
import InputField from "../form-fields/InputField";
import RadioGroupField from "../form-fields/RadioGroupField";
import SelectField from "../form-fields/SelectField";
import TextareaField from "../form-fields/TextareaField";
import SectionRenderer from "../SectionRenderer";
import Error from "../skeleton/error/Error";
import LoadingSkeleton from "../skeleton/loading/LoadingSkeleton";
import RepeatableQuestionWrapper from "../wrapper/RepeatableQuestionWrapper";
import RepeatableSectionWrapper from "../wrapper/RepeatableSectionWrapper";

const FORM_ID = import.meta.env.VITE_FORM_ID;

const generateDefaultValues = (sections: Section[]) => {
    const fields: Record<string, string | string[] | undefined> = {};
    sections.forEach((section) => {
        section.questions.forEach((question: Question) => {
            const baseFieldName = getFieldName(question.label);
            const fieldName = section.is_repeatable_section
                ? `${baseFieldName}_0`
                : question.is_repeatable_question
                ? `${baseFieldName}_0`
                : baseFieldName;
            fields[fieldName] =
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
            // Log field type mismatches
            if (
                question.id === "dc05ed5d-00a8-433c-a276-fd6e2021a20a" &&
                question.field_type !== "textarea"
            ) {
                console.error(
                    `Field type mismatch for Chief Complaint (dc05ed5d-...): Expected textarea, got ${question.field_type}`,
                    question
                );
            }
        });
    });
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
                label={question.label}
                fieldName={fieldName || getFieldName(question.label)}
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
    const methods = useForm<FormValues>({ defaultValues: {} });
    const dispatch = useDispatch();

    const { mutate } = useSubmitForm(
        FORM_ID,
        (data) => {
            setIsSubmitting(false);
            methods.reset();
            dispatch(
                setFormSubmissionStatus({
                    status: "success",
                    message: data.message,
                })
            );
        },
        (error) => {
            setIsSubmitting(false);
            methods.reset();
            dispatch(
                setFormSubmissionStatus({
                    status: "error",
                    message: error.response?.data?.message || error.message,
                })
            );
        }
    );

    useEffect(() => {
        if (
            formSchema &&
            formSchema.versions &&
            formSchema.versions[0]?.sections
        ) {
            // console.log("Form schema loaded:", formSchema.versions[0].sections);
            const defaultValues = generateDefaultValues(
                formSchema.versions[0].sections
            );
            methods.reset(defaultValues);
        }
    }, [formSchema, methods]);

    function onSubmit(data: FormValues) {
        const transformedData: FormValues = {};
        const repeatableFields: Record<string, (string | string[])[]> = {};

        Object.entries(data).forEach(([key, value]) => {
            const normalizedKey = getFieldName(key);
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

        // console.log("Submitting transformed data:", transformedData);
        setIsSubmitting(true);
        mutate(transformedData);
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
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="space-y-4 sm:space-y-6 md:space-y-8"
                >
                    {methods ? (
                        <>
                            {formSchema.versions[0].sections.map(
                                (section, idx) => (
                                    <div
                                        key={section.id || `section-${idx}`}
                                        className="section-wrapper"
                                    >
                                        {section.is_repeatable_section ? (
                                            <RepeatableSectionWrapper
                                                section={section}
                                                form={methods}
                                                index={idx}
                                            />
                                        ) : (
                                            <SectionRenderer
                                                section={section}
                                                form={methods}
                                                index={idx}
                                            />
                                        )}
                                    </div>
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
                            {isSubmitting
                                ? "Submitting..."
                                : "Submit Evaluation"}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
