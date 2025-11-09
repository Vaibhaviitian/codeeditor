import { Router } from "express";
import {
  checking_token,
  LoginUser,
  RegisterUser,
  checkingotp,
  generateandsetOTP,
  generatingtoken,
  fetchUserData,
  savecode,
  fetchmyCode,
  forgotpassword,
  updatepassword,
} from "../controller/user.controller.js";

import {
  authloginmw,
  authsignupmw,
} from "../Middleware/checking_parameters.js";

import { authtoken } from "../Middleware/Auth.js";
import { executeCode } from "../controller/user.controller.js";


// console.log("aaya hu routes ");
const userrouter = Router();
userrouter.route("/Register").post(authsignupmw, RegisterUser);
userrouter.route("/login").post(authloginmw, LoginUser);
userrouter.route("/checking_auth_token").post(authtoken, checking_token);
userrouter.route("/sendingOTP").post(generateandsetOTP);
userrouter.route("/checkingOTP").post(checkingotp);
userrouter.route("/Executingcode").post(executeCode);
userrouter.route("/tokengeneration").get(generatingtoken);
userrouter.route("/fetchUserData").post(authtoken ,fetchUserData);
userrouter.route("/saveCode").post(savecode);
userrouter.route("/fetchmycodes").post(fetchmyCode);
userrouter.route("/forgotpassword").post(forgotpassword);
userrouter.route("/updatepassword").post(updatepassword);

export default userrouter;
