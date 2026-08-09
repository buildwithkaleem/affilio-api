import { userModel } from "../models/user.model.js";
import { responseHandler } from "../utils/responseHandler.js";
import { withdrawalModel } from "../models/withdrawal.model.js"
import { paymentMethodModel } from "../models/paymentMethod.model.js"
import { withdrawalApprovedTemplate, withdrawalRejectedTemplate } from "../utils/htmlTemlate.js";
import { sendEmail } from "../services/sendEmail.service.js"
import { notificationModel } from "../models/notification.model.js";
import axios from "axios";
import { productModel } from "../models/product.model.js";
import { orderModel } from "../models/order.model.js";

export const getAllUser = async (req, res) => {
  try {
    // 🔐 Admin check
    if (req.user?.role !== "admin") {
      return responseHandler(res, 403, {}, "Access denied", false);
    }

    const users = await userModel.find()
      .select("-password -refreshToken")
      .lean();

    return responseHandler(
      res,
      200,
      users,
      "All users fetched successfully"
    );
  } catch (error) {
    return responseHandler(
      res,
      500,
      {},
      `Internal server error get All Users: ${error.message}`,
      false
    );
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔐 admin check
    if (req.user?.role !== "admin") {
      return responseHandler(res, 403, {}, "Access denied", false);
    }

    const user = await userModel.findById(id);

    if (!user) {
      return responseHandler(res, 404, {}, "User not found", false);
    }

    await userModel.findByIdAndDelete(id);

    return responseHandler(res, 200, {}, "User deleted successfully");
  } catch (error) {
    return responseHandler(res, 500, {}, error.message, false);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, email, newPassword, role } = req.body;

    // 🔐 Allow: admin OR own account
    if (req.user?.role !== "admin") {
      return responseHandler(res, 403, {}, "Access denied", false);
    }

    const user = await userModel.findById(id);

    if (!user) {
      return responseHandler(res, 404, {}, "User not found", false);
    }


    if (userName) user.userName = userName;
    if (email) user.email = email;
    if (newPassword) user.password = newPassword;
    if (role) user.role = role;

    await user.save();

    return responseHandler(
      res,
      200,
      user,
      "User updated successfully"
    );
  } catch (error) {
    return responseHandler(res, 500, {}, error.message, false);
  }
};


