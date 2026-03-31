import { describe, expect, it } from 'vitest'
import { DataUrlImageStoringStrategy } from '../../../../src/strategies/images/DataUrlImageStoringStrategy'

describe('DataUrlImageStoringStrategy', () => {
  it('converts an ArrayBuffer to a base64 data URL', async () => {
    const strategy = new DataUrlImageStoringStrategy()
    const buffer = new TextEncoder().encode('hello').buffer

    const result = await strategy.storeImage(buffer, 'image/png')

    expect(result).toMatch(/^data:image\/png;base64,/)
    expect(result).toBe('data:image/png;base64,aGVsbG8=')
  })

  it('preserves the content type in the data URL', async () => {
    const strategy = new DataUrlImageStoringStrategy()
    const buffer = new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer

    const result = await strategy.storeImage(buffer, 'image/jpeg')

    expect(result).toMatch(/^data:image\/jpeg;base64,/)
  })

  it('handles empty buffers', async () => {
    const strategy = new DataUrlImageStoringStrategy()
    const buffer = new ArrayBuffer(0)

    const result = await strategy.storeImage(buffer, 'image/png')

    expect(result).toBe('data:image/png;base64,')
  })
})
