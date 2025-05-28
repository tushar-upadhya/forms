/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderField } from "@/components/form-one/FormOne";
import clsx from "clsx";
import type { UseFormReturn } from "react-hook-form";

interface QuestionWrapperProps {
    question: any;
    form: UseFormReturn<Record<string, string | undefined>>;
    qIndex: number;
    fieldNames: string[];
}

export default function QuestionWrapper({
    question,
    form,
    qIndex,
    fieldNames,
}: QuestionWrapperProps) {
    const fieldValues = form.watch();

    const isVisible =
        qIndex === 0 ||
        (() => {
            const prevValue = fieldValues[fieldNames[qIndex - 1]];
            if (prevValue === undefined || prevValue === null) return false;

            if (Array.isArray(prevValue)) {
                return prevValue.length > 0;
            }
            if (typeof prevValue === "boolean") {
                return prevValue === true;
            }
            if (
                (typeof prevValue === "object" &&
                    prevValue !== null &&
                    !Array.isArray(prevValue) &&
                    prevValue instanceof File) ||
                (Array.isArray(prevValue) && prevValue[0] instanceof File)
            ) {
                return prevValue.length > 0 || !!prevValue;
            }

            return !!prevValue;
        })();

    return (
        <div
            className={clsx(
                question.field_type === "textarea"
                    ? "col-span-1 sm:col-span-2"
                    : "col-span-1",
                isVisible ? "block" : "hidden"
            )}
        >
            {renderField(question, form)}
        </div>
    );
}
