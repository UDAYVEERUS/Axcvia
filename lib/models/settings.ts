import mongoose, { Schema } from "mongoose";

// Singleton document (key: "site") holding dashboard-editable site settings.
const settingsSchema = new Schema(
  {
    key: { type: String, default: "site", unique: true },
    promoEnabled: { type: Boolean, default: true },
    promoTitle: { type: String, default: "10% Flat Discount for New Students" },
    promoText: {
      type: String,
      default:
        "Get a 10% flat discount on your first course. Use the code at checkout — valid for new students only.",
    },
    promoCode: { type: String, default: "WELCOME10" },
    popupEnabled: { type: Boolean, default: true },
    popupDelaySeconds: { type: Number, default: 10 },
    announcement: { type: String, default: "" },
  },
  { timestamps: true }
);

export const SettingsModel = mongoose.models.Settings ?? mongoose.model("Settings", settingsSchema);
