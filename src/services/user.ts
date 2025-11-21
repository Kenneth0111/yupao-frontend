import myAxios from "../plugins/myAxios.ts";
import {getCurrentUserState, setCurrentUserState} from "../states/user.ts";
import type { UserType } from '../models/user.d.ts';

export const getCurrentUser = async () => {
    const currentUser = getCurrentUserState();
    if (currentUser) {
        return currentUser;
    }
    // 不存在则从远程获取
    const res = await myAxios.get<{ code: number; data: UserType }>('/user/current');
    if (res.data.code === 0) {
        setCurrentUserState(res.data.data);
        return res.data.data;
    }
    return null;
}