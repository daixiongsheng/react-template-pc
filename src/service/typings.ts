import {UserInfo} from '@/hooks';


export interface LoginParams {
    username: string;
    password: string;
}
export interface LoginResult {
    success: boolean;
    userInfo: UserInfo;
    token: string;
}
