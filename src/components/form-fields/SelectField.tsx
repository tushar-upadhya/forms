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
import { getFieldName } from "@/lib/types";
import type { UseFormReturn } from "react-hook-form";

interface SelectFieldProps {
    question: Question;
    form: UseFormReturn<FormValues>;
    fieldName?: string;
}

export default function SelectField({
    question,
    form,
    fieldName,
}: SelectFieldProps) {
    const effectiveFieldName = fieldName || getFieldName(question.label);

    return (
        <FormField
            control={form.control}
            name={effectiveFieldName}
            render={({ field }) => (
                <FormItem className="grid gap-2 w-full">
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
                            onValueChange={(value) => {
                                field.onChange(value);
                                console.log(
                                    `SelectField ${effectiveFieldName} changed to: ${value}`
                                );
                            }}
                            value={field.value ? String(field.value) : ""}
                            disabled={question.is_disabled}
                        >
                            <SelectTrigger className="w-full text-xs sm:text-sm md:text-base py-2 sm:py-3">
                                <SelectValue
                                    placeholder={`Select ${question.label}`}
                                />
                            </SelectTrigger>
                            <SelectContent className="min-w-[200px] max-h-[300px] overflow-y-auto z-[2000] p-2">
                                {question.options?.map((option) => (
                                    <SelectItem
                                        key={option.id}
                                        value={option.option_value}
                                        disabled={option.is_disabled}
                                        className="text-xs sm:text-sm md:text-base cursor-pointer p-2 hover:bg-muted rounded"
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
