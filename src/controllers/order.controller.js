import { orderModel } from "../models/order.model.js";


export const orderController = async (req, res) => {
  try {
    const {
      affiliate_ref,
      order,
      customer,
      products,
      total,
    } = req.body;

    // Validation
    if (
      !affiliate_ref ||
      !order ||
      !customer ||
      !products ||
      !total
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Duplicate Order Check
    const existingOrder = await orderModel.findOne({
      "order.id": order.id,
    });

    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message: "Order already exists.",
      });
    }

    // Save Record
    const orderRecord = await orderModel.create({
      affiliate_ref,
      order,
      customer,
      products,
      total,
    });

    return res.status(201).json({
      success: true,
      message: "Affiliate order created successfully.",
      data: orderRecord,
    },
    );

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};