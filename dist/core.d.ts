import { a as LinkProps, g as RouterProviderProps, f as RouterLocation, N as NavigateFn, d as RouteParams } from './types-DvzlhMRY.js';
export { L as LayoutProps, b as NavigateOptions, R as Route, e as RouterContextType } from './types-DvzlhMRY.js';
import * as react_jsx_runtime from 'react/jsx-runtime';
import 'react';

declare function RouterProvider({ routes, children, notFound, basename, layout: Layout }: RouterProviderProps): react_jsx_runtime.JSX.Element;
declare const Link: ({ to, children, className, onClick, ...rest }: LinkProps) => react_jsx_runtime.JSX.Element;
declare const useNavigate: () => NavigateFn;
declare const useLocation: () => RouterLocation;
declare const useParams: <T extends RouteParams = RouteParams>() => T;

export { Link, LinkProps, NavigateFn, RouteParams, RouterLocation, RouterProvider, RouterProviderProps, useLocation, useNavigate, useParams };
