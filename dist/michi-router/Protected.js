"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var Michi_router_1 = require("./Michi-router");
/**
 * Un componente que restringe el acceso a sus hijos según el estado de autenticación del usuario.
 *
 * Si el usuario no está autenticado, redirige a la página de landing ("/").
 * De lo contrario, renderiza sus hijos.
 *
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Los nodos React a renderizar si el usuario está autenticado.
 * @returns {JSX.Element|null} Los hijos si está autenticado, de lo contrario loader.
 */
function Protected(_a) {
    var _b;
    var children = _a.children, configObject = _a.configObject;
    var navigate = (0, Michi_router_1.useNavigate)();
    var config = {
        states: (configObject === null || configObject === void 0 ? void 0 : configObject.states) || null,
        redirectionPath: (configObject === null || configObject === void 0 ? void 0 : configObject.redirectionPath) || "/",
        loadingComponent: (configObject === null || configObject === void 0 ? void 0 : configObject.loadingComponent) || null,
        defaultMessage: (_b = configObject === null || configObject === void 0 ? void 0 : configObject.defaultMessage) !== null && _b !== void 0 ? _b : true, // Mensaje por defecto si no se provee loadingComponent
    };
    if (!config.states) {
        console.error("Protected component: 'states' is required in configObject.");
        return null;
    }
    // Leemos el estado directamente desde el store
    var _c = config.states, user = _c.user, isLoading = _c.isLoading;
    (0, react_1.useEffect)(function () {
        // Redirigir solo cuando haya terminado de cargar y el usuario NO esté autenticado
        if (!isLoading && !user) {
            navigate(config.redirectionPath);
        }
    }, [isLoading, user, navigate, config.redirectionPath]);
    // Mientras carga, mostrar loadingComponent si está definido, si no y defaultMessage true mostrar texto
    if (isLoading) {
        if (config.loadingComponent)
            return config.loadingComponent;
        return config.defaultMessage ? react_1.default.createElement("div", null, "Cargando...") : null;
    }
    return user ? children : null;
}
exports.default = Protected;
