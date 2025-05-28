/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseFormReturn } from "react-hook-form";

export interface FormValues {
    [key: string]: string | string[] | undefined;
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
        is_default?: boolean;
        order?: number;
    }[];
    created_at?: string;
    default_value?: string | null;
    help_text?: string | null;
    meta_data?: Record<string, any>;
    order?: number | null;
    validation_rules?: any;
}

export interface Section {
    title: string;
    questions: Question[];
    ui: "flex" | "grid" | "grid-cols-2" | "simple";
    is_disabled?: boolean;
    is_repeatable?: boolean;
    meta_data?: Record<string, any>;
    order?: number;
    created_at?: string;
}

export interface FormSchema {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    description: string;
    is_public: boolean;
    status: string;
    slug: string;
    editors: string[];
    submitters: string[];
    tags: string[];
    versions: {
        created_at: string;
        sections: Section[];
    }[];
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthState {
    accessToken: string | null;
}
