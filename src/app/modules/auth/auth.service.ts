import { UserRole, UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { Secret } from "jsonwebtoken";

import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import config from "../../../config";
import { JwtHelper } from "../../helper/jwtHelper";
import emailSender from "./emailSender";

const login = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email is required!");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password is incorrect!");
  }

  const accessToken = JwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt_secret as Secret,
    "1h"
  );

  const refreshToken = JwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt.refresh_token_secret as Secret,
    "90d"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = JwtHelper.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = JwtHelper.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt_secret as Secret,
    config.jwt_expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.newPassword,
    Number(config.salt_round)
  );

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully!",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPassToken = JwtHelper.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_token_expires_in as string
  );

  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;

  await emailSender(
    userData.email,
    `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
  );
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = JwtHelper.verifyToken(
    token,
    config.jwt.reset_pass_secret as Secret
  );

  if (!isValidToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
  }

  // hash password
  const password = await bcrypt.hash(
    payload.password,
    Number(config.salt_round)
  );

  // update into database
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password,
    },
  });
};

const getMe = async (session: any) => {
  const accessToken = session.accessToken;
  const decodedData = JwtHelper.verifyToken(
    accessToken,
    config.jwt_secret as Secret
  );

  const userData = await prisma.user.findUnique({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
    include: {
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  const { id, email, role, needPasswordChange, status, admin } = userData;

  return {
    id,
    email,
    role,
    needPasswordChange,
    status,
    admin: role === UserRole.ADMIN ? admin : null,
  };
};

export const AuthService = {
  login,
  changePassword,
  forgotPassword,
  refreshToken,
  resetPassword,
  getMe,
};
