import React from 'react';
import type { RouterContextType, RouterProviderProps, LinkProps } from './types';
declare const RouterContext: React.Context<RouterContextType>;
export declare function RouterProvider({ routes, children, layout: Layout }: RouterProviderProps & {
    layout?: React.ComponentType<{
        children: React.ReactNode;
    }>;
}): React.JSX.Element;
export declare const Link: ({ to, children, className }: LinkProps) => React.JSX.Element;
export declare const useNavigate: () => (to: string) => void;
export { RouterContext };