// pymentmethod
export const getAllWithdrawals = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return responseHandler(res, 403, {}, "Access denied", false);
    }

    const withdrawals = await withdrawalModel
      .find()
      .populate("user", "userName email balance")
      .sort({ createdAt: -1 });

    const withdrawalsWithPayment = await Promise.all(
      withdrawals.map(async (w) => {
        const paymentMethod = await paymentMethodModel.findOne({
          user: w.user._id,
        });

        return {
          ...w.toObject(),
          paymentMethod,
        };
      })
    );

    return responseHandler(
      res,
      200,
      { withdrawals: withdrawalsWithPayment },
      "All withdrawals fetched successfully"
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


export const withdrawalApproval = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // 🔐 Admin check
    if (req.user?.role !== "admin") {
      return responseHandler(res, 403, {}, "Access denied", false);
    }

    const expireAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // delete in 15 days

    // notification function
    const notification = async (user,
      title,
      message,
      amount,
      status,
      expireAt
    ) => {
      await notificationModel.create({
        user,
        title,
        message,
        amount,
        status,
        expireAt
      });
    };

    // ❗ Validate status
    const allowedStatus = ["approved", "rejected"];
    if (!allowedStatus.includes(status)) {
      return responseHandler(res, 400, {}, "Invalid status", false);
    }

    // 🔍 Find withdrawal
    const withdrawal = await withdrawalModel.findById(id);

    if (!withdrawal) {
      return responseHandler(res, 404, {}, "Withdrawal not found", false);
    }

    // 🚫 Prevent double update
    if (withdrawal.status !== "pending") {
      return responseHandler(
        res,
        400,
        {},
        `Already ${withdrawal.status}`,
        false
      );
    }

    const user = await userModel.findById(withdrawal.user);


    // rejected
    if (status === "rejected") {
      user.balance += withdrawal.amount;
      const rejectApproval = await user.save();
      withdrawal.status = status;
      await withdrawal.save();

      const html = withdrawalRejectedTemplate(
        user.userName,
        withdrawal.amount,
        "Invalid account details"
      );

      await sendEmail(user.email, "Withdrawal Rejected ❌",
        html);

      // 🔴 USER NOTIFICATION (REJECTED)
      notification(user._id,
        "Withdrawal Rejected ❌",
        `Your withdrawal of Rs.${withdrawal.amount} was rejected`,
        withdrawal.amount,
        "rejected",
        expireAt
      );
      // await notificationModel.create({
      //   user: user._id,
      //   title: "Withdrawal Rejected ❌",
      //   message: `Your withdrawal of Rs.${withdrawal.amount} was rejected`,
      //   amount: withdrawal.amount,
      //   status: "rejected",
      //   expireAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      // });

      return responseHandler(
        res,
        200,
        { withdrawal },
        "Withdrawal status updated successfully"
      );
    }


    // approval
    // ✅ Update status
    withdrawal.status = status;
    withdrawal.expireAt = expireAt;
    await withdrawal.save();

    const html = withdrawalApprovedTemplate(user.userName, withdrawal.amount);

    await sendEmail(user.email, "Withdrawal Approved 🎉",
      html);

    // 🟢 USER NOTIFICATION (APPROVED)
    notification(user._id,
      "Withdrawal Approved 🎉",
      `Your withdrawal of Rs.${withdrawal.amount} has been approved`,
      withdrawal.amount,
      "approved",
      expireAt
    );
    // await notificationModel.create({
    //   user: user._id,
    //   title: "Withdrawal Approved 🎉",
    //   message: `Your withdrawal of Rs.${withdrawal.amount} has been approved`,
    //   amount: withdrawal.amount,
    //   status: "approved",
    //   expireAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    // });


    return responseHandler(
      res,
      200,
      { withdrawal },
      "Withdrawal status updated successfully"
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


// add affilliate products

export const addAffilliateProducts = async (req, res) => {
  try {
    let { productUrl, persent } = req.body;

    persent = Number(persent)

    // 🔐 Admin check
    if (req.user?.role !== "admin") {
      return responseHandler(
        res,
        403,
        {},
        "Access denied",
        false
      );
    }

    // Validation
    if (!productUrl) {
      return responseHandler(
        res,
        400,
        {},
        "Product URL is required",
        false
      );
    }

    if (persent === undefined || persent === null) {
      return responseHandler(
        res,
        400,
        {},
        "Affiliate percentage is required",
        false
      );
    }

    const slug = new URL(productUrl)
      .pathname
      .split("/")
      .filter(Boolean)
      .pop();


    // Fetch product from Pure API
    const { data } = await axios
      .get(`${process.env.PURE_API_URL}/${slug}`,
        {
          timeout: 10000,
        });

    const productTitle = data.product.title;
    const productId = data.product.id;
    const productSlug = data.product.slug;
    const salePrice = data.product.price.sale;
    const regularPrice = data.product.price.regular;
    const productImage = data.product.image;

    const price = salePrice ?? regularPrice;

    let commission = price * persent / 100;
    const affiliateCommission = Math.floor(commission);

    const isExist = await productModel.findOne({ productId });

    if (isExist) {
      return responseHandler(res, 409, { productId }, "Product Already Exist")
    }

    const product = await productModel.create({
      productUrl,
      productId,
      productTitle,
      productSlug,
      regularPrice,
      salePrice,
      productImage,
      persent,
      affiliateCommission
    });

    return responseHandler(
      res,
      200,
      {
        product,
      },
      "Product fetched successfully",
      true
    );

  } catch (error) {
    console.error("Add Affiliate Product Error:", error.message);

    // if (error.code === "ECONNABORTED") {
    //   return responseHandler(
    //     res,
    //     504,
    //     {},
    //     "Product API request timed out",
    //     false
    //   );
    // }

    if (error.response) {
      return responseHandler(
        res,
        error.response.status,
        {},
        "Product API returned an error",
        false
      );
    }

    return responseHandler(
      res,
      500,
      {},
      "Internal server error",
      false
    );
  }
};


// Order
export const getAllOrders = async (req, res) => {
  try {
    // 🔐 Admin check
    if (req.user?.role !== "admin") {
      return responseHandler(res, 403, {}, "Access denied", false);
    }

    const orders = await orderModel.find()
      .lean()
      .sort({ createdAt: -1 });

    return responseHandler(
      res,
      200,
      { orders },
      "All orders fetched successfully"
    );
  } catch (error) {
    return responseHandler(
      res,
      500,
      {},
      `Internal server error get All orders: ${error.message}`,
      false
    );
  }

}

export const releaseAffiliateCommission = async (req, res) => {
  try {
    const { id: orderId } = req.params;

    // 🔐 Admin check
    if (req.user?.role !== "admin") {
      return responseHandler(
        res,
        403,
        {},
        "Access denied",
        false
      );
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return responseHandler(
        res,
        404,
        null,
        "Order Not Found",
        false
      );
    }

    const product = await productModel.findOne({
      productId: order.products[0].id
    });

    if (!product) {
      return responseHandler(
        res,
        404,
        null,
        "Product Not Found",
        false
      );
    }

    const user = await userModel.findOne({
      userName: order.affiliate_ref
    });

    if (!user) {
      return responseHandler(
        res,
        404,
        null,
        "User Not Found",
        false
      );
    }

    // Commission ko existing balance mein ADD karo
    user.balance += product.affiliateCommission;

    await user.save();

    return responseHandler(
      res,
      200,
      { balance: user.balance },
      "Affiliate Commission Released Successfully",
      true
    );

  } catch (error) {
    console.error(
      "Release Affiliate Commission Error:",
      error.message
    );

    return responseHandler(
      res,
      500,
      null,
      "Internal Server Error Affiliate Commission Release",
      false
    );
  }
};


export const deleteOrder = async (req,res) => {
  try {

    const productId = req.params?.id;

    // 🔐 Admin check
    if (req.user?.role !== "admin") {
      return responseHandler(res, 403, {}, "Access denied", false);
    }

    const order = await orderModel.findByIdAndDelete(productId);

    return responseHandler(res,200,null,"Order Delete SuccessFuly");
    
  } catch (error) {
    return responseHandler(res, 500, null, "Internal Server Error Order Delete" + error.message,false);
  }
}


// export const releaseAffiliateCommission = async (req,res) => {
//   try {
//     const orderId = req.params;

//     // 🔐 Admin check
//     if (req.user?.role !== "admin") {
//       return responseHandler(res, 403, {}, "Access denied", false);
//     }

//     const order = await orderModel.findById(orderId);

//     if (!order) {
//       return responseHandler(res,404,null,"Order Not Found",false);
//     }

//     const product = await productModel.findOne({ productId: order.products.id});

//     if (!product) {
//       return responseHandler(res, 404, null, "Product Not Found", false);
//     }

//     const user = await userModel.findOne({ userName: order.affiliate_ref})

//     if (!user) {
//       return responseHandler(res, 404, null, "User Not Found", false);
//     }

//     user.balance = product.affiliateCommission;
//     const balance = user.save();

//     return responseHandler(res, 200, balance.balance,"Affiliate Commission Release SuccessFully" )

//   } catch (error) {
//     return responseHandler(res, 500, error.message, "Internal Server Error Affiliate Commission Release",false)
//   }
// }


