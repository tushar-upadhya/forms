import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { FormValues, Question } from "@/lib/types";
import type { UseFormReturn } from "react-hook-form";

interface InputFieldProps {
    question: Question;
    form: UseFormReturn<FormValues>;
}

const getFieldName = (label: string) =>
    label.toLowerCase().replace(/\s+/g, "_");

export default function InputField({ question, form }: InputFieldProps) {
    const fieldName = getFieldName(question.label);

    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem>
                    <FormLabel
                        className={
                            question.is_required
                                ? "required after:content-['*'] after:text-red-500 text-xs sm:text-sm md:text-base"
                                : "text-xs sm:text-sm md:text-base"
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
                            className="w-full text-xs sm:text-sm md:text-base py-2 sm:py-3"
                        />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
            )}
        />
    );
}
