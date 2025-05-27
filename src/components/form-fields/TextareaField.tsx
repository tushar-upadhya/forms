/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";

interface TextareaFieldProps {
    form: UseFormReturn<any>;
    fieldName: string;
    label: string;
    isRequired?: boolean;
    isDisabled?: boolean;
}

export default function TextareaField({
    form,
    fieldName,
    label,
    isRequired,
    isDisabled,
}: TextareaFieldProps) {
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
                        <Textarea
                            placeholder={`Enter ${label.toLowerCase()}`}
                            disabled={isDisabled}
                            {...field}
                            value={field.value ?? ""}
                            className="w-full min-h-[80px] sm:min-h-[100px] resize-y text-sm sm:text-base"
                        />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
            )}
        />
    );
}
