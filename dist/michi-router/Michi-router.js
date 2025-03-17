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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var react_1 = __importStar(require("react"));
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
        return (react_1.default.createElement(RouterContext.Provider, { value: { path: path, navigate: navigate } }, Layout ? (react_1.default.createElement(Layout, null, routeContent)) : (routeContent)));
    }
    catch (error) {
        console.error('Error en RouterProvider:', error);
        return react_1.default.createElement("div", null, "Error en el enrutador. Consulta la consola para m\u00E1s detalles.");
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
    return (react_1.default.createElement("a", __assign({ href: to, className: className, onClick: function (e) {
            e.preventDefault();
            navigate(to);
        } }, rest), children));
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
