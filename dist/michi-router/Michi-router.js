"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterContext = exports.useNavigate = exports.Link = exports.RouterProvider = void 0;
var react_1 = __importDefault(require("react"));
var react_2 = require("react");
// Creación del contexto con un valor inicial
var RouterContext = (0, react_2.createContext)({
    path: '',
    navigate: function () { }
});
exports.RouterContext = RouterContext;
function RouterProvider(_a) {
    var routes = _a.routes, children = _a.children, Layout = _a.layout;
    var _b = (0, react_2.useState)(window.location.pathname), path = _b[0], setPath = _b[1];
    (0, react_2.useEffect)(function () {
        var handlePopState = function () { return setPath(window.location.pathname); };
        window.addEventListener('popstate', handlePopState);
        return function () { return window.removeEventListener('popstate', handlePopState); };
    }, []);
    var navigate = function (to) {
        window.history.pushState({}, '', to);
        setPath(to);
    };
    var currentRoute = routes.find(function (route) { return route.path === path; });
    var routeContent = currentRoute ? currentRoute.component : children;
    return (react_1.default.createElement(RouterContext.Provider, { value: { path: path, navigate: navigate } }, Layout ? (react_1.default.createElement(Layout, null, routeContent)) : (routeContent)));
}
exports.RouterProvider = RouterProvider;
var Link = function (_a) {
    var to = _a.to, children = _a.children, className = _a.className;
    var navigate = (0, react_2.useContext)(RouterContext).navigate;
    return (react_1.default.createElement("a", { href: to, className: className, style: { marginRight: '1rem' }, onClick: function (e) {
            e.preventDefault();
            navigate(to);
        } }, children));
};
exports.Link = Link;
var useNavigate = function () {
    var navigate = (0, react_2.useContext)(RouterContext).navigate;
    return navigate;
};
exports.useNavigate = useNavigate;
