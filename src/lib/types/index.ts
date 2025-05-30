export interface Option {
    _id: string;
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
}

export interface Section {
    title: string;
    questions: Question[];
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
