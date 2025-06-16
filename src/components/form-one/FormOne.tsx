/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const fields: Record<string, any> = {};
    sections.forEach((section) => {
        section.questions.forEach((question: Question) => {
            const baseFieldName = getFieldName(question.label);
            const fieldName =
                section.is_repeatable_section || question.is_repeatable_question
                    ? `${baseFieldName}_0`
                    : baseFieldName;

            if (question.field_type === "checkbox") {
                fields[fieldName] = question.is_required
                    ? question.default_value
                        ? Array.isArray(question.default_value)
                            ? question.default_value
                            : [question.default_value]
                        : []
                    : [];
            } else if (
                question.field_type === "textarea" &&
                question.id === "dc05ed5d-00a8-433c-a276-fd6e2021a20a"
            ) {
                fields[fieldName] = question.is_required
                    ? question.default_value || [""]
                    : [""];
            } else {
                fields[fieldName] = question.is_required
                    ? question.default_value || ""
                    : "";
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

    const {
        mutate,
        isError: isSubmitError,
        error: submitError,
    } = useSubmitForm(
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
            dispatch(
                setFormSubmissionStatus({
                    status: "error",
                    message:
                        error.response?.data?.message ||
                        error.message ||
                        "Failed to submit form.",
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
            const defaultValues = generateDefaultValues(
                formSchema.versions[0].sections
            );
            methods.reset(defaultValues);
        }
    }, [formSchema, methods]);

    function onSubmit(data: FormValues) {
        const transformedData: Record<string, any> = {};
        const repeatableSections: Record<string, any[]> = {};

        // Collect all values for each question
        formSchema?.versions?.[0]?.sections.forEach((section) => {
            section.questions.forEach((question) => {
                const baseFieldName = getFieldName(question.label);
                const values: any[] = [];

                // Collect current input value (e.g., chief_complaint_0)
                const currentInput = data[`${baseFieldName}_0`];
                if (
                    currentInput !== undefined &&
                    (typeof currentInput === "string"
                        ? currentInput.trim() !== ""
                        : Array.isArray(currentInput)
                        ? currentInput.length > 0
                        : true)
                ) {
                    values.push(currentInput);
                }

                // Collect committed values (e.g., chief_complaint_1, chief_complaint_2, ...)
                let idx = 1;
                while (true) {
                    const committedValue = data[`${baseFieldName}_${idx}`];
                    if (
                        committedValue === undefined ||
                        committedValue === null
                    ) {
                        break;
                    }
                    if (
                        typeof committedValue === "string"
                            ? committedValue.trim() !== ""
                            : Array.isArray(committedValue)
                            ? committedValue.length > 0
                            : true
                    ) {
                        values.push(committedValue);
                    }
                    idx++;
                }

                if (values.length === 0) return;

                const finalValue =
                    question.field_type === "textarea" &&
                    question.id === "dc05ed5d-00a8-433c-a276-fd6e2021a20a"
                        ? values.flatMap((v) => (Array.isArray(v) ? v : [v]))
                        : question.is_repeatable_question
                        ? values.flatMap((v) => (Array.isArray(v) ? v : [v]))
                        : values[0]; // Non-repeatable takes first value

                if (section.is_repeatable_section) {
                    if (section.id && question.id) {
                        if (!repeatableSections[section.id]) {
                            repeatableSections[section.id] = [];
                        }
                        values.forEach((value, valueIdx) => {
                            if (section.id) {
                                while (
                                    repeatableSections[section.id].length <=
                                    valueIdx
                                ) {
                                    repeatableSections[section.id].push({});
                                }
                                repeatableSections[section.id][valueIdx][
                                    question.id as string
                                ] = value;
                            }
                        });
                    } else {
                        console.warn(
                            "Section ID or Question ID is undefined, skipping entry for repeatable section."
                        );
                    }
                } else {
                    if (section.id && question.id) {
                        if (!transformedData[section.id]) {
                            transformedData[section.id] = {};
                        }
                        transformedData[section.id][question.id] = finalValue;
                    } else {
                        console.warn(
                            "Section ID or Question ID is undefined, skipping entry for non-repeatable section."
                        );
                    }
                }
            });
        });

        // Merge repeatable section entries
        Object.entries(repeatableSections).forEach(([sectionId, entries]) => {
            transformedData[sectionId] = entries.filter((entry) =>
                Object.values(entry).some(
                    (v) =>
                        v !== undefined &&
                        v !== "" &&
                        !(Array.isArray(v) && v.length === 0)
                )
            );
        });

        // Remove empty sections
        Object.keys(transformedData).forEach((sectionId) => {
            if (
                (Array.isArray(transformedData[sectionId]) &&
                    transformedData[sectionId].length === 0) ||
                (typeof transformedData[sectionId] === "object" &&
                    Object.keys(transformedData[sectionId]).length === 0)
            ) {
                delete transformedData[sectionId];
            }
        });

        console.log(
            "📤 Form Data Before Submission:",
            JSON.stringify(transformedData, null, 2)
        );
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
            {isSubmitError && (
                <div className="text-red-500 text-sm mb-4">
                    Submission failed: {submitError?.message || "Unknown error"}
                </div>
            )}
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="space-y-4 sm:space-y-6 md:space-y-8"
                >
                    {formSchema.versions[0].sections.map((section, idx) => (
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
                    ))}
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
