const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''

export function getProductImageUrl(filename: string | null | undefined): string {
  if (!filename) return '/placeholder-product.jpg'
  // If it's already a full URL, return as-is
  if (filename.startsWith('http')) return filename
  return `${R2_PUBLIC_URL}/products/${filename}`
}

export function getR2BucketName(): string {
  return process.env.R2_BUCKET_NAME || 'ristan-marine-images'
}
