import { UserModel } from "../Models/User.model.js";
import { CodeModel } from "../Models/codeSave.js";
import { OTPmodel } from "../Models/OTP.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import twilio from "twilio";
import otpgenerator from "otp-generator";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { Resend } from "resend";
const RegisterUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // console.log(username, email, password);

    const user = await UserModel.findOne({ email, username });
    // console.log("user");

    if (user) {
      return res.status(404).json({ message: "User exists already, do login" });
    }
    // console.log("user check");

    const hashpassword = await bcrypt.hash(password, 10);
    // console.log("hashpassword");

    const newuser = await UserModel.create({
      username,
      email,
      password: hashpassword,
    });
    // console.log("newuser");

    const createduser = await UserModel.findById(newuser._id);
    if (!createduser) {
      return res
        .status(500)
        .json({ message: "Server issue while creating user" });
    }

    // console.log(createduser);
    // console.log("now from here");

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      data: createduser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error registering user: ${error.message}` });
  }
};

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User does not exist, please register" });
    }

    const ispasscorrect = await bcrypt.compare(password, user.password);
    // console.log(ispasscorrect);

    if (!ispasscorrect) {
      return res.status(401).json({ message: "Wrong password" }); // 🔹 401 for incorrect credentials
    }

    // console.log(process.env.Authentication_for_jsonwebtoken);

    const jsonewbestoken = jwt.sign(
      { email: user.email },
      process.env.Authentication_for_jsonwebtoken,
      { expiresIn: "24h" }
    );
    return res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user,
      jwttoken: jsonewbestoken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error logging in user: ${error.message}` });
  }
};

