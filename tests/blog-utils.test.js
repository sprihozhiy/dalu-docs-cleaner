// Tests for lib/blog.js — getAllPosts() and getPostBySlug()
// Acceptance criteria: AC-BLOG-1, AC-BLOG-2, AC-BLOG-3, AC-BLOG-4, AC-BLOG-5, AC-BLOG-6
// Stack: JavaScript ES2022, Vitest

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAllPosts, getPostBySlug } from '@/lib/blog'

// Mock the filesystem and markdown packages
vi.mock('fs', () => ({
  default: {
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
    existsSync: vi.fn(),
  },
  readdirSync: vi.fn(),
  readFileSync: vi.fn(),
  existsSync: vi.fn(),
}))

vi.mock('gray-matter', () => ({
  default: vi.fn(),
}))

vi.mock('remark', () => ({
  remark: vi.fn(),
}))

vi.mock('remark-html', () => ({
  default: vi.fn(),
}))

import fs from 'fs'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

const validPost1 = {
  content: '# Hello\n\nThis is the body.',
  data: {
    title: 'Hello World',
    date: '2026-03-28',
    category: 'tech',
    excerpt: 'An intro post.',
    tags: ['javascript', 'next.js'],
  },
}

const validPost2 = {
  content: '# Second Post\n\nBody here.',
  data: {
    title: 'Second Post',
    date: '2026-02-01',
    category: 'ai',
    excerpt: 'About AI stuff.',
    tags: [],
  },
}

const incompletePost = {
  content: '# Broken',
  data: {
    // missing title, date, category, excerpt
  },
}

describe('getAllPosts()', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // AC-BLOG-1: returns posts sorted by date descending
  it('returns all valid posts sorted by date descending', () => {
    fs.readdirSync.mockReturnValue(['second-post.md', 'hello-world.md'])
    matter.mockImplementation((content) => {
      if (content.includes('Second Post')) return validPost2
      return validPost1
    })

    const posts = getAllPosts()

    expect(posts).toHaveLength(2)
    expect(posts[0].slug).toBe('hello-world')   // 2026-03-28 is newer
    expect(posts[1].slug).toBe('second-post')    // 2026-02-01 is older
  })

  // AC-BLOG-2: each post has required display fields
  it('returns posts with slug, title, date, category, and excerpt', () => {
    fs.readdirSync.mockReturnValue(['hello-world.md'])
    matter.mockReturnValue(validPost1)

    const posts = getAllPosts()

    expect(posts[0]).toMatchObject({
      slug: 'hello-world',
      title: 'Hello World',
      date: '2026-03-28',
      category: 'tech',
      excerpt: 'An intro post.',
    })
  })

  it('defaults tags to empty array when not in frontmatter', () => {
    fs.readdirSync.mockReturnValue(['no-tags.md'])
    matter.mockReturnValue({
      content: '# Post',
      data: {
        title: 'No Tags',
        date: '2026-01-01',
        category: 'agency-life',
        excerpt: 'A post without tags.',
        // no tags field
      },
    })

    const posts = getAllPosts()

    expect(posts[0].tags).toEqual([])
  })

  // AC-BLOG-5: posts missing required frontmatter are excluded
  it('excludes posts missing required frontmatter fields', () => {
    fs.readdirSync.mockReturnValue(['broken.md', 'hello-world.md'])
    matter.mockImplementation((content) => {
      if (content.includes('Broken')) return incompletePost
      return validPost1
    })

    const posts = getAllPosts()

    expect(posts).toHaveLength(1)
    expect(posts[0].slug).toBe('hello-world')
  })

  it('does not include the content (HTML) field in listing results', () => {
    fs.readdirSync.mockReturnValue(['hello-world.md'])
    matter.mockReturnValue(validPost1)

    const posts = getAllPosts()

    expect(posts[0].content).toBeUndefined()
  })

  it('returns empty array when content/blog/ has no .md files', () => {
    fs.readdirSync.mockReturnValue([])

    const posts = getAllPosts()

    expect(posts).toEqual([])
  })

  // AC-BLOG-6: category must be a valid value
  it('excludes posts with an invalid category value', () => {
    fs.readdirSync.mockReturnValue(['bad-category.md'])
    matter.mockReturnValue({
      content: '# Post',
      data: {
        title: 'Bad Category',
        date: '2026-01-01',
        category: 'random-invalid-category',
        excerpt: 'Some excerpt.',
      },
    })

    const posts = getAllPosts()

    expect(posts).toHaveLength(0)
  })

  it('accepts all valid category values', () => {
    const validCategories = ['tech', 'ai', 'project-updates', 'agency-life']

    for (const category of validCategories) {
      fs.readdirSync.mockReturnValue([`${category}-post.md`])
      matter.mockReturnValue({
        content: '# Post',
        data: { title: 'T', date: '2026-01-01', category, excerpt: 'E.' },
      })

      const posts = getAllPosts()
      expect(posts).toHaveLength(1)
    }
  })
})

describe('getPostBySlug(slug)', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Set up remark chain mock
    const mockProcess = { toString: () => '<h1>Hello</h1><p>This is the body.</p>' }
    const mockUse = vi.fn().mockReturnThis()
    const mockProcessFn = vi.fn().mockResolvedValue(mockProcess)
    remark.mockReturnValue({ use: mockUse, process: mockProcessFn })
  })

  // AC-BLOG-3: returns full post with HTML content
  it('returns a post with HTML content for a valid slug', async () => {
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockReturnValue('---\ntitle: Hello World\n---\n# Hello\n')
    matter.mockReturnValue(validPost1)

    const post = await getPostBySlug('hello-world')

    expect(post).not.toBeNull()
    expect(post.slug).toBe('hello-world')
    expect(post.title).toBe('Hello World')
    expect(typeof post.content).toBe('string')
    expect(post.content.length).toBeGreaterThan(0)
  })

  it('includes all required frontmatter fields in the returned post', async () => {
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockReturnValue('raw')
    matter.mockReturnValue(validPost1)

    const post = await getPostBySlug('hello-world')

    expect(post).toMatchObject({
      slug: 'hello-world',
      title: 'Hello World',
      date: '2026-03-28',
      category: 'tech',
      excerpt: 'An intro post.',
      tags: ['javascript', 'next.js'],
    })
  })

  // AC-BLOG-4: missing slug returns null
  it('returns null for a slug that does not exist', async () => {
    fs.existsSync.mockReturnValue(false)

    const post = await getPostBySlug('does-not-exist')

    expect(post).toBeNull()
  })

  it('does not throw when the file is missing — returns null gracefully', async () => {
    fs.existsSync.mockReturnValue(false)

    await expect(getPostBySlug('missing-slug')).resolves.toBeNull()
  })
})
