'use client'

import { useCallback, useEffect, useState } from 'react'
import AppShell from '@/components/AppShell'
import HomeScreen from '@/components/HomeScreen'
import ContextSelector from '@/components/ContextSelector'
import ScenarioCard from '@/components/ScenarioCard'
import ConversationScreen from '@/components/ConversationScreen'
import ReflectionForm from '@/components/ReflectionForm'
import CelebrationScreen from '@/components/CelebrationScreen'
import SummaryScreen from '@/components/SummaryScreen'
import HistoryView from '@/components/HistoryView'

import { generateScenario } from '@/lib/generateScenario'
import {
  saveExperience,
  getExperiences,
  clearExperiences,
  generateExperienceId,
} from '@/lib/storage'

import {
  AppScreen,
  AnalysisResult,
  Context,
  ConversationTurn,
  SavedExperience,
  Scenario,
} from '@/lib/types'

export default function Home() {
  // ============================================================
  // State
  // ============================================================
  const [screen, setScreen] = useState<AppScreen>('home')
  const [selectedContext, setSelectedContext] = useState<Context | null>(null)
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [conversationTurns, setConversationTurns] = useState<ConversationTurn[]>([])
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [reflection, setReflection] = useState('')
  const [savedExperiences, setSavedExperiences] = useState<SavedExperience[]>([])
  const [usedScenarioIds, setUsedScenarioIds] = useState<string[]>([])

  // Load experiences on mount
  useEffect(() => {
    setSavedExperiences(getExperiences())
  }, [])

  // ============================================================
  // Navigation helpers
  // ============================================================

  const goTo = useCallback((s: AppScreen) => {
    setScreen(s)
    // Scroll to top on screen change
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // ============================================================
  // Flow handlers
  // ============================================================

  const handleStartTraining = () => {
    goTo('context')
  }

  const handleContextConfirm = () => {
    if (!selectedContext) return
    const scenario = generateScenario(selectedContext, usedScenarioIds)
    setCurrentScenario(scenario)
    setConversationTurns([])
    setAnalysisResult(null)
    setReflection('')
    goTo('scenario')
  }

  const handleRegenerate = () => {
    if (!selectedContext) return
    const scenario = generateScenario(selectedContext, usedScenarioIds)
    setCurrentScenario(scenario)
    setConversationTurns([])
    setAnalysisResult(null)
  }

  const handleConversationComplete = (turns: ConversationTurn[]) => {
    if (!currentScenario) return
    const lastAnalysis = turns[turns.length - 1].analysis
    setConversationTurns(turns)
    setAnalysisResult(lastAnalysis)
    setUsedScenarioIds((prev) => [...prev, currentScenario.id])
    goTo('reflection')
  }

  const handleReflectionSave = (ref: string) => {
    setReflection(ref)

    if (currentScenario && selectedContext && analysisResult) {
      const lastUserResponse = conversationTurns[conversationTurns.length - 1]?.userResponse ?? ''
      const experience: SavedExperience = {
        id: generateExperienceId(),
        timestamp: Date.now(),
        context: selectedContext,
        scenario: currentScenario,
        userResponse: lastUserResponse,
        analysis: analysisResult,
        reflection: ref,
        turns: conversationTurns,
      }
      saveExperience(experience)
      setSavedExperiences(getExperiences())
    }

    // Se l'ascolto è stato di qualità, mostra la schermata di celebrazione
    const highQuality =
      analysisResult?.globalState === 'curiosità' ||
      analysisResult?.globalState === 'presenza'
    goTo(highQuality ? 'celebration' : 'summary')
  }

  const handleRestartSameContext = () => {
    if (!selectedContext) {
      goTo('context')
      return
    }
    const scenario = generateScenario(selectedContext, usedScenarioIds)
    setCurrentScenario(scenario)
    setConversationTurns([])
    setAnalysisResult(null)
    setReflection('')
    goTo('scenario')
  }

  const handleChangeContext = () => {
    setSelectedContext(null)
    setCurrentScenario(null)
    setConversationTurns([])
    setAnalysisResult(null)
    setReflection('')
    goTo('context')
  }

  const handleClearHistory = () => {
    if (window.confirm('Vuoi eliminare tutto lo storico? Questa azione non è reversibile.')) {
      clearExperiences()
      setSavedExperiences([])
    }
  }

  // ============================================================
  // Render
  // ============================================================

  const renderScreen = () => {
    switch (screen) {

      case 'home':
        return (
          <HomeScreen
            onStart={handleStartTraining}
            onHistory={() => goTo('history')}
          />
        )

      case 'context':
        return (
          <ContextSelector
            selected={selectedContext}
            onSelect={setSelectedContext}
            onConfirm={handleContextConfirm}
            onBack={() => goTo('home')}
          />
        )

      case 'scenario':
        if (!currentScenario) return null
        return (
          <ScenarioCard
            scenario={currentScenario}
            onProceed={() => goTo('conversation')}
            onRegenerate={handleRegenerate}
            onBack={() => goTo('context')}
          />
        )

      case 'conversation':
        if (!currentScenario || !selectedContext) return null
        return (
          <ConversationScreen
            scenario={currentScenario}
            context={selectedContext}
            onComplete={handleConversationComplete}
            onBack={() => goTo('scenario')}
          />
        )

      case 'reflection':
        return (
          <ReflectionForm
            onSave={handleReflectionSave}
            onBack={() => goTo('conversation')}
          />
        )

      case 'celebration':
        if (!analysisResult || !selectedContext) return null
        return (
          <CelebrationScreen
            globalState={analysisResult.globalState}
            globalStateNuance={analysisResult.globalStateNuance}
            context={selectedContext}
            onNewScenario={handleRestartSameContext}
            onChangeContext={handleChangeContext}
            onViewSummary={() => goTo('summary')}
          />
        )

      case 'summary':
        if (!currentScenario || !selectedContext || !analysisResult) return null
        return (
          <SummaryScreen
            context={selectedContext}
            scenario={currentScenario}
            turns={conversationTurns}
            analysis={analysisResult}
            reflection={reflection}
            onRestart={handleRestartSameContext}
            onChangeContext={handleChangeContext}
            onHistory={() => goTo('history')}
          />
        )

      case 'history':
        return (
          <HistoryView
            experiences={savedExperiences}
            onClose={() => goTo(analysisResult ? 'summary' : 'home')}
            onClear={handleClearHistory}
          />
        )

      default:
        return null
    }
  }

  return (
    <AppShell>
      {renderScreen()}
    </AppShell>
  )
    }
