// Tests for POST /api/chat
// Acceptance criteria: AC-CHAT-4, AC-CHAT-7, AC-CHAT-8
// Stack: JavaScript ES2022, Vitest, Next.js 15 App Router

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/chat/route'

function makeRequest(body) {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const mockGatewayResponse = (content) => ({
  ok: true,
  status: 200,
  json: () =>
    Promise.resolve({
      choices: [
        {
          message: { role: 'assistant', content },
          finish_reason: 'stop',
        },
      ],
    }),
})

describe('POST /api/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.OPENCLAW_GATEWAY_TOKEN = 'test-gateway-token'
    process.env.OPENCLAW_GATEWAY_URL = 'http://localhost:18789/v1/chat/completions'
    vi.stubGlobal('fetch', vi.fn())
  })

  // AC-CHAT-4: sends messages to gateway and returns assistant reply
  it('returns 200 with assistant message for valid request', async () => {
    fetch.mockResolvedValueOnce(mockGatewayResponse('Hello! How can I help?'))

    const req = makeRequest({
      messages: [{ role: 'user', content: 'What services do you offer?' }],
    })

    const response = await POST(req)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.message).toBe('Hello! How can I help?')
  })

  // AC-CHAT-7, AC-CHAT-8: system prompt is prepended to every request
  it('prepends a system prompt as the first message sent to the gateway', async () => {
    fetch.mockResolvedValueOnce(mockGatewayResponse('I can help with that.'))

    const req = makeRequest({
      messages: [{ role: 'user', content: 'Tell me about Dalu Dev.' }],
    })

    await POST(req)

    expect(fetch).toHaveBeenCalledOnce()
    const [url, options] = fetch.mock.calls[0]
    expect(url).toBe(process.env.OPENCLAW_GATEWAY_URL)

    const requestBody = JSON.parse(options.body)
    expect(requestBody.messages[0].role).toBe('system')
    expect(requestBody.messages[0].content).toBeTruthy()
    expect(requestBody.messages[0].content.length).toBeGreaterThan(50)
  })

  it('passes user messages after the system prompt', async () => {
    fetch.mockResolvedValueOnce(mockGatewayResponse('Sure thing.'))

    const userMessages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
      { role: 'user', content: 'What can you build?' },
    ]

    const req = makeRequest({ messages: userMessages })
    await POST(req)

    const requestBody = JSON.parse(fetch.mock.calls[0][1].body)
    // system prompt is index 0; user messages follow
    expect(requestBody.messages.slice(1)).toEqual(userMessages)
  })

  it('sends Authorization header with Bearer token', async () => {
    fetch.mockResolvedValueOnce(mockGatewayResponse('OK'))

    const req = makeRequest({ messages: [{ role: 'user', content: 'Hi' }] })
    await POST(req)

    const options = fetch.mock.calls[0][1]
    expect(options.headers['Authorization']).toBe('Bearer test-gateway-token')
  })

  it('sends stream: false to the gateway', async () => {
    fetch.mockResolvedValueOnce(mockGatewayResponse('OK'))

    const req = makeRequest({ messages: [{ role: 'user', content: 'Hi' }] })
    await POST(req)

    const requestBody = JSON.parse(fetch.mock.calls[0][1].body)
    expect(requestBody.stream).toBe(false)
  })

  // Missing/empty messages → 400
  it('returns 400 when messages is missing', async () => {
    const req = makeRequest({})
    const response = await POST(req)

    expect(response.status).toBe(400)
  })

  it('returns 400 when messages is an empty array', async () => {
    const req = makeRequest({ messages: [] })
    const response = await POST(req)

    expect(response.status).toBe(400)
  })

  // Gateway unavailable → 502
  it('returns 502 when the gateway returns a 5xx error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: () => Promise.resolve({ error: 'Service unavailable' }),
    })

    const req = makeRequest({ messages: [{ role: 'user', content: 'Hi' }] })
    const response = await POST(req)

    expect(response.status).toBe(502)
  })

  it('returns 502 when fetch rejects (gateway unreachable)', async () => {
    fetch.mockRejectedValueOnce(new Error('ECONNREFUSED'))

    const req = makeRequest({ messages: [{ role: 'user', content: 'Hi' }] })
    const response = await POST(req)

    expect(response.status).toBe(502)
  })

  // Gateway token must not leak to client
  it('does not include OPENCLAW_GATEWAY_TOKEN in response body', async () => {
    fetch.mockResolvedValueOnce(mockGatewayResponse('OK'))

    const req = makeRequest({ messages: [{ role: 'user', content: 'Hi' }] })
    const response = await POST(req)
    const text = await response.text()

    expect(text).not.toContain('test-gateway-token')
  })

  // Gateway URL must not leak to client
  it('does not include OPENCLAW_GATEWAY_URL in response body', async () => {
    fetch.mockResolvedValueOnce(mockGatewayResponse('OK'))

    const req = makeRequest({ messages: [{ role: 'user', content: 'Hi' }] })
    const response = await POST(req)
    const text = await response.text()

    expect(text).not.toContain('localhost:18789')
  })
})
