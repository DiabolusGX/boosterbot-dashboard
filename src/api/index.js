import axios from "axios";

const API = axios.create();

// Auth routes
export const authCheck = () => API.get("/api/v1/auth/check");
export const logout = () => API.get("/api/v1/auth/logout");

// Stats routes
export const getStats = () => API.get("/api/v1/stats");

// User routes
export const getAllUserGuilds = () => API.get("/api/v1/user/allguilds");

// Bot routes
export const getAllBotGuildIds = () => API.get("/api/v1/bot/allguildids");
export const updatePrefix = (guildId, prefix) => API.patch(`/api/v1/bot/prefix/${guildId}`, { prefix });
export const updateBotNickname = (guildId, nickname) => API.patch(`/api/v1/bot/nickname/${guildId}`, { nickname });

// Guild routes
export const getGuildData = (guildId) => API.get(`/api/v1/guild/data/${guildId}`);
export const getGuildConfig = (guildId) => API.get(`/api/v1/guild/config/${guildId}`);
export const updateGuildConfig = (guildId, data) => API.patch(`/api/v1/guild/general/config/${guildId}`, data);
export const updateGreetConfig = (guildId, data) => API.patch(`/api/v1/guild/greet/config/${guildId}`, data);
export const updateGuildSystemChannel = (guildId, channelId) => API.patch(`/api/v1/guild/systemchannel/${guildId}`, { channelId });
export const updateGuildSystemChannelFlags = (guildId, flags) => API.patch(`/api/v1/guild/systemchannelflags/${guildId}`, { flags });