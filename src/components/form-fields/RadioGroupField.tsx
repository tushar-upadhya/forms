import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { FormValues, Question } from "@/lib/types";
import { getFieldName } from "@/lib/types";
import type { UseFormReturn } from "react-hook-form";

interface RadioFieldProps {
    question: Question;
    form: UseFormReturn<FormValues>;
    fieldName?: string;
}

export default function RadioGroupField({
    question,
    form,
    fieldName,
}: RadioFieldProps) {
    const effectiveFieldName = fieldName || getFieldName(question.label);

    // Ensure unique options with fallback IDs
    const uniqueOptions = (question.options || [])
        .map((option, index) => ({
            ...option,
            id: option.id || `${effectiveFieldName}-option-${index}`, // Fallback ID
        }))
        .filter(
            (option, index, self) =>
                index === self.findIndex((o) => o.id === option.id)
        );

    // Debug: Log options to check for duplicates
    if (question.options && question.options.length !== uniqueOptions.length) {
        console.warn(
            `Duplicate option IDs detected in ${effectiveFieldName}:`,
            question.options
        );
        console.log("Unique options:", uniqueOptions);
    }

    return (
        <FormField
            control={form.control}
            name={effectiveFieldName}
            render={({ field }) => (
                <FormItem className="space-y-2 sm:space-y-3">
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
                        <RadioGroup
                            onValueChange={field.onChange}
                            value={
                                typeof field.value === "string"
                                    ? field.value
                                    : ""
                            }
                            className="flex flex-wrap gap-2 sm:gap-3 md:gap-4"
                            disabled={question.is_disabled}
                        >
                            {uniqueOptions.map((option) => (
                                <FormItem
                                    key={option.id}
                                    className="flex items-center space-x-2 sm:space-x-3 space-y-0"
                                >
                                    <FormControl>
                                        <RadioGroupItem
                                            value={option.option_value}
                                            id={`${effectiveFieldName}-${option.id}`}
                                            disabled={option.is_disabled}
                                        />
                                    </FormControl>
                                    <FormLabel
                                        htmlFor={`${effectiveFieldName}-${option.id}`}
                                        className="font-normal cursor-pointer text-xs sm:text-sm md:text-base"
                                    >
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
}
