// Tests for data/portfolio.js — static portfolio data integrity
// Acceptance criteria: AC-PORT-1, AC-PORT-2, AC-PORT-5
// Stack: JavaScript ES2022, Vitest

import { describe, it, expect } from 'vitest'
import { projects } from '@/data/portfolio'

const VALID_STATUSES = ['live', 'in-development']

describe('portfolio data (data/portfolio.js)', () => {
  // AC-PORT-1: data module exports an array
  it('exports a non-empty array of projects', () => {
    expect(Array.isArray(projects)).toBe(true)
    expect(projects.length).toBeGreaterThan(0)
  })

  // AC-PORT-2: every project has required display fields
  it('every project has id, name, description, stack, status', () => {
    for (const project of projects) {
      expect(project.id, `project ${JSON.stringify(project)} missing id`).toBeTruthy()
      expect(typeof project.id).toBe('string')

      expect(project.name, `project ${project.id} missing name`).toBeTruthy()
      expect(typeof project.name).toBe('string')

      expect(project.description, `project ${project.id} missing description`).toBeTruthy()
      expect(typeof project.description).toBe('string')

      expect(Array.isArray(project.stack), `project ${project.id} stack must be an array`).toBe(true)
      expect(project.stack.length, `project ${project.id} stack must not be empty`).toBeGreaterThan(0)

      expect(
        VALID_STATUSES.includes(project.status),
        `project ${project.id} has invalid status "${project.status}"`
      ).toBe(true)
    }
  })

  // AC-PORT-3, AC-PORT-4: liveUrl and repoUrl are either null or valid URL strings
  it('every project has liveUrl as null or a non-empty string', () => {
    for (const project of projects) {
      expect(
        project.liveUrl === null || typeof project.liveUrl === 'string',
        `project ${project.id} liveUrl must be null or string`
      ).toBe(true)

      if (project.liveUrl !== null) {
        expect(project.liveUrl.length).toBeGreaterThan(0)
        expect(project.liveUrl).toMatch(/^https?:\/\//)
      }
    }
  })

  it('every project has repoUrl as null or a non-empty string', () => {
    for (const project of projects) {
      expect(
        project.repoUrl === null || typeof project.repoUrl === 'string',
        `project ${project.id} repoUrl must be null or string`
      ).toBe(true)

      if (project.repoUrl !== null) {
        expect(project.repoUrl.length).toBeGreaterThan(0)
        expect(project.repoUrl).toMatch(/^https?:\/\//)
      }
    }
  })

  // AC-PORT-5: at least one project with each status
  it('contains at least one "live" project', () => {
    const liveProjects = projects.filter((p) => p.status === 'live')
    expect(liveProjects.length).toBeGreaterThan(0)
  })

  // No duplicate IDs
  it('all project ids are unique', () => {
    const ids = projects.map((p) => p.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  // No lorem ipsum placeholder content
  it('no project description contains lorem ipsum placeholder text', () => {
    for (const project of projects) {
      expect(project.description.toLowerCase()).not.toContain('lorem ipsum')
      expect(project.name.toLowerCase()).not.toContain('lorem ipsum')
    }
  })
})
