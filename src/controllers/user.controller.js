import { paymentMethodModel } from
  "../models/paymentMethod.model.js";
import { withdrawalModel } from "../models/withdrawal.model.js"
import { userModel } from "../models/user.model.js";
import { responseHandler } from "../utils/responseHandler.js";
import { withdrawalRequestTemplate, adminWithdrawalRequestReseveTemplate } from
  "../utils/htmlTemlate.js"
import { sendEmail } from "../services/sendEmail.service.js"
import argon2 from 'argon2';
import { notificationModel } from "../models/notification.model.js";
import { productModel } from "../models/product.model.js";
import { orderModel } from "../models/order.model.js";

export const findMe = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return responseHandler(
        res,
        401,
        {},
        "Unauthorized",
        false
      );
    }

    const user = await userModel.findOne({ _id: userId, isActive: true })
      .select("-password -refreshToken")
      .lean();

    if (!user) {
      return responseHandler(
        res,
        404,
        {},
        "User not found or inactive",
        false
      );
    }

    return responseHandler(res, 200, { user }, "User fetched successfully")

  } catch (error) {
    return responseHandler(res, 500, error.message, "Internal server Error findMe", false);
  }
};

export const userUpdate = async (req, res) => {
  try {
    const { userName, oldPassword, newPassword, email } = req.body;

    const userId = req.user?.id;

    const user = await userModel.findById(userId);

    if (!user) {
      return responseHandler(res, 404, {}, "User Not Found", false);
    }

    // if (oldPassword !== undefined){
    //   const isMatch = await argon2.verify(user.password, oldPassword);

    //   if (!isMatch) {
    //     return responseHandler(res, 401, null, "your OldPassword is inCorect", false)
    //   };
    // }


    // const hashedPassword = await argon2.hash(newPassword);

    if (userName !== undefined) user.userName = userName;

    if (email !== undefined) user.email = email;

    if (newPassword !== undefined) {
      if (oldPassword === undefined) {
        return responseHandler(
          res,
          400,
          {},
          "Old password is required",
          false
        );
      }

      const isMatch = await argon2.verify(
        user.password,
        oldPassword
      );

      if (!isMatch) {
        return responseHandler(
          res,
          401,
          {},
          "Your old password is incorrect",
          false
        );
      }

      user.password = newPassword;
    }


    const save = await user.save();

    return responseHandler(
      res,
      200,
      {
        user: {
          userName: save.userName,
          email: save.email
        }
      },
      "User updated successfully",
    );

  } catch (error) {
    return responseHandler(
      res,
      500,
      {},
      `internal server error user edit: ${error.message}`,
      false
    );
  }
};


//  Dashboard
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // User
    const user = await userModel.findById(userId).select(
      "userName balance"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Affiliate orders
    const orders = await orderModel
      .find({
        affiliate_ref: user.userName,
      })
      .sort({ createdAt: -1 })
      .lean();

    // Total orders
    const totalOrders = orders.length;

    // Total commission
    const totalCommission = orders.reduce(
      (total, order) => total + (order.affiliateCommission || 0),
      0
    );

    // Withdrawals
    const withdrawals = await withdrawalModel
      .find({
        user: userId,
        status: "approved",
      })
      .lean();

    const totalWithdrawals = withdrawals.reduce(
      (total, withdrawal) => total + (withdrawal.amount || 0),
      0
    );

    // Recent 5 orders
    const recentOrders = orders.slice(0, 5);

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        user: {
          id: user._id,
          userName: user.userName,
        },

        balance: user.balance || 0,

        totalCommission,

        totalOrders,

        totalWithdrawals,

        recentOrders,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// payment method
export const pymentMethodAddEdit = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { methodType, accountNumber, accountHolderName } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return responseHandler(res, 404, {}, "user not found", false);
    }
    if (!methodType || !accountNumber || !accountHolderName) {
      return responseHandler(res, 404, {}, "Filed the paymet details ", false);
    }

    const paymentMethod = await paymentMethodModel.findOneAndUpdate(
      { user: user._id },
      {
        $set: { methodType, accountNumber, accountHolderName, user: userId },
      },
      {
        returnDocument: "after",
        upsert: true,
      }
    );

    return responseHandler(res, 201, paymentMethod, "PaymentMethod Successfully Add ");

  } catch (error) {
    return responseHandler(res, 404, {}, `internal server Error ${error.message}`, false);
  }
};

export const getPaymentMethod = async (req, res) => {
  try {
    const userId = req.user?.id;

    const paymentMethod = await paymentMethodModel.findOne({ user: userId }).lean();

    return responseHandler(
      res,
      200,
      { paymentMethod } || null, // 👈 direct object ya null
      "OK"
    );
  } catch (e) {
    return responseHandler(res, 500, {}, e.message, false);
  }
};


