import { storeRefreshToken } from "../repositories/redisRepository.js";
export async function storeSession(refreshToken,userId){
    return await storeRefreshToken(refreshToken,userId);
}