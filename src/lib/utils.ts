import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScore(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Needs Improvement'
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-secondary'
  if (score >= 60) return 'text-primary'
  if (score >= 40) return 'text-yellow-500'
  return 'text-red-500'
}
