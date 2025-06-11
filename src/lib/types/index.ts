import type { UseFormReturn } from "react-hook-form";

export const getFieldName = (label?: string): string =>
    label
        ? label
              .toLowerCase()
              .replace(/\s+/g, "_")
              .replace(/[^a-z0-9_]/g, "")
        : "";

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
    is_repeatable_question?: boolean;
    visibility_condition?: string | null;
    meta_data?: {
        variable_name?: string;
    };
}

export interface Section {
    id?: string;
    title: string;
    questions: Question[];
    ui?: string;
    is_repeatable_section?: boolean;
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
