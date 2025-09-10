"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterContext = exports.useNavigate = exports.Link = exports.RouterProvider = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
// Creación del contexto con un valor inicial
var RouterContext = (0, react_1.createContext)({
    path: window.location.pathname,
    navigate: function () {
        console.warn('RouterContext usado fuera de RouterProvider');
    }
});
exports.RouterContext = RouterContext;
/**
 * Proveedor principal del enrutador.
 * @param routes - Array de rutas disponibles
 * @param children - Contenido a mostrar cuando no hay coincidencia de ruta (404)
 * @param layout - Componente de layout opcional para envolver todas las rutas
 */
function RouterProvider(_a) {
    var routes = _a.routes, children = _a.children, Layout = _a.layout;
    var _b = (0, react_1.useState)(window.location.pathname), path = _b[0], setPath = _b[1];
    (0, react_1.useEffect)(function () {
        var handlePopState = function () { return setPath(window.location.pathname); };
        window.addEventListener('popstate', handlePopState);
        return function () { return window.removeEventListener('popstate', handlePopState); };
    }, []);
    var navigate = (0, react_1.useCallback)(function (to) {
        window.history.pushState({}, '', to);
        setPath(to);
    }, []);
    // Encontrar la ruta actual
    var currentRoute = routes.find(function (route) { return route.path === path; });
    var routeContent = currentRoute ? currentRoute.component : children;
    try {
        return ((0, jsx_runtime_1.jsx)(RouterContext.Provider, __assign({ value: { path: path, navigate: navigate } }, { children: Layout ? ((0, jsx_runtime_1.jsx)(Layout, { children: routeContent })) : (routeContent) })));
    }
    catch (error) {
        console.error('Error en RouterProvider:', error);
        return (0, jsx_runtime_1.jsx)("div", { children: "Error en el enrutador. Consulta la consola para m\u00E1s detalles." });
    }
}
exports.RouterProvider = RouterProvider;
/**
 * Componente Link para navegación declarativa.
 * Previene la recarga de página y utiliza el historial del navegador.
 */
var Link = function (_a) {
    var to = _a.to, children = _a.children, className = _a.className, rest = __rest(_a, ["to", "children", "className"]);
    var navigate = (0, react_1.useContext)(RouterContext).navigate;
    return ((0, jsx_runtime_1.jsx)("a", __assign({ href: to, className: className, onClick: function (e) {
            e.preventDefault();
            navigate(to);
        } }, rest, { children: children })));
};
exports.Link = Link;
/**
 * Hook para acceder a la función de navegación programática.
 * @returns Función navigate que permite cambiar de ruta
 */
var useNavigate = function () {
    var navigate = (0, react_1.useContext)(RouterContext).navigate;
    return navigate;
};
exports.useNavigate = useNavigate;
