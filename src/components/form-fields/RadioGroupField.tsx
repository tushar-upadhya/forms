import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { FormValues, Question } from "@/lib/types";
import type { UseFormReturn } from "react-hook-form";

interface RadioFieldProps {
    question: Question;
    form: UseFormReturn<FormValues>;
}

const getFieldName = (label?: string) => {
    const fieldLabel = label || "unnamed_field";
    return fieldLabel.toLowerCase().replace(/\s+/g, "_");
};

export default function RadioField({ question, form }: RadioFieldProps) {
    const fieldName = getFieldName(question.label);

    return (
        <FormField
            control={form.control}
            name={fieldName}
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
                            {question.options?.map((option) => (
                                <FormItem
                                    key={option._id}
                                    className="flex items-center space-x-2 sm:space-x-3 space-y-0"
                                >
                                    <FormControl>
                                        <RadioGroupItem
                                            value={option.option_value}
                                            disabled={option.is_disabled}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer text-xs sm:text-sm md:text-base">
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
