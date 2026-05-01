import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import type { Request, Response } from "express";
import { prisma } from "../config/prisma";

const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

const validatePassword = (password: string, storedPassword: string) => {
  const [salt, savedHash] = storedPassword.split(":");

  if (!salt || !savedHash) {
    return false;
  }

  const incomingHash = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(
    Buffer.from(savedHash, "hex"),
    Buffer.from(incomingHash, "hex"),
  );
};

export const signUpController = async (
  request: Request,
  response: Response,
) => {
  const { name, phone, email, password } = request.body as {
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
  };

  if (!name || !phone || !email || !password) {
    return response
      .status(400)
      .json({ message: "Informe nome, telefone, email e senha." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const userAlreadyExists = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (userAlreadyExists) {
    return response
      .status(409)
      .json({ message: "Este email já está cadastrado." });
  }

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      phone: phone.trim(),
      email: normalizedEmail,
      password: hashPassword(password),
    },
  });

  return response.status(201).json({
    message: "Cadastro realizado com sucesso.",
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
    },
  });
};

export const loginController = async (request: Request, response: Response) => {
  const { email, password } = request.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return response.status(400).json({ message: "Informe email e senha." });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (!user || !validatePassword(password, user.password)) {
    return response.status(401).json({ message: "Email ou senha inválidos." });
  }

  const authToken = randomBytes(24).toString("hex");

  return response.status(200).json({
    message: "Login realizado com sucesso.",
    token: authToken,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
    },
  });
};
