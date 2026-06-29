import { useReducer } from "react"
import type { ReturnReason } from "@/lib/returns/reasons"

type Step = 1 | 2 | 3
type ItemSelection = { quantity: number; reason: ReturnReason | null }

type State = {
    step: Step
    orderId: string | null
    selection: Record<string, ItemSelection> // ключ = orderItemId
}

type Action =
    | { type: "SELECT_ORDER"; orderId: string }
    | { type: "TOGGLE_ITEM"; itemId: string }
    | { type: "SET_QTY"; itemId: string; quantity: number }
    | { type: "SET_REASON"; itemId: string; reason: ReturnReason }
    | { type: "NEXT" }
    | { type: "BACK" }
    | { type: "RESET" }

const initial: State = { step: 1, orderId: null, selection: {} }

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SELECT_ORDER":
            // смена заказа сбрасывает выбор позиций
            return { ...state, orderId: action.orderId, selection: {} }

        case "TOGGLE_ITEM": {
            const next = { ...state.selection }
            if (next[action.itemId]) delete next[action.itemId]
            else next[action.itemId] = { quantity: 1, reason: null }
            return { ...state, selection: next }
        }

        case "SET_QTY":
            return {
                ...state,
                selection: {
                    ...state.selection,
                    [action.itemId]: { ...state.selection[action.itemId], quantity: action.quantity },
                },
            }

        case "SET_REASON":
            return {
                ...state,
                selection: {
                    ...state.selection,
                    [action.itemId]: { ...state.selection[action.itemId], reason: action.reason },
                },
            }

        case "NEXT":
            return { ...state, step: Math.min(3, state.step + 1) as Step }
        case "BACK":
            return { ...state, step: Math.max(1, state.step - 1) as Step }
        case "RESET":
            return initial
        default:
            return state
    }
}

export function useReturnFlow() {
    const [state, dispatch] = useReducer(reducer, initial)

    const selectedIds = Object.keys(state.selection)
    const canLeaveStep1 = state.orderId !== null
    // на шаг 3 пускаем, только если выбран ≥1 товар и у каждого есть причина
    const canLeaveStep2 =
        selectedIds.length > 0 && selectedIds.every((id) => state.selection[id].reason !== null)

    return { state, dispatch, selectedIds, canLeaveStep1, canLeaveStep2 }
}