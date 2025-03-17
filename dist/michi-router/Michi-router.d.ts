import React from 'react';
import type { RouterContextType, RouterProviderProps, LinkProps, LayoutProps } from './types';
declare const RouterContext: React.Context<RouterContextType>;
export declare function RouterProvider({ routes, children, layout: Layout }: RouterProviderProps & {
    layout?: LayoutProps;
}): React.JSX.Element;
export declare const Link: ({ to, children, className }: LinkProps) => React.JSX.Element;
export declare const useNavigate: () => (to: string) => void;
export { RouterContext };
