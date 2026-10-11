import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    goal: {
      type: String,
      required: true,
      enum: [
        "weight-loss",
        "muscle-gain",
        "strength",
        "general-fitness",
        "other",
      ],
    },

    plan: {
      type: String,
      required: true,
      enum: ["starter", "transformation", "premium", "not-sure"],
    },

    status: {
      type: String,
      enum: ["new", "contacted", "follow-up", "converted", "closed"],
      default: "new",
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    // Soft-delete / archive flag.
    // Archived leads remain in the database and can be restored later.
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

export default Lead;