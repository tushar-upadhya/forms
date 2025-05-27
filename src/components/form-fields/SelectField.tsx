/* eslint-disable @typescript-eslint/no-explicit-any */
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
import type { UseFormReturn } from "react-hook-form";

interface Option {
    _id: string;
    option_label: string;
    option_value: string;
    is_disabled?: boolean;
}

interface SelectFieldProps {
    form: UseFormReturn<any>;
    fieldName: string;
    label: string;
    options: Option[];
    isRequired?: boolean;
    isDisabled?: boolean;
}

export default function SelectField({
    form,
    fieldName,
    label,
    options,
    isRequired,
    isDisabled,
}: SelectFieldProps) {
    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem>
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
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isDisabled}
                        >
                            <SelectTrigger className="w-full text-sm sm:text-base">
                                <SelectValue
                                    placeholder={`Select ${label.toLowerCase()}`}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((option) => (
                                    <SelectItem
                                        key={option._id}
                                        value={option.option_value}
                                        disabled={option.is_disabled}
                                        className="text-sm sm:text-base"
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
