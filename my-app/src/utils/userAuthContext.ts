import {createContext, useContext} from "react";
import {UserAuth} from "user";

export const userAuthDetailsContext = createContext<{authUser: UserAuth, handleLogin: (user: UserAuth) => void;} | undefined>(undefined)

export function useUserAuthDetailsContext() {
    const user = useContext(userAuthDetailsContext);

    if (user === undefined) {
        throw new Error("useUserAuthDetailsContext must be used with context")
    }

    return user;
}