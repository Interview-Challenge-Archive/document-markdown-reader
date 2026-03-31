import type { ImageStoringStrategy } from '../strategies/images/ImageStoringStrategy'

export interface DocumentReadOptions {
  images?: ImageStoringStrategy
}
