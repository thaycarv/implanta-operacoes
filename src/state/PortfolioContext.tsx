import { createContext, type Dispatch, type PropsWithChildren, useContext, useEffect, useMemo, useReducer } from 'react'
import type { PortfolioState } from '../types'
import { loadState, persistState, portfolioReducer, type PortfolioAction } from './portfolio'

interface PortfolioContextValue {
  state: PortfolioState
  dispatch: Dispatch<PortfolioAction>
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null)

export function PortfolioProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(portfolioReducer, undefined, () => loadState())
  useEffect(() => { persistState(state) }, [state])
  const value = useMemo(() => ({ state, dispatch }), [state])
  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (!context) throw new Error('usePortfolio must be used inside PortfolioProvider')
  return context
}
