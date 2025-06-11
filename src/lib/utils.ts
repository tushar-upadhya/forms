import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import type { FormValues, Question } from "@/lib/types";

export const evaluateVisibilityCondition = (
    condition: string | null | undefined,
    formValues: FormValues,
    variableMap: Record<string, string>
): boolean => {
    if (!condition) return true;

    const match = condition.match(/^(\w+)\s*==\s*'([^']+)'$/);
    if (!match) {
        console.warn(`Invalid visibility condition: ${condition}`);
        return false;
    }

    const [, variableName, expectedValue] = match;
    const fieldName = variableMap[variableName] || variableName;
    const actualValue = formValues[fieldName];

    return actualValue === expectedValue;
};

export const buildVariableMap = (
    questions: Question[]
): Record<string, string> => {
    const map: Record<string, string> = {};
    questions.forEach((question) => {
        if (question.meta_data?.variable_name) {
            map[question.meta_data.variable_name] = getFieldName(
                question.label
            );
        }
    });
    return map;
};

export const getFieldName = (label?: string): string =>
    label
        ? label
              .toLowerCase()
              .replace(/\s+/g, "_")
              .replace(/[^a-z0-9_]/g, "")
        : "";
