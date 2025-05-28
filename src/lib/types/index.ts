import type { UseFormReturn } from "react-hook-form";

export interface FormValues {
    [key: string]: string | undefined;
}

export interface PatientInfoSectionProps {
    form: UseFormReturn<FormValues>;
}

export interface Question {
    _id: string;
    label: string;
    field_type: "input" | "textarea" | "radio" | "select" | "checkbox";
    is_required: boolean;
    is_disabled: boolean;
    options?: {
        _id: string;
        option_value: string;
        option_label: string;
        is_disabled: boolean;
    }[];
}

export interface Section {
    title: string;
    questions: Question[];
    ui: "flex" | "grid" | "grid-cols-2";
}

export interface FormSchema {
    versions: { sections: Section[] }[];
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthState {
    accessToken: string | null;
}
