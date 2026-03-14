import prisma from '../utils/prisma.js'

/**
 * Appends a ledger entry AND updates totalStock on the product.
 * Always call this inside a prisma.$transaction([...]).
 * Returns the two prisma write operations ready to spread into a transaction.
 */
export const ledgerEntry = ({ productId, type, quantity, reference, description }) => [
  prisma.stockLedger.create({
    data: { productId, type, quantity, reference, description },
  }),
  prisma.product.update({
    where: { id: productId },
    data: { totalStock: { increment: quantity } },
  }),
]

/**
 * Update stock at a specific location (StockLevel table).
 * Creates the row if it doesn't exist yet.
 */
export const updateLocationStock = async (productId, locationId, delta) => {
  await prisma.stockLevel.upsert({
    where: { productId_locationId: { productId, locationId } },
    create: { productId, locationId, quantity: Math.max(0, delta) },
    update: { quantity: { increment: delta } },
  })
}

/**
 * Get current stock of a product across all locations.
 */
export const getProductStock = async (productId) => {
  const levels = await prisma.stockLevel.findMany({
    where: { productId },
    include: { location: { include: { warehouse: true } } },
  })
  return levels
}

/**
 * Returns products whose totalStock is below their minStock.
 */
export const getLowStockProducts = async () => {
  return prisma.product.findMany({
    where: { totalStock: { lte: 10 } },
  })
}
