import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import AiChatbot from '@/components/ai-chatbot/AiChatbot';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <>
            <AppLayoutTemplate breadcrumbs={breadcrumbs}>
                {children}
            </AppLayoutTemplate>
            <AiChatbot />
        </>
    );
}
