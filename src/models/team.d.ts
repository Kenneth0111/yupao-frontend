import type {UserType} from "./user";

/**
 * 队伍类别
 */
export type TeamType = {
    id: number;
    name: string;
    description: string;
    expireTime: Date;
    maxNum: number;
    userId: number;
    password?: string;
    status: number;
    createTime: Date;
    updateTime: Date;
    createUser?: UserType;
    hasJoin: boolean;
    hasJoinNum: number;
}