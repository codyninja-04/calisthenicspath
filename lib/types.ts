export type Category = 'pull' | 'push' | 'core' | 'legs' | 'balance'
export type TargetType = 'reps' | 'hold'
export type Location = 'home' | 'outdoor_gym' | 'commercial_gym'
export type Plan = 'free' | 'pro'

export interface ProgressionStep {
  level: number
  name: string
  description: string
  // Human version of the target, e.g. "8 reps" or "10 sec hold".
  prerequisite_reps: string
  // Machine version of the same target, so readiness can be worked out.
  target_type: TargetType
  target_value: number
  per_side?: boolean
  cues: string[]
  common_faults: string[]
}

export interface Prerequisite {
  slug: string
  // The step in that tree you should have cleared first.
  level: number
}

export interface SkillTreeDef {
  slug: string
  name: string
  category: Category
  summary: string
  prerequisites: Prerequisite[]
  progressions: ProgressionStep[]
}

export interface SkillTree extends SkillTreeDef {
  id: string
  sort_order: number
}

export interface SkillProgress {
  id: string
  user_id: string
  skill_tree_id: string
  // The step you're working on. Equal to progressions.length once the skill is mastered.
  current_level: number
  current_reps_or_hold: string | null
  current_value: number | null
  started_at: string
  last_progress_update: string | null
}

export type ProgressEventKind = 'start' | 'attempt' | 'advance' | 'regress'

export interface ProgressEvent {
  id: string
  skill_tree_id: string
  kind: ProgressEventKind
  level: number
  value: number | null
  created_at: string
}

export interface FormIssue {
  issue: string
  fix: string
}

export interface FormAnalysis {
  image_usable: boolean
  feedback: string
  form_issues: FormIssue[]
  what_looks_good: string[]
  progression_ready: boolean
  next_step_advice: string
  safety_note: string | null
}

export interface FormCheck {
  id: string
  skill_tree_id: string
  skill_level: number
  checked_at: string
  photo_url: string | null
  photo_paths: string[]
  ai_feedback: string | null
  form_issues: string[]
  progression_ready: boolean | null
  next_step_advice: string | null
  details: FormAnalysis | null
}

export interface TrainingSession {
  id: string
  session_date: string
  skills_trained: string[]
  notes: string | null
  location: Location | null
  duration_min: number | null
  rpe: number | null
  created_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  plan: Plan
  created_at: string
}
