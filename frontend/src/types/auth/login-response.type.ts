import {TokensType} from "./tokens.type";
import {UserInfoType} from "../user-info.type";

export type LoginResponseType = {
    tokens: TokensType,
    user: UserInfoType,
}