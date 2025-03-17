import { ReactNode } from "react";
export interface Route {
    path: string;
    component: ReactNode;
}
export interface RouterContextType {
    path: string;
    navigate: (to: string) => void;
}
export interface RouterProviderProps {
    routes: Array<{
        path: string;
        component: React.ReactNode;
    }>;
    children?: React.ReactNode;
    layout?: React.ComponentType<{
        children: React.ReactNode;
    }>;
}
export interface LinkProps {
    to: string;
    children: ReactNode;
    className?: string;
}
