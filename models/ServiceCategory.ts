import mongoose, { Document, Schema } from "mongoose"
import slugify from "slugify"

export interface IServiceCategory extends Document {
  name: string
  description?: string
  image?: string
  isActive: boolean
  slug: string
}

const ServiceCategorySchema: Schema<IServiceCategory> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    image: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
)

ServiceCategorySchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
  next()
})

export default mongoose.models.ServiceCategory ||
  mongoose.model<IServiceCategory>("ServiceCategory", ServiceCategorySchema)
