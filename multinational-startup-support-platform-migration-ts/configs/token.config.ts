import { TOKEN } from "../constants/env.constant";

import tokenHelper from "../helpers/token.helper";
const accessToken = new tokenHelper(TOKEN.ACCESS_SECRET);
const refreshToken = new tokenHelper(TOKEN.REFRESH_SECRET);
export { accessToken, refreshToken };
