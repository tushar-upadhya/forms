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

    // Determine the number of options
    const optionCount = (question.options || []).length;
    // Use 2 columns for even number of options on sm+, 1 column for odd or small screens
    const gridColsClass =
        optionCount % 2 === 0 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1";

    return (
        <FormField
            control={form.control}
            name={effectiveFieldName}
            render={({ field }) => (
                <FormItem className="grid gap-2 w-full">
                    <FormLabel
                        className={
                            question.is_required
                                ? "required after:content-['*'] after:text-red-500 text-sm sm:text-base font-medium"
                                : "text-sm sm:text-base font-medium"
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
                            <SelectTrigger className="w-full text-sm sm:text-base py-2 sm:py-3 border-border/50 shadow-sm focus:ring-2 focus:ring-primary/20 rounded-lg transition-all">
                                <SelectValue
                                    placeholder={`Select ${question.label}`}
                                />
                            </SelectTrigger>
                            <SelectContent
                                className={`w-full min-w-[200px] max-h-[300px] overflow-y-auto z-[2000] p-2 bg-card/95 border-border/50 shadow-lg rounded-lg grid ${gridColsClass} gap-1`}
                            >
                                {question.options?.map((option) => (
                                    <SelectItem
                                        key={`${question.id}-${option.id}`} // ✅ Ensures unique key
                                        value={option.option_value}
                                        disabled={option.is_disabled}
                                        className="text-sm sm:text-base cursor-pointer p-2 hover:bg-muted/50 rounded-md transition-colors"
                                    >
                                        {option.option_label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm text-destructive" />
                </FormItem>
            )}
        />
    );
}
