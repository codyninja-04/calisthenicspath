import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-5-5'
