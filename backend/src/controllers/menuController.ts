import type { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const listMenuItemsController = async (_req: Request, res: Response) => {
  const items = await prisma.menuItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json(items);
};

export const getMenuItemByIdController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;

  const item = await prisma.menuItem.findUnique({
    where: { id },
  });

  if (!item) {
    return res.status(404).json({ message: "Item não encontrado." });
  }

  return res.status(200).json(item);
};

export const createMenuItemController = async (req: Request, res: Response) => {
  const { name, description, price } = req.body as {
    name?: string;
    description?: string;
    price?: number;
  };

  if (!name || typeof price !== "number") {
    return res
      .status(400)
      .json({ message: "Informe nome e preço numérico do item." });
  }

  const createdItem = await prisma.menuItem.create({
    data: {
      name: name.trim(),
      description: description?.trim(),
      price,
    },
  });

  return res.status(201).json({
    message: "Item criado com sucesso.",
    item: createdItem,
  });
};

export const updateMenuItemController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price } = req.body as {
    name?: string;
    description?: string;
    price?: number;
  };

  const item = await prisma.menuItem.findUnique({
    where: { id },
  });

  if (!item) {
    return res.status(404).json({ message: "Item não encontrado." });
  }

  if (name !== undefined && !name.trim()) {
    return res.status(400).json({ message: "Nome inválido." });
  }

  if (price !== undefined && typeof price !== "number") {
    return res.status(400).json({ message: "Preço inválido." });
  }

  const updatedItem = await prisma.menuItem.update({
    where: { id },
    data: {
      name: name?.trim(),
      description: description?.trim(),
      price,
    },
  });

  return res.status(200).json({
    message: "Item atualizado com sucesso.",
    item: updatedItem,
  });
};

export const deleteMenuItemController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const item = await prisma.menuItem.findUnique({
    where: { id },
  });

  if (!item) {
    return res.status(404).json({ message: "Item não encontrado." });
  }

  await prisma.menuItem.delete({ where: { id } });

  return res.status(200).json({ message: "Item removido com sucesso." });
};
