/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import clsx from "clsx";
import type { UseFormReturn } from "react-hook-form";

interface CheckboxFieldProps {
    form: UseFormReturn<any>;
    fieldName: string;
    label: string;
    options: {
        _id: string;
        option_value: string;
        option_label: string;
        is_disabled?: boolean;
    }[];
    isRequired?: boolean;
    isDisabled?: boolean;
}

export default function CheckboxField({
    form,
    fieldName,
    label,
    options,
    isRequired,
    isDisabled,
}: CheckboxFieldProps) {
    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className="space-y-2 xs:space-y-3 sm:space-y-4">
                    <FormLabel
                        className={clsx(
                            isRequired
                                ? "required after:content-['*'] after:text-red-500"
                                : "",
                            "text-xs xs:text-sm sm:text-base md:text-lg"
                        )}
                    >
                        {label}
                    </FormLabel>
                    <FormControl>
                        <div
                            className={clsx(
                                "grid gap-2 xs:gap-3 sm:gap-4 max-h-[300px] overflow-y-auto",
                                options.length > 10
                                    ? "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3"
                                    : "grid-cols-1"
                            )}
                        >
                            {options.map((option) => (
                                <label
                                    key={option._id}
                                    className="flex items-center space-x-2 xs:space-x-3 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        value={option.option_value}
                                        checked={field.value?.includes(
                                            option.option_value
                                        )}
                                        onChange={(e) => {
                                            const updatedValue = e.target
                                                .checked
                                                ? [
                                                      ...(field.value || []),
                                                      option.option_value,
                                                  ]
                                                : (field.value || []).filter(
                                                      (v: string) =>
                                                          v !==
                                                          option.option_value
                                                  );
                                            field.onChange(updatedValue);
                                        }}
                                        disabled={
                                            option.is_disabled || isDisabled
                                        }
                                        className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-xs xs:text-sm sm:text-base">
                                        {option.option_label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </FormControl>
                    <FormMessage className="text-xs xs:text-sm" />
                </FormItem>
            )}
        />
    );
}
