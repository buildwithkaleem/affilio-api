import { orderModel } from "../models/order.model.js";
import { productModel } from "../models/product.model.js";


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





// import { orderModel } from "../models/order.model.js";
// import { productModel } from "../models/product.model.js";

// export const orderController = async (req, res) => {
//   try {
//     const {
//       affiliate_ref,
//       order,
//       customer,
//       products,
//       total,
//     } = req.body;

//     // Validation
//     if (
//       !affiliate_ref ||
//       !order ||
//       !customer ||
//       !products ||
//       !products.length ||
//       !total
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required.",
//       });
//     }

//     // Duplicate Order Check
//     const existingOrder = await orderModel.findOne({
//       "order.id": order.id,
//     });

//     if (existingOrder) {
//       return res.status(409).json({
//         success: false,
//         message: "Order already exists.",
//       });
//     }

//     // Calculate total affiliate commission
//     let affiliateCommission = 0;

//     for (const item of products) {
//       const product = await productModel.findOne({
//         productId: item.id,
//       });

//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: `Product not found: ${item.id}`,
//         });
//       }

//       const commission = product.affiliateCommission || 0;
//       const qty = item.qty || 1;

//       affiliateCommission += commission * qty;
//     }

//     // Save Order
//     const orderRecord = await orderModel.create({
//       affiliate_ref,
//       order,
//       customer,
//       products,
//       total,
//       affiliateCommission,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Affiliate order created successfully.",
//       data: orderRecord,
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };