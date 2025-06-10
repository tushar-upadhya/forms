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
import type { FormValues, Question } from "@/lib/types";
import { getFieldName } from "@/lib/types";
import clsx from "clsx";
import { Check, Edit, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";

interface RepeatableFieldWrapperProps {
    question: Question;
    form: UseFormReturn<FormValues>;
    FieldComponent: React.ComponentType<{
        question: Question;
        form: UseFormReturn<FormValues>;
        fieldName?: string;
    }>;
}

const RepeatableQuestionWrapper = ({
    question,
    form,
    FieldComponent,
}: RepeatableFieldWrapperProps) => {
    const baseFieldName = getFieldName(question.label);
    const [committedValues, setCommittedValues] = useState<(string | null)[]>(
        []
    );
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>("");

    const handleAddField = () => {
        const inputName = `${baseFieldName}_0`;
        const rawValue = form.getValues(inputName);
        const value =
            typeof rawValue === "string"
                ? rawValue.trim()
                : Array.isArray(rawValue)
                ? rawValue.join(", ").trim()
                : "";

        if (!value) return;

        setCommittedValues((prev) => [...prev, value]);
        form.setValue(inputName, "");
    };

    const handleDeleteField = (index: number) => {
        setCommittedValues((prev) => prev.filter((_, i) => i !== index));
    };

    const handleEditField = (index: number, value: string | string[]) => {
        setEditingIndex(index);
        setEditValue(Array.isArray(value) ? value.join(", ") : value || "");
    };

    const handleSaveEdit = (index: number) => {
        setCommittedValues((prev) => {
            const updated = [...prev];
            updated[index] = editValue.trim() || null;
            return updated;
        });
        setEditingIndex(null);
        setEditValue("");
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditValue("");
    };

    if (!question.is_repeatable_question) {
        return <FieldComponent question={question} form={form} />;
    }

    return (
        <div className="space-y-4">
            {committedValues.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                        {question.label} Values
                    </h4>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs sm:text-sm w-[60px]">
                                    Serial No
                                </TableHead>
                                <TableHead className="text-xs sm:text-sm">
                                    Value
                                </TableHead>
                                <TableHead className="text-xs sm:text-sm w-[140px]">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {committedValues.map((value, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="text-xs sm:text-sm text-center">
                                        {idx + 1}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        {editingIndex === idx ? (
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={editValue}
                                                    onChange={(e) =>
                                                        setEditValue(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="text-xs sm:text-sm h-8"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter")
                                                            handleSaveEdit(idx);
                                                        if (e.key === "Escape")
                                                            handleCancelEdit();
                                                    }}
                                                />
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
                                                    onClick={handleCancelEdit}
                                                    className="text-xs sm:text-sm flex items-center gap-1"
                                                >
                                                    <span className="lg:hidden">
                                                        <X className="w-4 h-4" />
                                                    </span>
                                                    <span className="hidden lg:block">
                                                        Cancel
                                                    </span>
                                                </Button>
                                            </div>
                                        ) : (
                                            value || "No value entered"
                                        )}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleEditField(
                                                        idx,
                                                        committedValues[idx] ??
                                                            ""
                                                    )
                                                }
                                                className={clsx(
                                                    "text-xs sm:text-sm flex items-center gap-1",
                                                    {
                                                        "cursor-not-allowed opacity-50":
                                                            editingIndex ===
                                                            idx,
                                                    }
                                                )}
                                                disabled={editingIndex === idx}
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
                                                    handleDeleteField(idx)
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
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <div className="space-y-2">
                <FieldComponent
                    question={question}
                    form={form}
                    fieldName={`${baseFieldName}_0`}
                />
                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddField}
                        className="text-xs sm:text-sm capitalize flex items-center gap-1"
                    >
                        <span className="lg:hidden">
                            <Plus className="w-4 h-4" />
                        </span>
                        <span className="hidden lg:block">Add Commit</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RepeatableQuestionWrapper;
