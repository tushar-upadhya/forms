import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { GalleryVerticalEnd } from "lucide-react";
import * as React from "react";

interface Section {
    id: string;
    label: string;
}

interface FormAppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    sections: Section[];
    activeSection: string;
    onSectionChange: (sectionId: string) => void;
}

export function FormAppSidebar({
    sections,
    activeSection,
    onSectionChange,
    ...props
}: FormAppSidebarProps) {
    return (
        <Sidebar variant="floating" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">
                                        Form Sections
                                    </span>
                                    <span className="">v1.0.0</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu
                    className="gap-2"
                    role="navigation"
                    aria-label="Form section navigation"
                >
                    {sections.map((section) => (
                        <SidebarMenuItem key={section.id}>
                            <SidebarMenuButton
                                asChild
                                isActive={activeSection === section.id}
                                onClick={() => onSectionChange(section.id)}
                                className={`font-medium ${
                                    activeSection === section.id
                                        ? "bg-sidebar-primary font-medium text-sidebar-primary-foreground"
                                        : "hover:bg-sidebar-accent"
                                }`}
                                aria-current={
                                    activeSection === section.id
                                        ? "page"
                                        : undefined
                                }
                            >
                                <a href="#" className="p-4 py-6">
                                    {section.label}
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}
