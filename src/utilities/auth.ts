import {jwtDecode} from "jwt-decode";


const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const EMAIL_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
const AUTH_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        if (Date.now() >= exp * 1000) {
            localStorage.removeItem("token");
            return false;
        }
        return true;
    } catch {
        return false;
    }
};

export const getUserRole = (): string | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode<any>(token);
        return decoded[ROLE_CLAIM];
    } catch {
        return null;
    }
};
export const getUserId = (): string | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode<any>(token);
        return decoded[AUTH_CLAIM];
    } catch {
        return null;
    }
};

export const getUserEmail = (): string | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode<any>(token);
        return decoded[EMAIL_CLAIM];
    } catch {
        return null;
    }
};
