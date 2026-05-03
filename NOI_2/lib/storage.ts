// ============================================================
// NOI² – Storage Utility (localStorage)
// Architettato per futura migrazione a Supabase
// ============================================================

import { SavedExperience } from './types'

const STORAGE_KEY = 'noi2_experiences_v1'

export function saveExperience(experience: SavedExperience): void {
  if (typeof window === 'undefined') return
  try {
    const existing = getExperiences()
    const updated = [experience, ...existing]
    // Mantieni max 100 esperienze
    const trimmed = updated.slice(0, 100)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch (err) {
    console.error('[Noi²] Errore salvataggio:', err)
  }
}

export function getExperiences(): SavedExperience[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SavedExperience[]
  } catch (err) {
    console.error('[Noi²] Errore lettura storage:', err)
    return []
  }
}

export function getExperienceById(id: string): SavedExperience | null {
  const experiences = getExperiences()
  return experiences.find((e) => e.id === id) ?? null
}

export function clearExperiences(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

export function generateExperienceId(): string {
  return `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getTodayCount(): number {
  const experiences = getExperiences()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return experiences.filter((e) => e.timestamp >= today.getTime()).length
}

// ============================================================
// FUTURA INTEGRAZIONE SUPABASE
// Quando si migrerà a Supabase, queste funzioni potranno essere
// sostituite con chiamate API mantenendo la stessa interfaccia:
//
// export async function saveExperienceRemote(experience, userId) { ... }
// export async function getExperiencesRemote(userId) { ... }
// ============================================================
