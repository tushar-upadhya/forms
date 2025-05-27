/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { UseFormReturn } from "react-hook-form";

interface Option {
    _id: string;
    option_label: string;
    option_value: string;
    is_disabled?: boolean;
}

interface RadioGroupFieldProps {
    form: UseFormReturn<any>;
    fieldName: string;
    label: string;
    options: Option[];
    isRequired?: boolean;
    isDisabled?: boolean;
}

export default function RadioGroupField({
    form,
    fieldName,
    label,
    options,
    isRequired,
    isDisabled,
}: RadioGroupFieldProps) {
    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className="space-y-2 sm:space-y-3">
                    <FormLabel
                        className={
                            isRequired
                                ? "required after:content-['*'] after:text-red-500 text-sm sm:text-base"
                                : "text-sm sm:text-base"
                        }
                    >
                        {label}
                    </FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-wrap gap-3 sm:gap-4"
                            disabled={isDisabled}
                        >
                            {options.map((option) => (
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
                                    <FormLabel className="font-normal cursor-pointer text-xs sm:text-sm">
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
