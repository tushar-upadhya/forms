import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { FormValues, Question } from "@/lib/types";
import type { UseFormReturn } from "react-hook-form";

interface SelectFieldProps {
    question: Question;
    form: UseFormReturn<FormValues>;
}

const getFieldName = (label: string) =>
    label.toLowerCase().replace(/\s+/g, "_");

export default function SelectField({ question, form }: SelectFieldProps) {
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
                        <Select
                            onValueChange={field.onChange}
                            value={
                                Array.isArray(field.value)
                                    ? field.value[0] ?? undefined
                                    : field.value
                            }
                            disabled={question.is_disabled}
                        >
                            <SelectTrigger className="w-full text-xs sm:text-sm md:text-base py-2 sm:py-3">
                                <SelectValue
                                    placeholder={`Select ${question.label.toLowerCase()}`}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {question.options?.map((option) => (
                                    <SelectItem
                                        key={option._id}
                                        value={option.option_value}
                                        disabled={option.is_disabled}
                                        className="text-xs sm:text-sm md:text-base"
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
}
