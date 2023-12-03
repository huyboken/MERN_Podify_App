import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import EmailVerificationToken from "#/models/emailVerificationToken";
import PasswordResetToken from "#/models/passwordResetToken";
import User from "#/models/user";
import { formatProfile, generateToken } from "#/utils/helper";
import {
  sendForgetPasswordLink,
  sendPassResetSuccessEmail,
  sendVetificationMail,
} from "#/utils/mail";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import crypto from "crypto";
import { JWT_SECRET, PASSWORD_RESET_LINK } from "#/utils/variables";
import jwt from "jsonwebtoken";
import { RequestWithFiles } from "#/middleware/fileParser";
import cloudinary from "#/cloud";
import formidable from "formidable";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser)
    return res.status(403).json({ error: "Email is already in use!" });

  const user = await User.create({ name, email, password });

  const token = generateToken();

  await EmailVerificationToken.create({
    owner: user._id,
    token,
  });

  sendVetificationMail(token, { name, email, userId: user._id.toString() });

  res.status(201).json({ user: { id: user._id.toString(), name, email } });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { userId, token } = req.body;
  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken)
    return res.status(403).json({ error: "Invalid token!" });

  const matched = await verificationToken.compareToken(token);

  if (!matched) return res.status(403).json({ error: "Invalid token!" });

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });

  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({ message: "Your email is verified" });
};

export const sendReVerifyEmail: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid request!" });

  const user = await User.findById(userId);

  if (!user) return res.status(403).json({ error: "Invalid request!" });

  if (user.verified)
    return res.status(422).json({ error: "Your account is already verified!" });

  await EmailVerificationToken.findOneAndDelete({ owner: userId });

  const token = generateToken();

  await EmailVerificationToken.create({
    token,
    owner: userId,
  });

  sendVetificationMail(token, {
    email: user?.email,
    name: user?.name,
    userId: user?._id.toString(),
  });

  res.json({ message: "Please check your mail." });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(403).json({ error: "Account not found!" });

  await PasswordResetToken.findOneAndDelete({ owner: user._id });

  const token = crypto.randomBytes(36).toString("hex");

  await PasswordResetToken.create({
    owner: user._id,
    token,
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  sendForgetPasswordLink({ email: user.email, link: resetLink });

  res.json({ message: "Check you registered mail." });
};

export const grantValid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { userId, password } = req.body;

  const user = await User.findById(userId);

  if (!user) return res.status(403).json({ error: "Unauthorized access!" });

  const matched = await user.comparePassword(password);
  if (matched)
    return res
      .status(422)
      .json({ error: "The new password must be different!" });

  user.password = password;
  await user.save();

  await PasswordResetToken.findOneAndDelete({ owner: user._id });

  sendPassResetSuccessEmail(user.email, user.name);
  res.json({ message: "Password reset successfully." });
};

export const signIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(403).json({ error: "Email/password not mismatch!" });

  //compare the password
  const matched = await user.comparePassword(password);
  if (!matched)
    return res.status(403).json({ error: "Email/password not mismatch!" });

  //generate the token for later use
  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  user.tokens.push(token);

  await user.save();

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.followings.length,
    },
    token,
  });
};

export const sendProfile: RequestHandler = (req, res) => {
  res.json({ profile: req.user });
};

export const updateProfile: RequestHandler = async (
  req: RequestWithFiles,
  res
) => {
  const { name } = req.body;

  const avatar = req.files?.avatar as formidable.File;
  const user = await User.findById(req.user.id);
  if (!user) throw new Error("Something went wrong, user not found!");

  if (typeof name !== "string")
    return res.status(404).json({ error: "Invalid name!" });

  if (name.trim().length < 3)
    return res.status(404).json({ error: "Invalid name!" });
  user.name = name;
  if (avatar) {
    if (user.avatar?.publicId) {
      await cloudinary.uploader.destroy(user.avatar?.publicId);
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      avatar.filepath,
      {
        width: 300,
        height: 300,
        crop: "thumb",
        gravite: "face",
      }
    );
    user.avatar = { url: secure_url, publicId: public_id };
  }

  await user.save();
  res.json({ profile: formatProfile(user) });
};

export const logOut: RequestHandler = async (req, res) => {
  const { fromAll } = req.query;

  const token = req.token;
  const user = await User.findById(req.user.id);
  if (!user) throw new Error("Something went wrong, user not found!");
  if (fromAll === "yes") user.tokens = [];
  else user.tokens = user.tokens.filter((t) => t !== token);
  await user.save();

  res.json({ success: true });
};
