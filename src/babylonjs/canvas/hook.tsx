import { useContext } from 'react'

import { CanvasContext } from './context'

export const useCanvas = () => useContext(CanvasContext)
