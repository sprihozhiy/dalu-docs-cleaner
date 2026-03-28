// Tests for POST /api/contact
// Acceptance criteria: AC-CONTACT-3, AC-CONTACT-7, AC-CONTACT-8, AC-CONTACT-9
// Stack: JavaScript ES2022, Vitest, Next.js 15 App Router

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/contact/route'

// Mock the Resend SDK
vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: vi.fn().mockResolvedValue({ id: 'test-email-id', error: null }),
      },
    })),
  }
})

function makeRequest(body) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.RESEND_API_KEY = 'test-resend-key'
    process.env.CONTACT_FROM_ADDRESS = 'hello@daludev.com'
  })

  // AC-CONTACT-3, AC-CONTACT-7: valid submission sends email and returns 200
  it('returns 200 and sends email for valid payload', async () => {
    const req = makeRequest({
      name: 'Jane Smith',
      email: 'jane@example.com',
      message: 'I would like to discuss a project.',
    })

    const response = await POST(req)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({ ok: true })
  })

  it('calls Resend with correct recipient and subject', async () => {
    const { Resend } = await import('resend')
    const mockSend = vi.fn().mockResolvedValue({ id: 'abc', error: null })
    Resend.mockImplementation(() => ({ emails: { send: mockSend } }))

    const req = makeRequest({
      name: 'Jane Smith',
      email: 'jane@example.com',
      message: 'Hello from test.',
    })

    await POST(req)

    expect(mockSend).toHaveBeenCalledOnce()
    const callArg = mockSend.mock.calls[0][0]
    expect(callArg.to).toContain('sprihozhiy@gmail.com')
    expect(callArg.subject).toContain('Jane Smith')
    expect(callArg.replyTo).toBe('jane@example.com')
  })

  it('includes name, email, and message in the email HTML', async () => {
    const { Resend } = await import('resend')
    const mockSend = vi.fn().mockResolvedValue({ id: 'abc', error: null })
    Resend.mockImplementation(() => ({ emails: { send: mockSend } }))

    const req = makeRequest({
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is my message.',
    })

    await POST(req)

    const callArg = mockSend.mock.calls[0][0]
    expect(callArg.html).toContain('Test User')
    expect(callArg.html).toContain('test@example.com')
    expect(callArg.html).toContain('This is my message.')
  })

  // AC-CONTACT-8: empty name rejected with 400
  it('returns 400 when name is missing', async () => {
    const req = makeRequest({ email: 'jane@example.com', message: 'Hello.' })
    const response = await POST(req)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toBeDefined()
  })

  it('returns 400 when name is whitespace only', async () => {
    const req = makeRequest({ name: '   ', email: 'jane@example.com', message: 'Hello.' })
    const response = await POST(req)

    expect(response.status).toBe(400)
  })

  // AC-CONTACT-9: invalid email format rejected with 400
  it('returns 400 when email is missing', async () => {
    const req = makeRequest({ name: 'Jane', message: 'Hello.' })
    const response = await POST(req)

    expect(response.status).toBe(400)
  })

  it('returns 400 when email is malformed', async () => {
    const req = makeRequest({ name: 'Jane', email: 'not-an-email', message: 'Hello.' })
    const response = await POST(req)

    expect(response.status).toBe(400)
  })

  // AC-CONTACT-8: empty message rejected with 400
  it('returns 400 when message is missing', async () => {
    const req = makeRequest({ name: 'Jane', email: 'jane@example.com' })
    const response = await POST(req)

    expect(response.status).toBe(400)
  })

  it('returns 400 when message is whitespace only', async () => {
    const req = makeRequest({ name: 'Jane', email: 'jane@example.com', message: '   ' })
    const response = await POST(req)

    expect(response.status).toBe(400)
  })

  it('returns 400 when message exceeds 2000 characters', async () => {
    const req = makeRequest({
      name: 'Jane',
      email: 'jane@example.com',
      message: 'x'.repeat(2001),
    })
    const response = await POST(req)

    expect(response.status).toBe(400)
  })

  // 500 when Resend throws
  it('returns 500 when Resend API throws an error', async () => {
    const { Resend } = await import('resend')
    Resend.mockImplementation(() => ({
      emails: { send: vi.fn().mockRejectedValue(new Error('Network error')) },
    }))

    const req = makeRequest({
      name: 'Jane',
      email: 'jane@example.com',
      message: 'Hello.',
    })

    const response = await POST(req)
    expect(response.status).toBe(500)
  })

  // XSS: HTML special chars in inputs must not render as HTML in email
  it('escapes HTML special characters in name, email, and message', async () => {
    const { Resend } = await import('resend')
    const mockSend = vi.fn().mockResolvedValue({ id: 'abc', error: null })
    Resend.mockImplementation(() => ({ emails: { send: mockSend } }))

    const req = makeRequest({
      name: '<script>alert(1)</script>',
      email: 'xss@example.com',
      message: '<img src=x onerror=alert(2)>',
    })

    await POST(req)

    const callArg = mockSend.mock.calls[0][0]
    expect(callArg.html).not.toContain('<script>')
    expect(callArg.html).not.toContain('<img src=x')
    expect(callArg.html).toContain('&lt;script&gt;')
  })
})
