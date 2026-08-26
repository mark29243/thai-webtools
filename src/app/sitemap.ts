import { MetadataRoute } from 'next'
import { textTools } from '@/data/text-tools'
import { financeTools } from '@/data/finance-tools'
import { devTools } from '@/data/dev-tools'
import { mathTools } from '@/data/math-tools'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://thai-webtools.vercel.app'
  const lastModified = new Date()

  // Base static pages
  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/directory`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/about`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/contact`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/privacy`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/terms`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/cookie-policy`, priority: 0.6, changeFrequency: 'monthly' as const },
  ]

  // Standalone tools
  const standaloneToolSlugs = [
    'time-calculator',
    'salary-calculator',
    'tax-calculator',
    'invoice-generator',
    'heic-converter',
    'mortgage-calculator',
    'gold-price',
    'lottery',
    'split-bill',
    'image-ocr',
    'fuel-price',
    'emergency-numbers',
    'diff-checker',
    'qrcode',
    'barcode',
    'image-compressor',
    'image-resizer',
    'image-to-pdf',
    'random-picker',
    'speed-test',
    'password',
    'random-number',
    'bmi-calculator',
    'percentage',
    'css-gradient',
    'box-shadow',
    'base64-to-image',
    'color-converter',
    'base64',
    'json-formatter',
    'jwt-decoder',
    'uuid',
    'url-encoder',
    'lorem-ipsum',
    'word-counter',
    'text-to-binary',
    'youtube-thumbnail',
    'tweet-generator',
    'social-fonts',
    'ascii-art',
    'timezone',
    'pdf-merge',
    'pdf-split',
    'pdf-rotate',
    'pdf-watermark',
    'pdf-page-numbers',
    'pdf-metadata',
    'pdf-ocr',
  ]

  const standaloneTools = standaloneToolSlugs.map(slug => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // Dynamic converters
  const converterTypes = [
    'length', 'weight', 'temperature', 'area', 'speed', 
    'volume', 'pressure', 'energy', 'power', 'force', 
    'angle', 'data-rate', 'frequency'
  ]
  const converterPages = converterTypes.map(type => ({
    url: `${baseUrl}/converters/${type}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Text tools
  const textPages = textTools.map(t => ({
    url: `${baseUrl}/text/${t.id}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  // Finance tools
  const financePages = financeTools.map(t => ({
    url: `${baseUrl}/finance/${t.id}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Dev tools
  const devPages = devTools.map(t => ({
    url: `${baseUrl}/dev/${t.id}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Math tools
  const mathPages = mathTools.map(t => ({
    url: `${baseUrl}/math/${t.id}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  return [
    ...staticPages,
    ...standaloneTools,
    ...converterPages,
    ...textPages,
    ...financePages,
    ...devPages,
    ...mathPages,
  ]
}