// Withdrawals

export const withdrawalReq = async (
  req,
  res
) => {
  try {
    const userId = req.user?.id;

    let { amount } = req.body;

    amount = Number(amount);

    // =========================
    // VALIDATE AMOUNT
    // =========================

    if (!amount || amount <= 0) {
      return responseHandler(
        res,
        400,
        {},
        "Invalid amount",
        false
      );
    }

    if (amount < 100) {
      return responseHandler(
        res,
        400,
        {},
        "Minimum withdrawal is 100",
        false
      );
    }

    // =========================
    // FIND USER
    // =========================

    const user =
      await userModel.findById(userId);

    if (!user) {
      return responseHandler(
        res,
        404,
        {},
        "User not found",
        false
      );
    }

    // =========================
    // PAYMENT METHOD
    // =========================

    const payment =
      await paymentMethodModel.findOne({
        user: userId,
      });

    if (!payment) {
      return responseHandler(
        res,
        404,
        {},
        "Payment method not found",
        false
      );
    }

    // =========================
    // BALANCE CHECK
    // =========================

    if (user.balance < amount) {
      return responseHandler(
        res,
        400,
        {},
        "Insufficient balance",
        false
      );
    }

    // =========================
    // EXPIRY
    // =========================

    const expireAt = new Date(
      Date.now() +
      15 *
      24 *
      60 *
      60 *
      1000
    );

    // =========================
    // CREATE WITHDRAWAL
    // =========================

    const withdrawal =
      await withdrawalModel.create({
        user: user._id,
        amount,
        status: "pending",
        expireAt,
      });

    // =========================
    // DEDUCT BALANCE
    // =========================

    user.balance -= amount;

    await user.save();

    // =========================
    // USER NOTIFICATION
    // =========================

    const notification =
      await notificationModel.create({
        user: user._id,

        title: "Withdrawal Requested",

        message: `Your withdrawal request of Rs. ${amount.toLocaleString()} has been submitted successfully.`,

        amount,

        status: "pending",

        expireAt,
      });

    // =========================
    // ADMIN NOTIFICATIONS
    // =========================

    const admins =
      await userModel.find({
        role: "admin",
      });

    const adminNotifications =
      admins.map((admin) => ({
        user: admin._id,

        title:
          "New Withdrawal Request 🚨",

        message: `${user.userName} requested Rs. ${amount.toLocaleString()}`,

        amount,

        status: "pending",

        expireAt,
      }));

    if (adminNotifications.length > 0) {
      await notificationModel.insertMany(
        adminNotifications
      );
    }

    // =========================
    // USER EMAIL
    // =========================

    const html =
      withdrawalRequestTemplate(
        user.userName,
        amount
      );

    await sendEmail(
      user.email,
      "Withdrawal Request Submitted",
      html
    );

    // =========================
    // ADMIN EMAIL
    // =========================

    const AdminHtml =
      adminWithdrawalRequestReseveTemplate(
        user.userName,
        user.email,
        amount,
        payment.methodType,
        payment.accountHolderName,
        payment.accountNumber
      );

    const adminMails =
      "admin@egrif.online";

    await sendEmail(
      adminMails,
      "New Withdrawal Request 🚨",
      AdminHtml
    );

    // =========================
    // RESPONSE
    // =========================

    return responseHandler(
      res,
      200,
      {
        withdrawal,

        // Updated actual balance
        balance: user.balance,

        // Newly created notification
        notification,
      },
      "Withdrawal request submitted successfully"
    );

  } catch (error) {
    return responseHandler(
      res,
      500,
      {},
      `Internal server error ${error.message}`,
      false
    );
  }
};

// export const withdrawalReq = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     let { amount } = req.body;

//     amount = Number(amount);

//     // ✅ Validate amount
//     if (!amount || amount <= 0) {
//       return responseHandler(res, 400, {}, "Invalid amount", false);
//     }

//     if (amount < 100) {
//       return responseHandler(res, 400, {}, "Minimum withdrawal is 100", false);
//     }

//     const user = await userModel.findById(userId);

//     if (!user) {
//       return responseHandler(res, 404, {}, "User not found", false);
//     }

//     const payment = await paymentMethodModel.findOne({ user: userId })


//     if (!payment) {
//       return responseHandler(res, 404, {}, "payment method not found", false);
//     }

//     // ✅ Check sufficient balance
//     if (user.balance < amount) {
//       return responseHandler(res, 400, {}, "Insufficient balance", false);
//     }


//     const expireAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // delete in 15 days

//     // ✅ Create withdrawal request
//     const withdrawal = await withdrawalModel.create({
//       user: user._id,
//       amount,
//       // expireAt
//     });

