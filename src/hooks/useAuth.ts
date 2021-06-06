import React, {createContext, useContext, useEffect, useState} from 'react';
import {LoginParams} from '@/service/typings';
import {login as loginRequest, getUserInfo} from '@/service';
import {local} from '@/storage';

const authContext = createContext<AuthContext>({} as AuthContext);

export const ProvideAuth: React.FC = ({children}) => {
    const value = useProvideAuth();
    if(value.loading) {
        return React.createElement(React.Suspense, {fallback: 'loading'}, null)
    }
    return React.createElement(authContext.Provider, {value}, children);
};

export interface UserInfo {
    username: string;
}

export interface AuthContext {
    user: UserInfo | null;
    login: (params: LoginParams & { callback: (success: boolean) => void }) => void;
    logout: (callback: Function) => void;
}

export function useAuth(): AuthContext {
    return useContext(authContext);
}


export function useProvideAuth() {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const login = ({username, password, callback}: LoginParams & { callback: (success: boolean) => void }) => {
        loginRequest({username, password}).then(res => {
            if (res.success) {
                local.set('token', res.token);
                setUser(res.userInfo);
            }
            callback(res.success);
        }).catch(() => callback(false));
    };

    const logout = (callback: Function) => {
        callback();
    };

    // @ts-ignore
    useEffect(async () => {
        if (local.has('token')) {
            try {
                const user = await getUserInfo();
                setUser(user);
            }
            catch {
            }
            finally {
                setLoading(false);
            }
        }
        else {
            setUser(null);
            setLoading(false);
        }
    }, []);

    return {
        user,
        login,
        logout,
        loading,
    };
}

