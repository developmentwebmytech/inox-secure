import mongoose from "mongoose"

const VariantSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    compareAtPrice: {
      type: Number,
      default: null,
    },
    costPerItem: {
      type: Number,
      default: null,
    },
    profit: {
      type: Number,
      default: null,
    },
    margin: {
      type: Number,
      default: null,
    },
    sku: {
      type: String,
      default: "",
    },
    barcode: {
      type: String,
      default: "",
    },
    inventoryQuantity: {
      type: Number,
      default: 0,
    },
    trackQuantity: {
      type: Boolean,
      default: true,
    },
    continueSellingWhenOutOfStock: {
      type: Boolean,
      default: false,
    },
    weight: {
      type: Number,
      default: 0,
    },
    weightUnit: {
      type: String,
      enum: ["kg", "g", "lb", "oz"],
      default: "kg",
    },
    requiresShipping: {
      type: Boolean,
      default: true,
    },
    taxable: {
      type: Boolean,
      default: true,
    },
    images: [
      {
        url: String,
        altText: String,
        position: Number,
      },
    ],
    optionValues: [
      {
        optionName: String,
        value: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

const ProductOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  values: [
    {
      type: String,
      required: true,
    },
  ],
})

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    handle: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "draft",
    },
    productType: {
      type: String,
      default: "",
    },
    vendor: {
      type: String,
      default: "",
    },
    tags: [
      {
        type: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: false,
    },
    collections: [
      {
        type: String,
      },
    ],
    images: [
      {
        url: String,
        altText: String,
        position: Number,
      },
    ],
    options: [ProductOptionSchema],
    variants: [VariantSchema],
    seoTitle: {
      type: String,
      default: "",
    },
    seoDescription: {
      type: String,
      default: "",
    },
    searchEngineListingPreview: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isHotDeal: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Generate handle from title
ProductSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.handle) {
    this.handle = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }
  next()
})

// Generate slug from title
ProductSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }
  next()
})

export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema)
