import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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

export default function RepeatableFieldWrapper({
    question,
    form,
    FieldComponent,
}: RepeatableFieldWrapperProps) {
    const baseFieldName = getFieldName(question.label);
    const [fieldCount, setFieldCount] = useState(1);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>("");

    const handleAddField = () => {
        setFieldCount((prev) => prev + 1);
        setIsPopoverOpen(false);
    };

    const handleDeleteField = (index: number) => {
        if (fieldCount <= 1) return; // Prevent deleting the last field
        const newFieldCount = fieldCount - 1;
        const fieldNames = Array.from({ length: fieldCount }).map(
            (_, i) => `${baseFieldName}_${i}`
        );
        const values = form.getValues(fieldNames);
        const newValues = values
            .filter((_, i) => i !== index)
            .map((value) => value || "");
        fieldNames.forEach((name) => form.unregister(name));
        newValues.forEach((value, i) =>
            form.setValue(`${baseFieldName}_${i}`, value)
        );
        setFieldCount(newFieldCount);
    };

    const handleEditField = (index: number, value: string | string[]) => {
        setEditingIndex(index);
        setEditValue(Array.isArray(value) ? value.join(", ") : value || "");
    };

    const handleSaveEdit = (index: number) => {
        form.setValue(`${baseFieldName}_${index}`, editValue);
        setEditingIndex(null);
        setEditValue("");
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditValue("");
    };

    const fieldValues = form.watch(
        Array.from({ length: fieldCount }).map(
            (_, index) => `${baseFieldName}_${index}`
        )
    );

    const tableData = fieldValues.map((value, index) => ({
        instance: index + 1,
        value: Array.isArray(value)
            ? value.join(", ")
            : value || "No value entered",
    }));

    if (!question.is_repeatable_question) {
        return <FieldComponent question={question} form={form} />;
    }

    return (
        <div className="space-y-4">
            {Array.from({ length: fieldCount }).map((_, index) => (
                <div key={`${baseFieldName}-${index}`} className="space-y-2">
                    <FieldComponent
                        question={question}
                        form={form}
                        fieldName={`${baseFieldName}_${index}`}
                    />
                    {index === fieldCount - 1 && (
                        <div className="flex justify-end w-full">
                            <Popover
                                open={isPopoverOpen}
                                onOpenChange={setIsPopoverOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="text-xs sm:text-sm capitalize"
                                    >
                                        Add question
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] sm:w-[500px] p-4">
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-medium">
                                            {question.label} Values
                                        </h4>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="text-xs sm:text-sm w-[60px]">
                                                        Instance
                                                    </TableHead>
                                                    <TableHead className="text-xs sm:text-sm">
                                                        Value
                                                    </TableHead>
                                                    <TableHead className="text-xs sm:text-sm w-[120px]">
                                                        Actions
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {tableData.length > 0 ? (
                                                    tableData.map(
                                                        (row, idx) => (
                                                            <TableRow key={idx}>
                                                                <TableCell className="text-xs sm:text-sm">
                                                                    {
                                                                        row.instance
                                                                    }
                                                                </TableCell>
                                                                <TableCell className="text-xs sm:text-sm">
                                                                    {editingIndex ===
                                                                    idx ? (
                                                                        <div className="flex items-center gap-2">
                                                                            <Input
                                                                                value={
                                                                                    editValue
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    setEditValue(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                                className="text-xs sm:text-sm h-8"
                                                                                onKeyDown={(
                                                                                    e
                                                                                ) => {
                                                                                    if (
                                                                                        e.key ===
                                                                                        "Enter"
                                                                                    ) {
                                                                                        handleSaveEdit(
                                                                                            idx
                                                                                        );
                                                                                    } else if (
                                                                                        e.key ===
                                                                                        "Escape"
                                                                                    ) {
                                                                                        handleCancelEdit();
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleSaveEdit(
                                                                                        idx
                                                                                    )
                                                                                }
                                                                                className="text-xs sm:text-sm"
                                                                            >
                                                                                Save
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={
                                                                                    handleCancelEdit
                                                                                }
                                                                                className="text-xs sm:text-sm"
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                        </div>
                                                                    ) : (
                                                                        row.value
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
                                                                                    fieldValues[
                                                                                        idx
                                                                                    ] ??
                                                                                        ""
                                                                                )
                                                                            }
                                                                            className="text-xs sm:text-sm"
                                                                            disabled={
                                                                                editingIndex ===
                                                                                idx
                                                                            }
                                                                        >
                                                                            Edit
                                                                        </Button>
                                                                        <Button
                                                                            variant="destructive"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleDeleteField(
                                                                                    idx
                                                                                )
                                                                            }
                                                                            className="text-xs sm:text-sm"
                                                                            disabled={
                                                                                fieldCount ===
                                                                                1
                                                                            }
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )
                                                ) : (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={3}
                                                            className="text-xs sm:text-sm text-center"
                                                        >
                                                            No values entered
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleAddField}
                                            className="w-full text-xs sm:text-sm capitalize"
                                        >
                                            Confirm Add
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
