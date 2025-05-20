import { cn } from "@/lib/utils";

interface BentoGridProps {
    className?: string;
    side: "left" | "right";
}

export function BentoGrid({ className, side }: BentoGridProps) {
    const cards = [
        { id: 1, size: "col-span-1 row-span-2", content: "Dashboard Overview" },
        { id: 2, size: "col-span-1 row-span-2", content: "Recent Activity" },
        { id: 3, size: "col-span-1 row-span-1", content: "Quick Stats" },
        { id: 4, size: "col-span-2 row-span-2", content: "Patient Summary" },
        { id: 5, size: "col-span-1 row-span-1", content: "Notifications" },
    ];

    return (
        <div className={cn("grid grid-cols-2 gap-2 p-2", className)}>
            {cards.map((card) => (
                <div
                    key={`${side}-${card.id}`}
                    className={cn(
                        "bg-card text-card-foreground rounded-md border border-border p-4 flex items-center justify-center text-center text-sm sm:text-base shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring",
                        card.size
                    )}
                    tabIndex={0}
                    role="region"
                    aria-label={`${side} bento card ${card.content}`}
                >
                    {side === "left"
                        ? `Left: ${card.content}`
                        : `Right: ${card.content}`}
                </div>
            ))}
        </div>
    );
}
