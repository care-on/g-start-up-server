import { Request, Response, NextFunction } from "express";
import passwordEncoder from "../configs/password-encoder.config";
import { accessToken, refreshToken } from "../configs/token.config";
import userService from "../services/user.service";
import { User, UserIncludedUid, UserPayload } from "../types/user.type.";
import { redis } from "../configs/redis.config";
import logger from "../configs/logger.config";

class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const user: UserIncludedUid = await userService.readOneByEmail(email);
      if (!(await passwordEncoder.compare(password, user.password))) {
        throw new Error("not matched user password");
      }

      const payload: UserPayload = {
        uid: user.uid,
        username: user.username,
        email: user.email,
      };

      const issuedAccessToken = await accessToken.generateToken(payload, "30m");
      const issuedRefreshToken = await refreshToken.generateToken(
        payload,
        "90h"
      );
      const expirationTimeInSeconds = 90 * 60 * 60; // 90시간을 초로 변환

      // Redis에 토큰을 저장하고 만료 시간을 설정합니다.
      redis.set(user.uid as any, issuedRefreshToken, (err, reply) => {
        if (err) {
          logger.error("Error occurred while setting token in Redis:", err);
          // 에러 처리 코드를 작성합니다.
        } else {
          logger.info("Token stored in Redis successfully:", reply);
          // 토큰이 성공적으로 저장되었을 때 실행할 코드를 작성합니다.

          // Redis에 만료 시간을 설정합니다.
          redis.expire(
            user.uid as any,
            expirationTimeInSeconds,
            (err, reply) => {
              if (err) {
                logger.error(
                  "Error occurred while setting expiration time:",
                  err
                );
                // 에러 처리 코드를 작성합니다.
              } else {
                logger.info("Expiration time set successfully:", reply);
                // 만료 시간이 성공적으로 설정되었을 때 실행할 코드를 작성합니다.
              }
            }
          );
        }
      });
      res.status(201).json({
        accessToken: issuedAccessToken,
        refreshToken: issuedRefreshToken,
      });
    } catch (error) {
      next(error);
    }
  }
  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token } = req.body;
      await refreshToken.verifyToken(token);
      const decodedPayload: UserPayload = await refreshToken.decodeToken(token);
      const payload: UserPayload = {
        username: decodedPayload.username,
        uid: decodedPayload.uid,
        email: decodedPayload.email,
      };
      redis.get(payload.uid as any, async (err, result) => {
        if ((token as string) !== (result as string)) {
          throw new Error("invalid");
        }
        const issuedAccessToken = await accessToken.generateToken(
          payload,
          "30m"
        );
        const issuedRefreshToken = await refreshToken.generateToken(
          payload,
          "90h"
        );
        const expirationTimeInSeconds = 90 * 60 * 60; // 90시간을 초로 변환

        // Redis에 토큰을 저장하고 만료 시간을 설정합니다.
        redis.set(payload.uid as any, issuedRefreshToken, (err, reply) => {
          if (err) {
            logger.error("Error occurred while setting token in Redis:", err);
            // 에러 처리 코드를 작성합니다.
          } else {
            logger.info("Token stored in Redis successfully:", reply);
            // 토큰이 성공적으로 저장되었을 때 실행할 코드를 작성합니다.

            // Redis에 만료 시간을 설정합니다.
            redis.expire(
              payload.uid as any,
              expirationTimeInSeconds,
              (err, reply) => {
                if (err) {
                  logger.error(
                    "Error occurred while setting expiration time:",
                    err
                  );
                  // 에러 처리 코드를 작성합니다.
                } else {
                  logger.info("Expiration time set successfully:", reply);
                  // 만료 시간이 성공적으로 설정되었을 때 실행할 코드를 작성합니다.
                }
              }
            );
          }
        });

        res.status(201).json({
          accessToken: issuedAccessToken,
          refreshToken: issuedRefreshToken,
        });
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
