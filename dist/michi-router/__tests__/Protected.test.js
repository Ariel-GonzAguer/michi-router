"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_2 = require("@testing-library/react");
require("@testing-library/jest-dom");
var vitest_1 = require("vitest");
// mock useNavigate from Michi-router
var mockNavigate = vitest_1.vi.fn();
vitest_1.vi.mock('../Michi-router', function () { return ({
    useNavigate: function () { return mockNavigate; },
}); });
var Protected_1 = __importDefault(require("../Protected"));
describe('Protected component', function () {
    beforeEach(function () {
        mockNavigate.mockClear();
    });
    it('muestra loadingComponent cuando isLoading true', function () {
        var auth = { user: null, isLoading: true };
        (0, react_2.render)(react_1.default.createElement(Protected_1.default, { configObject: { states: auth, loadingComponent: react_1.default.createElement("div", null, "Loading..."), redirectionPath: '/' } },
            react_1.default.createElement("div", null, "Private")));
        expect(react_2.screen.getByText('Loading...')).toBeDefined();
    });
    it('redirige cuando isLoading false y no hay user', function () {
        var auth = { user: null, isLoading: false };
        (0, react_2.render)(react_1.default.createElement(Protected_1.default, { configObject: { states: auth, redirectionPath: '/login' } },
            react_1.default.createElement("div", null, "Private")));
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
    it('renderiza los hijos cuando hay user', function () {
        var auth = { user: { name: 'A' }, isLoading: false };
        (0, react_2.render)(react_1.default.createElement(Protected_1.default, { configObject: { states: auth, redirectionPath: '/' } },
            react_1.default.createElement("div", null, "PrivateContent")));
        expect(react_2.screen.getByText('PrivateContent')).toBeDefined();
    });
});
