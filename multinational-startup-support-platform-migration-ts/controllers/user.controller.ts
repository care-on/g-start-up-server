// const logger = require("../config/logger.config");
// const mailBody = require("../config/mail-body.config");
import { NextFunction, Request, Response } from "express";
import logger from "../configs/logger.config";
import { User, UserProfileDefault } from "../types/user.type.";
import passwordEncoder from "../configs/password-encoder.config";
import userService from "../services/user.service";
// const mailHelper = require("../helpers/mail.helper");
// const { User, Profile } = require("../models/user.model");
// const userService = require("../services/user.service");

class UserController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password } = req.body;
      const { birthdate, nationality, region, tel, interests, role } = req.body;

      //TODO: USER's Profile
      const encodedPassword: string = await passwordEncoder.encode(password);
      console.log(encodedPassword);
      const newUser: User = {
        username: username,
        email: email,
        password: encodedPassword,
      };
      const newProfile: UserProfileDefault = {
        birthdate: birthdate,
        nationality: nationality,
        region: region,
        tel: tel,
        interests: interests,
        role: role,
      };
      await userService.create(newUser, newProfile);

      //   // mailHelper.send(
      //   //   email,
      //   //   mailBody.welcome.subject(username),
      //   //   mailBody.welcome.html(username)
      //   // );
      res.status(201).json({ message: "User created successfully." });
    } catch (error) {
      next(error);
    }
  }

  async read(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.user;
      const users = await userService.readProfileByUid(uid);
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  // async update(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { uid } = req.query;
  //     const { birthdate, nationality, region, tel, interests, role } = req.body;
  //     if (req.user.uid !== Number(uid)) throw new Error("not Matched User");
  //     const updatedProfiles = new Profile(
  //       birthdate,
  //       nationality,
  //       region,
  //       tel,
  //       interests,
  //       role
  //     );
  //     updatedProfiles.setUid(Number(uid));
  //     await userService.update(updatedProfiles);
  //     res.status(201).json({ message: "User updated successfully." });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // async delete(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { uid } = req.query;
  //     if (req.user.uid !== Number(uid)) throw new Error("not Matched User");

  //     userService.delete(Number(uid));
  //     res.status(201).json({ message: "User deleted successfully." });
  //   } catch (error) {
  //     next(error);
  //   }
}

export default new UserController();
