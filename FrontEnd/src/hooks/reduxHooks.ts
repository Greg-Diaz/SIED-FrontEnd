import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

import type { AppDispatch, RootState } from '@/app/store'

/**
 * Hooks tipados de Redux — usar en lugar de `useDispatch`/`useSelector` sin tipar
 * (PROMPT.md §5: evitar "any"; §34: TypeScript estricto).
 */
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
