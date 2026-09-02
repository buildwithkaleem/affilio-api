
import mongoose from "mongoose";
import argon2 from "argon2";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      // select: false, // Password by default response mein nahi aayega
    },

    role: {
      type: String,
      enum: ["affiliate", "admin"],
      default: "affiliate",
    },

    balance: {
      type: Number,
      default: 0,
      min: 0,
    },

    // isVerified: {
    //   type: Boolean,
    //   default: false,
    // },

    isActive: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },

    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {

  if (!this.isModified("password")) return;

  this.password = await argon2.hash(this.password);

});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await argon2.verify(this.password, enteredPassword);
};

export const userModel = mongoose.model("User", userSchema);