import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { FormValues, Question } from "@/lib/types";
import { getFieldName } from "@/lib/types";
import type { UseFormReturn } from "react-hook-form";

interface TextareaFieldProps {
    question: Question;
    form: UseFormReturn<FormValues>;
    fieldName?: string;
}

export default function TextareaField({
    question,
    form,
    fieldName,
}: TextareaFieldProps) {
    const effectiveFieldName = fieldName || getFieldName(question.label);

    return (
        <FormField
            control={form.control}
            name={effectiveFieldName}
            render={({ field }) => (
                <FormItem>
                    <FormLabel
                        className={
                            question.is_required
                                ? "required after:content-['*'] after:text-red-500 text-xs sm:text-sm md:text-base"
                                : "text-xs sm:text-sm md:text-base"
                        }
                    >
                        {question.label || "Unnamed Field"}
                    </FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder={`Enter ${(
                                question.label || "details"
                            ).toLowerCase()}`}
                            disabled={question.is_disabled}
                            {...field}
                            value={field.value ?? ""}
                            className="w-full min-h-[60px] sm:min-h-[80px] md:min-h-[100px] resize-y text-xs sm:text-sm md:text-base"
                        />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
            )}
        />
    );
}
