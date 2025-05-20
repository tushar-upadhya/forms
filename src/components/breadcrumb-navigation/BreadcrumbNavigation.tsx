import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useCallback, useLayoutEffect, useMemo, useRef } from "react";

interface Section {
    id: string;
    label: string;
}

interface BreadcrumbNavigationProps {
    sections: Section[];
    activeSection: string;
    onSectionChange: (sectionId: string) => void;
}

export function BreadcrumbNavigation({
    sections,
    activeSection,
    onSectionChange,
}: BreadcrumbNavigationProps) {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                const index = sections.findIndex(
                    (section) => section.id === activeSection
                );
                let newIndex = index;
                if (e.key === "ArrowLeft" && index > 0) {
                    newIndex = index - 1;
                } else if (
                    e.key === "ArrowRight" &&
                    index < sections.length - 1
                ) {
                    newIndex = index + 1;
                }
                if (newIndex !== index) {
                    onSectionChange(sections[newIndex].id);
                }
            }
        },
        [activeSection, sections, onSectionChange]
    );

    useLayoutEffect(() => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            const index = sections.findIndex(
                (section) => section.id === activeSection
            );
            const item = itemRefs.current[index];
            const scrollArea = scrollAreaRef.current;

            if (item && scrollArea) {
                const itemRect = item.getBoundingClientRect();
                const scrollAreaRect = scrollArea.getBoundingClientRect();
                const scrollLeft =
                    item.offsetLeft +
                    itemRect.width / 2 -
                    scrollAreaRect.width / 2;

                scrollArea.scrollTo({
                    left: Math.max(0, scrollLeft),
                    behavior: "smooth",
                });
            }
        }, 100);

        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [activeSection]);

    const breadcrumbItems = useMemo(
        () =>
            sections.map((section, index) => (
                <BreadcrumbItem
                    key={`${section.id}-${index}`}
                    ref={(el) => {
                        itemRefs.current[index] = el;
                    }}
                    className="shrink-0"
                >
                    <BreadcrumbLink
                        onClick={() => onSectionChange(section.id)}
                        className={`cursor-pointer whitespace-nowrap px-3 py-1 text-sm sm:text-base ${
                            activeSection === section.id
                                ? "bg-primary/10 font-medium text-primary rounded-full outline-offset-2"
                                : "text-primary hover:text-primary/80"
                        }`}
                        aria-current={
                            activeSection === section.id ? "page" : undefined
                        }
                    >
                        {section.label}
                    </BreadcrumbLink>
                    {index < sections.length - 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
            )),
        [activeSection, sections, onSectionChange]
    );

    return (
        <Breadcrumb
            className="mb-6"
            role="navigation"
            aria-label="Breadcrumb navigation"
        >
            <div className="scroll-area-wrapper">
                <ScrollArea
                    className="w-full "
                    ref={scrollAreaRef}
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                >
                    <BreadcrumbList className="flex w-max space-x-4 p-4 min-w-[1200px]">
                        {breadcrumbItems}
                    </BreadcrumbList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </Breadcrumb>
    );
}
