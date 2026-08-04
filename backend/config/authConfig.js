import dotenv from 'dotenv';
dotenv.config();

export const AuthConfig = {
  accessTokenExpiry: process.env.JWT_ACCESS_EXPIRES_IN,
  refreshTokenTTL: 7 * 24 * 60 * 60,
  verificationTokenTTL: 5 * 60 * 60,

  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  },
};
