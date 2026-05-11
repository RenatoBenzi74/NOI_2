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
import DialogueView from '@/components/DialogueView'

import { analyzeListeningResponse } from '@/lib/analyzeListeningResponse'
import { generateScenario } from '@/lib/generateScenario'
import { getBestAnalysis } from '@/lib/dialogueEngine'
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
  DialogueTurn,
  DialogueEndReason,
  SavedExperience,
  Scenario,
} from '@/lib/types'

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>('home')
  const [selectedContext, setSelectedContext] = useState<Context | null>(null)
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [userResponse, setUserResponse] = useState('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [reflection, setReflection] = useState('')
  const [savedExperiences, setSavedExperiences] = useState<SavedExperience[]>([])
  const [usedScenarioIds, setUsedScenarioIds] = useState<string[]>([])
  const [dialogueTurns, setDialogueTurns] = useState<DialogueTurn[]>([])
  const [dialogueEndReason, setDialogueEndReason] = useState<DialogueEndReason | null>(null)

  useEffect(() => { setSavedExperiences(getExperiences()) }, [])

  const goTo = useCallback((s: AppScreen) => {
    setScreen(s)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const handleStartTraining = () => { goTo('context') }

  const handleContextConfirm = () => {
    if (!selectedContext) return
    const scenario = generateScenario(selectedContext, usedScenarioIds)
    setCurrentScenario(scenario)
    setUserResponse(''); setAnalysisResult(null); setReflection('')
    setDialogueTurns([]); setDialogueEndReason(null)
    goTo('scenario')
  }

  const handleRegenerate = () => {
    if (!selectedContext) return
    const scenario = generateScenario(selectedContext, usedScenarioIds)
    setCurrentScenario(scenario)
    setUserResponse(''); setAnalysisResult(null)
    setDialogueTurns([]); setDialogueEndReason(null)
  }

  const handleResponseSubmit = (response: string) => {
    if (!currentScenario || !selectedContext) return
    setUserResponse(response)
    const analysis = analyzeListeningResponse(response, currentScenario, selectedContext)
    setAnalysisResult(analysis)
    setUsedScenarioIds((prev) => [...prev, currentScenario.id])
    goTo('dashboard')
  }

  const handleDialogueComplete = (turns: DialogueTurn[], endReason: DialogueEndReason) => {
    if (!currentScenario) return
    setDialogueTurns(turns)
    setDialogueEndReason(endReason)
    setUsedScenarioIds((prev) => [...prev, currentScenario.id])
    const bestAnalysis = getBestAnalysis(turns)
    if (bestAnalysis) {
      setAnalysisResult(bestAnalysis)
      if (turns.length > 0) setUserResponse(turns[turns.length - 1].userResponse)
    }
    if (endReason === 'resolved') goTo('celebration')
    else if (endReason === 'closed') goTo('dialogue_end')
    else goTo('feedback')
  }

  const handleReflectionSave = (ref: string) => {
    setReflection(ref)
    if (currentScenario && selectedContext && analysisResult) {
      const experience: SavedExperience = {
        id: generateExperienceId(),
        timestamp: Date.now(),
        context: selectedContext,
        scenario: currentScenario,
        userResponse,
        analysis: analysisResult,
        reflection: ref,
        dialogueTurns: dialogueTurns.length > 0 ? dialogueTurns : undefined,
        dialogueEndReason: dialogueEndReason ?? undefined,
      }
      saveExperience(experience)
      setSavedExperiences(getExperiences())
    }
    goTo('summary')
  }

  const handleRestartSameContext = () => {
    if (!selectedContext) { goTo('context'); return }
    const scenario = generateScenario(selectedContext, usedScenarioIds)
    setCurrentScenario(scenario)
    setUserResponse(''); setAnalysisResult(null); setReflection('')
    setDialogueTurns([]); setDialogueEndReason(null)
    goTo('scenario')
  }

  const handleChangeContext = () => {
    setSelectedContext(null); setCurrentScenario(null)
    setUserResponse(''); setAnalysisResult(null); setReflection('')
    setDialogueTurns([]); setDialogueEndReason(null)
    goTo('context')
  }

  const handleClearHistory = () => {
    if (window.confirm('Vuoi eliminare tutto lo storico? Questa azione non è reversibile.')) {
      clearExperiences(); setSavedExperiences([])
    }
  }

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen onStart={handleStartTraining} onHistory={() => goTo('history')} />
      case 'context':
        return (
          <ContextSelector selected={selectedContext} onSelect={setSelectedContext}
            onConfirm={handleContextConfirm} onBack={() => goTo('home')} />
        )
      case 'scenario':
        if (!currentScenario) return null
        return (
          <ScenarioCard scenario={currentScenario} onProceed={() => goTo('dialogue')}
            onRegenerate={handleRegenerate} onBack={() => goTo('context')} />
        )
      case 'dialogue':
        if (!currentScenario || !selectedContext) return null
        return (
          <DialogueView scenario={currentScenario} context={selectedContext}
            onDialogueComplete={handleDialogueComplete} onBack={() => goTo('scenario')} />
        )
      case 'dialogue_end':
        return (
          <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem' }}>
            <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
              <div className="glass-card-strong" style={{ padding: '2.5rem 2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.7 }}>◌</div>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 300, color: 'var(--text-primary)' }}>
                  Il dialogo si è chiuso
                </h2>
                <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  L&apos;altra persona ha scelto di ritirarsi. Quando l&apos;ascolto non crea abbastanza
                  sicurezza, chi parla preferisce chiudersi. Non è un fallimento — è un segnale
                  prezioso su dove c&apos;è ancora spazio di crescita.
                </p>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => goTo('feedback')}>
                  Esplora cosa è successo
                </button>
              </div>
            </div>
          </div>
        )
      case 'dashboard':
        if (!analysisResult) return null
        return <ListeningDashboard analysis={analysisResult} onContinue={() => goTo('feedback')} onBack={() => goTo('dialogue')} />
      case 'feedback':
        if (!analysisResult) return null
        return (
          <FeedbackPanel feedback={analysisResult.feedback} onContinue={() => goTo('alternative')}
            onBack={() => goTo(dialogueTurns.length > 0 ? 'dialogue_end' : 'dashboard')} />
        )
      case 'alternative':
        if (!analysisResult) return null
        return (
          <AlternativeResponse userResponse={userResponse} alternativeResponse={analysisResult.alternativeResponse}
            whyAlternativeWorks={analysisResult.whyAlternativeWorks} onContinue={() => goTo('reflection')} onBack={() => goTo('feedback')} />
        )
      case 'reflection':
        return <ReflectionForm onSave={handleReflectionSave} onBack={() => goTo('alternative')} />
      case 'celebration':
        if (!analysisResult || !selectedContext) return null
        return (
          <CelebrationScreen globalState={analysisResult.globalState} globalStateNuance={analysisResult.globalStateNuance}
            context={selectedContext} onNewScenario={handleRestartSameContext}
            onChangeContext={handleChangeContext} onViewSummary={() => goTo('feedback')} />
        )
      case 'summary':
        if (!currentScenario || !selectedContext || !analysisResult) return null
        return (
          <SummaryScreen context={selectedContext} scenario={currentScenario} userResponse={userResponse}
            analysis={analysisResult} reflection={reflection} onRestart={handleRestartSameContext}
            onChangeContext={handleChangeContext} onHistory={() => goTo('history')} />
        )
      case 'history':
        return (
          <HistoryView experiences={savedExperiences}
            onClose={() => goTo(analysisResult ? 'summary' : 'home')} onClear={handleClearHistory} />
        )
      default: return null
    }
  }

  return <AppShell>{renderScreen()}</AppShell>
            }
