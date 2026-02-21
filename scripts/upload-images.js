/**
 * Ristan Marine - R2 이미지 대량 업로드 스크립트
 *
 * 사용법:
 *   node scripts/upload-images.js --dir ./images/products
 *
 * 필수 환경변수 (.env.local):
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 */

const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

// Load env
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
} = process.env

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error('❌ Missing R2 environment variables. Check .env.local')
  process.exit(1)
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

const CONCURRENCY = 10
const SUPPORTED_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

async function fileExistsInR2(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }))
    return true
  } catch {
    return false
  }
}

async function uploadFile(filePath, key) {
  const buffer = fs.readFileSync(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
    : ext === '.png' ? 'image/png'
    : ext === '.webp' ? 'image/webp'
    : ext === '.gif' ? 'image/gif'
    : 'application/octet-stream'

  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }))
}

async function runUpload(sourceDir) {
  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Directory not found: ${sourceDir}`)
    process.exit(1)
  }

  const files = fs.readdirSync(sourceDir).filter(f =>
    SUPPORTED_EXTS.includes(path.extname(f).toLowerCase())
  )

  console.log(`\n📁 Found ${files.length} image files in ${sourceDir}`)
  console.log(`📦 Target bucket: ${R2_BUCKET_NAME}\n`)

  let uploaded = 0
  let skipped = 0
  let failed = 0

  // Process in batches
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY)

    await Promise.all(batch.map(async (filename) => {
      const key = `products/${filename}`
      const filePath = path.join(sourceDir, filename)

      try {
        const exists = await fileExistsInR2(key)
        if (exists) {
          skipped++
          process.stdout.write(`\r⏭ Skipped: ${skipped} | ✅ Uploaded: ${uploaded} | ❌ Failed: ${failed}`)
          return
        }

        await uploadFile(filePath, key)
        uploaded++
        process.stdout.write(`\r⏭ Skipped: ${skipped} | ✅ Uploaded: ${uploaded} | ❌ Failed: ${failed}`)
      } catch (err) {
        failed++
        console.error(`\n❌ Failed: ${filename} - ${err.message}`)
      }
    }))
  }

  console.log(`\n\n✨ Done!`)
  console.log(`   Uploaded: ${uploaded}`)
  console.log(`   Skipped:  ${skipped}`)
  console.log(`   Failed:   ${failed}`)
  console.log(`   Total:    ${files.length}`)
}

// Parse args
const args = process.argv.slice(2)
const dirIndex = args.indexOf('--dir')
const sourceDir = dirIndex !== -1 ? args[dirIndex + 1] : path.resolve(process.cwd(), 'images')

runUpload(sourceDir)
