import {User} from '@/service/api';
import {LoginParams, LoginResult} from './typings'
import {post, get} from './http'
import {UserInfo} from '@/hooks';

export function login(params: LoginParams): Promise<LoginResult> {
    return post<LoginResult>(User.Login, params);
}

export function getUserInfo(): Promise<UserInfo> {
    return get<UserInfo>(User.Info);
}