const checking_token = async (req, res) => {
  return res.status(200).json({
    message: "Token is valid",
    success: true,
  });
};
const generateandsetOTP = async (req, res) => {
  try {
    const { phonenumber } = req.body;
    const twilio_bhai = new twilio(
      process.env.Account_SID,
      process.env.Auth_Token
    );

    const otp = otpgenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log(`Generated OTP: ${otp} for phone number: ${phonenumber}`);
    const stringWithoutSpaces = phonenumber.replace(/\s+/g, "");
    if (stringWithoutSpaces.length !== 13) {
      return res.status(400).json({
        message: "Give valid phone number",
        success: "False",
      });
    }
    await OTPmodel.findOneAndUpdate(
      { phonenumber: stringWithoutSpaces },
      { otp, otpexpiry: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await twilio_bhai.messages.create({
      body: `Your OTP from Codeeditor is ${otp}. Verify your account. Don't share your credentials.`,
      to: phonenumber,
      from: process.env.My_Twilio_phone_number,
    });
    console.log(`OTP sent to ${phonenumber} successfully`);
    res.status(200).json({
      status: 200,
      message: `OTP sent successfully to your ${phonenumber}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `${error}`,
      success: "False",
    });
  }
};

const checkingotp = async (req, res) => {
  try {
    const { phonenumber, otp, id } = req.body;

    if (!otp) {
      return res.status(400).json({
        message: "Please provide both otp and id.",
      });
    }
    // phone number shold be in +911234567890 format no space between anythign
    const otpdoc = await OTPmodel.findOne({ phonenumber });

    if (!otpdoc) {
      return res.status(400).json({
        message: "Register your mobile again",
      });
    }

    if (otpdoc.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP.",
        ans: "false",
      });
    }
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        ans: "false",
      });
    }
    user.isverified = true;
    await user.save();
    res.status(200).json({
      message: "User verified successfully.",
      ans: "true",
    });
  } catch (error) {
    // console.error("Error in checking OTP:", error);
    return res.status(400).json({
      message: `Having error in checking the OTP: ${error.message}`,
      ans: "false",
    });
  }
};

const languageVersionMap = {
  // Node / JavaScript
  nodejs: "0", // e.g. nodejs
  javascript: "0", // alias for nodejs

  // TypeScript
  typescript: "0", // placeholder: adjust when known

  // Python
  python: "3", // assuming python3 index 3
  python3: "3",

  // Java
  java: "3", // known: JDK 11.0.4 index 3 :contentReference[oaicite:2]{index=2}

  // C / C++
  c: "4", // known: GCC 9.1.0 index 4 :contentReference[oaicite:3]{index=3}
  cpp17: "0", // known: g++ 17 index 0 :contentReference[oaicite:4]{index=4}
  cpp: "0", // alias for cpp17 or adjust if you support older

  // Other languages (placeholders; you must test)
  ruby: "0",
  php: "0",
  go: "0",
  rust: "0",
  kotlin: "0",
  swift: "0",
  r: "0",
  perl: "0",
  dart: "0",
  haskell: "0",
  xml: "0",
  yaml: "0",
  html: "0",
  shell: "0",
};

const languageAliasMap = {
  javascript: "nodejs", // JavaScript should use Node.js
  cpp: "cpp17", // Use C++17 as the standard C++ version
};

const executeCode = async (req, res) => {
  const { code, input, language } = req.body;
  console.log(code);
  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required" });
  }

  // Normalize language and handle aliases
  const languageKey =
    languageAliasMap[language.toLowerCase()] || language.toLowerCase();
  const versionIndex = languageVersionMap[languageKey];

  if (!versionIndex) {
    return res.status(400).json({ error: `Unsupported language: ${language}` });
  }
  console.log(versionIndex);
  try {
    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script: code,
      stdin: input || "",
      language: languageKey,
      versionIndex,
      compileOnly: false,
    });
    console.log(response.data);
    return res.json(response.data);
  } catch (error) {
    console.log(error.response?.data || error.message);
    return res.status(500).json({
      error: "Failed to execute code",
      details: error.response?.data || error.message,
    });
  }
};

const generatingtoken = async (req, res) => {
  try {
    const email = "ano";
    const _id = "uiser";
    const jsonewbestoken = jwt.sign(
      { email, _id },
      process.env.Authentication_for_jsonwebtoken,
      { expiresIn: "24h" }
    );
    return res.status(200).json({
      message: "Token generated successfully",
      success: true,
      jwttoken: jsonewbestoken,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      error: error,
    });
  }
};

const fetchUserData = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  // Check if email is provided
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  // Verify that the token belongs to the requested email
  if (req.user.email !== email) {
    return res.status(403).json({ message: "Unauthorized access." });
  }

  try {
    // Fetch user details from the database
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user is verified
    if (!user.isverified) {
      return res.status(403).json({ message: "User is not verified." });
    }

    // Return user details (excluding sensitive data like password)
    const userDetails = {
      email: user.email,
      name: user.username,
      isverified: user.isverified,
    };

    res
      .status(200)
      .json({ message: "details fetched successfully", userDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

const savecode = async (req, res) => {
  try {
    const { id, code, title } = req.body;

    if (!id || !code) {
      return res.status(400).json({ message: "User ID and code are required" });
    }

    const newcode = await CodeModel.create({
      code: code,
      user: id,
      title,
    });

    return res.status(200).json({
      message: "Data saved successfully",
      data: newcode,
    });
  } catch (error) {
    console.error("Error saving code:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const fetchmyCode = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const docs = await CodeModel.find({ user: user_id });

    if (docs.length === 0) {
      return res.status(200).json({
        message: "You have no saved code.",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Your saved codes:",
      data: docs,
    });
  } catch (error) {
    console.error("Error fetching code:", error);
    return res.status(500).json({
      message: "Error accessing saved codes",
      error: error.message,
    });
  }
};

const sendForgotPasswordMail = async (email, token) => {
  if (!email || !token) {
    throw new Error("Email and token are required to send forgot password mail.");
  }

  try {
    console.log("in mail part");
    const resend = new Resend(process.env.RESEND_API_KEY);
    console.log(process.env.RESEND_API_KEY);
    const resetLink = `https://codeeditor-ten-zeta.vercel.app/resetpassword/${token}`;
    console.log("resetLink:", resetLink);
    const htmlTemplate = `
      <div style="
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
        color: #333;
      ">
        <div style="
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        ">
          <h2 style="text-align:center; color:#007bff;">Reset Your Password 🔐</h2>
          <p>Hey there,</p>
          <p>You recently requested to reset your password. Click the button below to reset it:</p>

          <div style="text-align:center; margin: 30px 0;">
            <a href="${resetLink}" target="_blank" 
              style="
                background-color: #007bff;
                color: white;
                padding: 12px 25px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: bold;
              ">
              Reset Password
            </a>
          </div>

          <p>If that button doesn’t work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #555;">${resetLink}</p>

          <p><b>Note:</b> This link will expire in 10 minutes.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 14px; color: #888; text-align:center;">
            This email was sent from your CodeEditor App 🧑‍💻<br>
            If you didn’t request a password reset, please ignore this message.
          </p>
        </div>
      </div>
    `;

    const data = await resend.emails.send({
      from: "CodeEditor <onboarding@resend.dev>", // required sender domain
      to: email,
      subject: "Password Reset Request",
      html: htmlTemplate,
    });

    console.log("✅ Forgot password mail sent successfully to:", email, data);
  } catch (error) {
    console.error("❌ Error sending mail:", error.message);
    throw new Error("Error sending forgot password email");
  }
};

const forgotpassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }
  console.log(email);
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please register" });
    }
    const plaintoken = crypto.randomBytes(32).toString("hex");
    const hashedtoken = crypto
      .createHash("sha256")
      .update(plaintoken)
      .digest("hex");
    user.resetpasswordtoken = hashedtoken;
    user.resetpasswordexpire = Date.now() + 10 * 60 * 1000;
    console.log(plaintoken);
    await user.save();
    await sendForgotPasswordMail(user.email, plaintoken);
    return res.status(200).json({
      message: "Password reset token generated and email sent.",
    });
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error.message}` });
  }
};

const updatepassword = async (req, res) => {
  const { token, newpassword } = req.body;
  console.log(req.body);
  if (!token || !newpassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }
  try {
    const hashedtoken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await UserModel.findOne({
      resetpasswordtoken: hashedtoken,
      resetpasswordexpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const hashedpassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedpassword;
    user.resetpasswordtoken = undefined;
    user.resetpasswordexpire = undefined;
    await user.save();
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error.message}` });
  }
};

export {
  RegisterUser,
  LoginUser,
  checking_token,
  generateandsetOTP,
  checkingotp,
  executeCode,
  generatingtoken,
  fetchUserData,
  savecode,
  fetchmyCode,
  forgotpassword,
  updatepassword,
};
