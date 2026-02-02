import { Request, Response } from "express";
import Product from "../models/Product";

/**
 * ADMIN: Create product
 */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, basePrice, distancePrices, imageUrl } = req.body;

    const product = await Product.create({
      name,
      basePrice,
      distancePrices,
      createdBy: req.user.userId,
      imageUrl
    });

    res.status(201).json(product.toJSON());
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUBLIC: Get all products
 */
export const getProducts = async (_: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products.map(p => p.toJSON()));
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUBLIC: Get single product
 */
export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product.toJSON());
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN: Update product
 */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, basePrice, distancePrices, imageUrl } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, basePrice, distancePrices, imageUrl },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product.toJSON());
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN: Delete product
 */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
