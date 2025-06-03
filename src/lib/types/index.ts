import type { UseFormReturn } from "react-hook-form";

// Utility function to normalize field names (lowercase, replace spaces with underscores)
export const getFieldName = (label?: string): string =>
    label ? label.toLowerCase().replace(/\s+/g, "_") : "";

export interface Option {
    id: string;
    option_value: string;
    option_label: string;
    is_disabled?: boolean;
}

export interface Question {
    label: string;
    field_type: "input" | "textarea" | "radio" | "select" | "checkbox";
    options?: Option[];
    is_required?: boolean;
    is_disabled?: boolean;
    default_value?: string | string[];
    id?: string;
}

export interface Section {
    title: string;
    questions: Question[];
    ui?: string;
}

export interface FormSchema {
    versions: {
        sections: Section[];
    }[];
}

export interface FormValues {
    [key: string]: string | string[] | undefined;
}

export interface LoginPayload {
    username: string;
    password: string;
}

export interface PatientInfoSectionProps {
    form: UseFormReturn<FormValues>;
}
