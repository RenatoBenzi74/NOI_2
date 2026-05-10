'use client'

import { useCallback, useEffect, useState } from 'react'
import AppShell from '@/components/AppShell'
import HomeScreen from '@/components/HomeScreen'
import ContextSelector from '@/components/ContextSelector'
import ScenarioCard from '@/components/ScenarioCard'
import ResponseInput from '@/components/ResponseInput'
import ListeningDashboard from '@/components/ListeningDashboard'
import FeedbackPanel from '@/components/FeedbackPanel'
import AlternativeResponse from '@/components/AlternativeResponse'
import ReflectionForm from '@/components/ReflectionForm'
import CelebrationScreen from '@/components/CelebrationScreen'
import SummaryScreen from '@/components/SummaryScreen'
import HistoryView from '@/components/HistoryView'

import { analyzeListeningResponse } from '@/lib/analyzeListeningResponse'
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
  const [userResponse, setUserResponse] = useState('')
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
    setUserResponse('')
    setAnalysisResult(null)
    setReflection('')
    goTo('scenario')
  }

  const handleRegenerate = () => {
    if (!selectedContext) return
    const scenario = generateScenario(selectedContext, usedScenarioIds)
    setCurrentScenario(scenario)
    setUserResponse('')
    setAnalysisResult(null)
  }

  const handleResponseSubmit = (response: string) => {
    if (!currentScenario || !selectedContext) return
    setUserResponse(response)
    const analysis = analyzeListeningResponse(response, currentScenario, selectedContext)
    setAnalysisResult(analysis)
    // Track used scenario
    setUsedScenarioIds((prev) => [...prev, currentScenario.id])
    goTo('dashboard')
  }

  const handleReflectionSave = (ref: string) => {
    setReflection(ref)

    // Save the full experience
    if (currentScenario && selectedContext && analysisResult) {
      const experience: SavedExperience = {
        id: generateExperienceId(),
        timestamp: Date.now(),
        context: selectedContext,
        scenario: currentScenario,
        userResponse,
        analysis: analysisResult,
        reflection: ref,
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
    setUserResponse('')
    setAnalysisResult(null)
    setReflection('')
    goTo('scenario')
  }

  const handleChangeContext = () => {
    setSelectedContext(null)
    setCurrentScenario(null)
    setUserResponse('')
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
            onProceed={() => goTo('response')}
            onRegenerate={handleRegenerate}
            onBack={() => goTo('context')}
          />
        )

      case 'response':
        if (!currentScenario) return null
        return (
          <ResponseInput
            scenario={currentScenario}
            initialValue={userResponse}
            onSubmit={handleResponseSubmit}
            onBack={() => goTo('scenario')}
          />
        )

      case 'dashboard':
        if (!analysisResult) return null
        return (
          <ListeningDashboard
            analysis={analysisResult}
            onContinue={() => goTo('feedback')}
            onBack={() => goTo('response')}
          />
        )

      case 'feedback':
        if (!analysisResult) return null
        return (
          <FeedbackPanel
            feedback={analysisResult.feedback}
            onContinue={() => goTo('alternative')}
            onBack={() => goTo('dashboard')}
          />
        )

      case 'alternative':
        if (!analysisResult) return null
        return (
          <AlternativeResponse
            userResponse={userResponse}
            alternativeResponse={analysisResult.alternativeResponse}
            whyAlternativeWorks={analysisResult.whyAlternativeWorks}
            onContinue={() => goTo('reflection')}
            onBack={() => goTo('feedback')}
          />
        )

      case 'reflection':
        return (
          <ReflectionForm
            onSave={handleReflectionSave}
            onBack={() => goTo('alternative')}
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
            userResponse={userResponse}
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
