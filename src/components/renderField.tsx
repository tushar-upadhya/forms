/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import type { UseFormReturn } from "react-hook-form";
import { getFieldName, type FormValues } from "./form-one/FormOne";

export const renderField = (question: any, form: UseFormReturn<FormValues>) => {
    const fieldName = getFieldName(question.label);
    const truncatePlaceholder = (text: string, maxLength: number = 30) =>
        text.length > maxLength
            ? `${text.substring(0, maxLength - 3)}...`
            : text;

    if (!form || !form.control) {
        console.error("Form control is undefined for field:", fieldName);
        return null;
    }

    switch (question.field_type) {
        case "input":
            return (
                <FormField
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className={clsx(
                                    question.is_required
                                        ? "required after:content-['*'] after:text-red-500"
                                        : "",
                                    "text-xs xs:text-sm sm:text-base md:text-lg"
                                )}
                            >
                                {question.label}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={truncatePlaceholder(
                                        `Enter ${question.label.toLowerCase()}`
                                    )}
                                    disabled={question.is_disabled}
                                    {...field}
                                    value={field.value ?? ""}
                                    className="w-full min-w-[200px] h-10 xs:h-11 sm:h-12 text-xs xs:text-sm sm:text-base"
                                />
                            </FormControl>
                            <FormMessage className="text-xs xs:text-sm" />
                        </FormItem>
                    )}
                />
            );

        case "textarea":
            return (
                <FormField
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className={clsx(
                                    question.is_required
                                        ? "required after:content-['*'] after:text-red-500"
                                        : "",
                                    "text-xs xs:text-sm sm:text-base md:text-lg"
                                )}
                            >
                                {question.label}
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder={truncatePlaceholder(
                                        `Enter ${question.label.toLowerCase()}`
                                    )}
                                    disabled={question.is_disabled}
                                    {...field}
                                    value={field.value ?? ""}
                                    className="w-full min-w-[200px] min-h-[80px] xs:min-h-[100px] sm:min-h-[120px] resize-y text-xs xs:text-sm sm:text-base"
                                />
                            </FormControl>
                            <FormMessage className="text-xs xs:text-sm" />
                        </FormItem>
                    )}
                />
            );

        case "radio":
            return (
                <FormField
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                        <FormItem className="space-y-2 xs:space-y-3 sm:space-y-4">
                            <FormLabel
                                className={clsx(
                                    question.is_required
                                        ? "required after:content-['*'] after:text-red-500"
                                        : "",
                                    "text-xs xs:text-sm sm:text-base md:text-lg"
                                )}
                            >
                                {question.label}
                            </FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex flex-col xs:flex-row xs:flex-wrap gap-2 xs:gap-3 sm:gap-4"
                                    disabled={question.is_disabled}
                                >
                                    {question.options.map((option: any) => (
                                        <FormItem
                                            key={option._id}
                                            className="flex items-center space-x-2 xs:space-x-3 space-y-0"
                                        >
                                            <FormControl>
                                                <RadioGroupItem
                                                    value={option.option_value}
                                                    disabled={
                                                        option.is_disabled
                                                    }
                                                    className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6"
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer text-xs xs:text-sm sm:text-base">
                                                {option.option_label}
                                            </FormLabel>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage className="text-xs xs:text-sm" />
                        </FormItem>
                    )}
                />
            );

        case "select":
            return (
                <FormField
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className={clsx(
                                    question.is_required
                                        ? "required after:content-['*'] after:text-red-500"
                                        : "",
                                    "text-xs xs:text-sm sm:text-base md:text-lg"
                                )}
                            >
                                {question.label}
                            </FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={question.is_disabled}
                                >
                                    <SelectTrigger className="w-full min-w-[200px] h-10 xs:h-11 sm:h-12 text-xs xs:text-sm sm:text-base truncate">
                                        <SelectValue
                                            placeholder={truncatePlaceholder(
                                                `Select ${question.label.toLowerCase()}`
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent className="max-w-full max-h-60 overflow-y-auto">
                                        {question.options.map((option: any) => (
                                            <SelectItem
                                                key={option._id}
                                                value={option.option_value}
                                                disabled={option.is_disabled}
                                                className="text-xs xs:text-sm sm:text-base py-2 xs:py-2.5 max-w-full truncate"
                                            >
                                                {option.option_label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage className="text-xs xs:text-sm" />
                        </FormItem>
                    )}
                />
            );

        case "checkbox":
            return (
                <FormField
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                        <FormItem className="space-y-2 xs:space-y-3 sm:space-y-4">
                            <FormLabel
                                className={clsx(
                                    question.is_required
                                        ? "required after:content-['*'] after:text-red-500"
                                        : "",
                                    "text-xs xs:text-sm sm:text-base md:text-lg"
                                )}
                            >
                                {question.label}
                            </FormLabel>
                            <FormControl>
                                <div
                                    className={clsx(
                                        "grid gap-2 xs:gap-3 sm:gap-4 max-h-[300px] overflow-y-auto",
                                        question.options.length > 10
                                            ? "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3"
                                            : "grid-cols-1"
                                    )}
                                >
                                    {question.options.map((option: any) => (
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
                                                    const updatedValue = e
                                                        .target.checked
                                                        ? [
                                                              ...(field.value ||
                                                                  []),
                                                              option.option_value,
                                                          ]
                                                        : (
                                                              field.value || []
                                                          ).filter(
                                                              (v: string) =>
                                                                  v !==
                                                                  option.option_value
                                                          );
                                                    field.onChange(
                                                        updatedValue
                                                    );
                                                }}
                                                disabled={
                                                    option.is_disabled ||
                                                    question.is_disabled
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

        default:
            return null;
    }
};
