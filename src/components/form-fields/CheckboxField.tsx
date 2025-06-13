import { Checkbox } from "@/components/ui/checkbox";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import type { FormValues, Option } from "@/lib/types";
import type { UseFormReturn } from "react-hook-form";

interface CheckboxFieldProps {
    form: UseFormReturn<FormValues>;
    fieldName: string;
    label: string;
    options: Option[];
    isRequired?: boolean;
    isDisabled?: boolean;
}

export default function CheckboxField({
    form,
    fieldName,
    label,
    options,
    isRequired = false,
    isDisabled = false,
}: CheckboxFieldProps) {
    // Generate unique options using backend-provided id
    const uniqueOptions = options
        .map((option, index) => ({
            ...option,
            id: option.id || `${fieldName}-option-${index}`,
        }))
        .reduce((acc, option) => {
            if (!acc.find((o) => o.id === option.id)) {
                acc.push(option);
            } else {
                // console.warn(`Duplicate option ID in ${fieldName}:`, option);
            }
            return acc;
        }, [] as Option[]);

    // Log HMCF occurrences
    if (uniqueOptions.some((o) => o.option_value === "HMCF")) {
        // console.log(`HMCF options in ${fieldName}:`, uniqueOptions);
    }

    // Dynamic grid column class based on label size
    const maxLabelLength = uniqueOptions.reduce(
        (max, option) => Math.max(max, option.option_label.length),
        0
    );
    const gridColsClass =
        maxLabelLength > 15
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-3";

    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className="space-y-2 sm:space-y-3">
                    <FormLabel
                        className={`${
                            isRequired
                                ? "required after:content-['*'] after:text-red-500"
                                : ""
                        } text-xs sm:text-sm md:text-base`}
                    >
                        {label || "Unnamed Field"}
                    </FormLabel>
                    <FormControl>
                        <div
                            className={`grid gap-2 sm:gap-3 md:gap-4 ${gridColsClass}`}
                        >
                            {uniqueOptions.map((option) => (
                                <FormItem
                                    key={option.id}
                                    className="flex items-center space-x-2 sm:space-x-3 space-y-0"
                                >
                                    <FormControl>
                                        <Checkbox
                                            id={`${fieldName}-${option.id}`}
                                            checked={
                                                Array.isArray(field.value) &&
                                                field.value.includes(
                                                    option.option_value
                                                )
                                            }
                                            onCheckedChange={(checked) => {
                                                const currentValues =
                                                    Array.isArray(field.value)
                                                        ? field.value
                                                        : [];
                                                const newValues = checked
                                                    ? [
                                                          ...currentValues,
                                                          option.option_value,
                                                      ]
                                                    : currentValues.filter(
                                                          (val) =>
                                                              val !==
                                                              option.option_value
                                                      );
                                                field.onChange(newValues);
                                            }}
                                            disabled={
                                                option.is_disabled || isDisabled
                                            }
                                        />
                                    </FormControl>
                                    <FormLabel
                                        htmlFor={`${fieldName}-${option.id}`}
                                        className="font-normal cursor-pointer text-xs sm:text-sm md:text-base"
                                    >
                                        {option.option_label}
                                    </FormLabel>
                                </FormItem>
                            ))}
                        </div>
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
            )}
        />
    );
}