//     // ✅ Deduct balance
//     user.balance -= amount;
//     await user.save();

//     // ✅ USER NOTIFICATION
//     await notificationModel.create({
//       user: user._id,
//       title: "Withdrawal Requested",
//       message: `Your withdrawal request of Rs.${amount} has been submitted`,
//       amount,
//       status: "pending",
//       expireAt
//     });

//     // 🔥 ADMIN NOTIFICATION
//     const admins = await userModel.find({ role: "admin" });

//     const adminNotifications = admins.map(admin => ({
//       user: admin._id,
//       title: "New Withdrawal Request 🚨",
//       message: `${user.userName} requested Rs.${amount}`,
//       amount,
//       status: "pending",
//       expireAt
//     }));

//     await notificationModel.insertMany(adminNotifications);


//     const html = withdrawalRequestTemplate(user.userName, amount);

//     await sendEmail(user.email, "Withdrawal Request Submitted", html
//     );

//     const AdminHtml = adminWithdrawalRequestReseveTemplate(
//       user.userName,
//       user.email,
//       amount,
//       payment.methodType,
//       payment.accountHolderName,
//       payment.accountNumber,
//     );

//     const adminMails = "admin@egrif.online" || "fakherbaho@gmail.com"

//     await sendEmail(adminMails,
//       "New Withdrawal Request 🚨",
//       AdminHtml
//     );



//     return responseHandler(
//       res,
//       200,
//       {
//         withdrawal,
//         balance: user.balance,
//       },
//       "Withdrawal request submitted successfully"
//     );

//   } catch (error) {
//     return responseHandler(
//       res,
//       500,
//       {},
//       `Internal server error ${error.message}`,
//       false
//     );
//   }
// };

export const getUserWithdrawals = async (req, res) => {
  try {
    const userId = req.user?.id;

    const withdrawals = await withdrawalModel
      .find({ user: userId })
      .sort({ createdAt: -1 });

    if (!withdrawals.length) {
      return responseHandler(
        res,
        404,
        [],
        "No withdrawal history found",
        false
      );
    }

    return responseHandler(
      res,
      200,
      { withdrawals },
      "Withdrawal history fetched successfully"
    );

  } catch (error) {
    return responseHandler(
      res,
      500,
      {},
      `Internal server error ${error.message}`,
      false
    );
  }
};


// Get All Products

export const getAllProducts = async (req, res) => {
  try {

    const userId = req.user?.id;

    const user = await userModel.findById(userId);

    if (!user) return responseHandler(res, 404, {}, "User Not Found", false);

    const products = await productModel
      .find()
      .sort({ createdAt: -1 })
      .lean();

    const productsWithAffiliateUrl = products.map((product) => ({
      ...product,
      affiliateUrl: `${product.productUrl}?ref=${encodeURIComponent(user.userName)}`,
    }));

    return responseHandler(
      res,
      200,
      { products: productsWithAffiliateUrl },
      "Products fetched successfully",
    );
  } catch (error) {
    console.error("Get All Products Error:", error.message);

    return responseHandler(
      res,
      500,
      {},
      "Internal server error",
      false
    );
  }
};

// order
export const getOrders = async (req, res) => {
  try {
    const userId = req.user?.id

    const user = await userModel.findById(userId);

    if (!user) {
      return responseHandler(res, 404, null, "User Not Found", false);
    }

    const orders = await orderModel.find(
      {
        affiliate_ref: user.userName
      }
    )
      .select("-affiliate_ref -customer")
      .lean()
      .sort({ createdAt: -1 });

    return responseHandler(res, 200, { orders }, "Get Orders SuccessFully")

  } catch (error) {
    return responseHandler(res, 500, null, "Internal Server Error Get Orders")
  }
}


export const getOrderById = async (req, res) => {
  try {
    const userId = req.user?.id;
    const orderId = req.params.id;

    if (!userId) {
      return responseHandler(
        res,
        401,
        null,
        "Unauthorized",
        false
      );
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return responseHandler(
        res,
        404,
        null,
        "User Not Found",
        false
      );
    }

    const order = await orderModel
      .findOne({
        _id: orderId,
        affiliate_ref: user.userName,
      })
      .select("-affiliate_ref -customer")
      .lean();

    if (!order) {
      return responseHandler(
        res,
        404,
        null,
        "Order Not Found",
        false
      );
    }

    return responseHandler(
      res,
      200,
      { order },
      "Order fetched successfully"
    );

  } catch (error) {
    console.error("Get Order Detail Error:", error);

    return responseHandler(
      res,
      500,
      null,
      "Internal Server Error Get Order",
      false
    );
  }
};

