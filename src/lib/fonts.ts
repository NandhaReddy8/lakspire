import { Outfit, Instrument_Serif, JetBrains_Mono } from 'next/font/google'

export const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
})

export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-editorial',
  weight: ['400'],
  style: ['normal', 'italic'],
})

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500'],
})
