import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: String,
    preferredDate: Date,
    preferredTime: String,
    notes: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema)
