export function generateCouponCode(merchantName: string) {
  const prefix = merchantName.substring(0, 3).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}${random}`
}

export function calculateMaturityDate(depositDate: Date) {
  const maturity = new Date(depositDate)
  maturity.setMonth(maturity.getMonth() + 3)
  return maturity
}
