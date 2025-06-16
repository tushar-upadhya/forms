import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getFieldName, type FormValues, type Section } from "@/lib/types";
import { buildVariableMap, evaluateVisibilityCondition } from "@/lib/utils";
import { Check, Edit, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import SectionRenderer from "../SectionRenderer";

interface RepeatableSectionWrapperProps {
    section: Section;
    form: UseFormReturn<FormValues>;
    index: number;
}

const RepeatableSectionWrapper = ({
    section,
    form,
    index,
}: RepeatableSectionWrapperProps) => {
    const [committedEntries, setCommittedEntries] = useState<
        Record<string, string | string[] | null>[]
    >([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Record<string, string>>({});

    const { watch } = useFormContext();
    const formValues = watch();
    const variableMap = buildVariableMap(section.questions);

    // Initialize form state and sync committed entries
    useEffect(() => {
        section.questions.forEach((question) => {
            const fieldName = getFieldName(question.label);
            const inputName = `${fieldName}_${committedEntries.length}`;
            if (question.is_required) {
                form.setValue(
                    inputName,
                    question.field_type === "checkbox"
                        ? []
                        : question.is_repeatable_question &&
                          question.field_type === "textarea"
                        ? [""]
                        : ""
                );
            }
        });
        committedEntries.forEach((entry, idx) => {
            Object.entries(entry).forEach(([fieldName, value]) => {
                const question = section.questions.find(
                    (q) => getFieldName(q.label) === fieldName
                );
                form.setValue(
                    `${fieldName}_${idx + 1}`,
                    value !== null
                        ? value
                        : question?.is_required
                        ? question.field_type === "checkbox"
                            ? []
                            : question.is_repeatable_question &&
                              question.field_type === "textarea"
                            ? [""]
                            : ""
                        : undefined
                );
            });
        });
    }, [committedEntries, form, section.questions]);

    const handleAddEntry = () => {
        const entry: Record<string, string | string[] | null> = {};
        let hasValidValue = false;
        const errors: Record<string, string> = {};

        section.questions.forEach((question) => {
            const fieldName = getFieldName(question.label);
            const inputName = `${fieldName}_${committedEntries.length}`;
            if (
                !evaluateVisibilityCondition(
                    question.visibility_condition,
                    formValues,
                    variableMap
                ) &&
                !question.is_required
            ) {
                return;
            }

            const rawValue = form.getValues(inputName);
            const value =
                typeof rawValue === "string"
                    ? rawValue.trim()
                    : Array.isArray(rawValue)
                    ? rawValue
                    : null;

            if (
                question.is_required &&
                (!value ||
                    (typeof value === "string" && value === "") ||
                    (Array.isArray(value) && value.length === 0))
            ) {
                errors[inputName] = `${question.label} is required`;
            } else if (value) {
                hasValidValue = true;
                entry[fieldName] = value;
            } else {
                entry[fieldName] = question.is_required
                    ? question.field_type === "checkbox"
                        ? []
                        : question.is_repeatable_question &&
                          question.field_type === "textarea"
                        ? [""]
                        : ""
                    : null;
            }

            form.setValue(
                inputName,
                question.field_type === "checkbox"
                    ? []
                    : question.is_repeatable_question &&
                      question.field_type === "textarea"
                    ? [""]
                    : ""
            );
        });

        // Set errors if any
        Object.entries(errors).forEach(([field, message]) => {
            form.setError(field, { type: "required", message });
        });

        if (Object.keys(errors).length > 0) {
            return;
        }

        if (hasValidValue || section.questions.some((q) => q.is_required)) {
            setCommittedEntries((prev) => [...prev, entry]);
            Object.keys(errors).forEach((field) => form.clearErrors(field));
        }
    };

    const handleDeleteEntry = (idx: number) => {
        setCommittedEntries((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleEditEntry = (
        idx: number,
        entry: Record<string, string | string[] | null>
    ) => {
        setEditingIndex(idx);
        const editData: Record<string, string> = {};
        Object.entries(entry).forEach(([key, value]) => {
            editData[key] = Array.isArray(value)
                ? value.join(", ")
                : value || "";
        });
        setEditValues(editData);
    };

    const handleSaveEdit = (idx: number) => {
        const errors: Record<string, string> = {};
        section.questions.forEach((question) => {
            const fieldName = getFieldName(question.label);
            if (
                question.is_required &&
                (!editValues[fieldName] || editValues[fieldName].trim() === "")
            ) {
                errors[fieldName] = `${question.label} cannot be empty`;
            }
        });

        if (Object.keys(errors).length > 0) {
            Object.entries(errors).forEach(([field, message]) => {
                form.setError(`${field}_${idx + 1}`, {
                    type: "required",
                    message,
                });
            });
            return;
        }

        setCommittedEntries((prev) => {
            const updated = [...prev];
            updated[idx] = {};
            section.questions.forEach((question) => {
                const fieldName = getFieldName(question.label);
                updated[idx][fieldName] =
                    editValues[fieldName]?.trim() ||
                    (question.is_required
                        ? question.field_type === "checkbox"
                            ? []
                            : question.is_repeatable_question &&
                              question.field_type === "textarea"
                            ? [""]
                            : ""
                        : null);
            });
            return updated;
        });
        setEditingIndex(null);
        setEditValues({});
        section.questions.forEach((question) => {
            const fieldName = getFieldName(question.label);
            form.clearErrors(`${fieldName}_${idx + 1}`);
        });
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditValues({});
    };

    if (!section.is_repeatable_section) {
        return <SectionRenderer section={section} form={form} index={index} />;
    }

    return (
        <div className="space-y-4">
            {committedEntries.length > 0 && (
                <div className="space-y-2 overflow-x-auto">
                    <h4 className="text-sm font-medium truncate sm:truncate-none">
                        {section.title} Entries
                    </h4>
                    <Table className="min-w-full border rounded-lg">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs sm:text-sm w-[60px] whitespace-nowrap bg-muted/50">
                                    Serial No
                                </TableHead>
                                {section.questions
                                    .filter(
                                        (question) =>
                                            evaluateVisibilityCondition(
                                                question.visibility_condition,
                                                formValues,
                                                variableMap
                                            ) || question.is_required
                                    )
                                    .map((question) => (
                                        <TableHead
                                            key={
                                                question.id ||
                                                `${section.id}-${getFieldName(
                                                    question.label
                                                )}`
                                            }
                                            className="text-xs sm:text-sm whitespace-nowrap truncate max-w-[150px] bg-muted/50"
                                            title={question.label}
                                        >
                                            {question.label}
                                        </TableHead>
                                    ))}
                                <TableHead className="text-xs sm:text-sm w-[140px] whitespace-nowrap bg-muted/50">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {committedEntries.map((entry, idx) => (
                                <TableRow
                                    key={`${
                                        section.id || "section"
                                    }-entry-${idx}`}
                                >
                                    <TableCell className="text-xs sm:text-sm text-center">
                                        {idx + 1}
                                    </TableCell>
                                    {section.questions
                                        .filter(
                                            (question) =>
                                                evaluateVisibilityCondition(
                                                    question.visibility_condition,
                                                    formValues,
                                                    variableMap
                                                ) || question.is_required
                                        )
                                        .map((question) => {
                                            const fieldName = getFieldName(
                                                question.label
                                            );
                                            const value = entry[fieldName];
                                            return (
                                                <TableCell
                                                    key={`${
                                                        section.id || "section"
                                                    }-${
                                                        question.id ||
                                                        getFieldName(
                                                            question.label
                                                        )
                                                    }`}
                                                    className="text-xs sm:text-sm truncate max-w-[150px] min-w-[100px]"
                                                    title={
                                                        Array.isArray(value)
                                                            ? value.join(", ")
                                                            : value || ""
                                                    }
                                                >
                                                    {editingIndex === idx ? (
                                                        <Input
                                                            value={
                                                                editValues[
                                                                    fieldName
                                                                ] || ""
                                                            }
                                                            onChange={(e) =>
                                                                setEditValues(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [fieldName]:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    })
                                                                )
                                                            }
                                                            className="text-xs sm:text-sm h-8 w-full max-w-[300px] rounded-md"
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key ===
                                                                    "Enter"
                                                                )
                                                                    handleSaveEdit(
                                                                        idx
                                                                    );
                                                                if (
                                                                    e.key ===
                                                                    "Escape"
                                                                )
                                                                    handleCancelEdit();
                                                            }}
                                                        />
                                                    ) : (
                                                        (Array.isArray(value)
                                                            ? value.join(", ")
                                                            : value) ||
                                                        "No value"
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    <TableCell className="text-xs sm:text-sm">
                                        <div className="flex gap-2">
                                            {editingIndex === idx ? (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleSaveEdit(idx)
                                                        }
                                                        className="text-xs sm:text-sm flex items-center gap-1"
                                                    >
                                                        <span className="lg:hidden">
                                                            <Check className="w-4 h-4" />
                                                        </span>
                                                        <span className="hidden lg:block">
                                                            Save
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={
                                                            handleCancelEdit
                                                        }
                                                        className="text-xs sm:text-sm flex items-center gap-1"
                                                    >
                                                        <span className="lg:hidden">
                                                            <X className="w-4 h-4" />
                                                        </span>
                                                        <span className="hidden lg:block">
                                                            Cancel
                                                        </span>
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEditEntry(
                                                                idx,
                                                                entry
                                                            )
                                                        }
                                                        className="text-xs sm:text-sm flex items-center gap-1"
                                                    >
                                                        <span className="lg:hidden">
                                                            <Edit className="w-4 h-4" />
                                                        </span>
                                                        <span className="hidden lg:block">
                                                            Edit
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteEntry(
                                                                idx
                                                            )
                                                        }
                                                        className="text-xs sm:text-sm flex items-center gap-1"
                                                    >
                                                        <span className="lg:hidden">
                                                            <Trash2 className="w-4 h-4" />
                                                        </span>
                                                        <span className="hidden lg:block">
                                                            Delete
                                                        </span>
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
            <div className="space-y-2">
                <SectionRenderer
                    section={{
                        ...section,
                        questions: section.questions.map((q, qIdx) => ({
                            ...q,
                            label: `${q.label}_${committedEntries.length}`,
                            id:
                                q.id ||
                                `${section.id || "section"}-${getFieldName(
                                    q.label
                                )}-${committedEntries.length}-${qIdx}`,
                        })),
                    }}
                    form={form}
                    index={index}
                />
                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddEntry}
                        className="text-xs sm:text-sm capitalize flex items-center gap-1 cursor-pointer"
                    >
                        <span className="lg:hidden">
                            <Plus className="w-4 h-4" />
                        </span>
                        <span className="hidden lg:block">
                            Add Section Entry
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RepeatableSectionWrapper;
