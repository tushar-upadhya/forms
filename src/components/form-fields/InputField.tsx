/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";

interface InputFieldProps {
    form: UseFormReturn<any>;
    fieldName: string;
    label: string;
    isRequired?: boolean;
    isDisabled?: boolean;
}

export default function InputField({
    form,
    fieldName,
    label,
    isRequired,
    isDisabled,
}: InputFieldProps) {
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
                        <Input
                            placeholder={`Enter ${label.toLowerCase()}`}
                            disabled={isDisabled}
                            {...field}
                            value={field.value ?? ""}
                            className="w-full text-sm sm:text-base"
                        />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
            )}
        />
    );
}
