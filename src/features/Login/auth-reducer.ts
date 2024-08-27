import {Dispatch} from 'redux'
import {
    SetAppErrorActionType,
    setAppStatusAC,
    SetAppStatusActionType, setIsInitializedAC, setIsInitializedType,
} from '../../app/app-reducer'
import {LoginDataType} from "./Login";
import {authAPI} from "../../api/todolists-api";
import {handleServerAppError} from "../../utils/error-utils";

const initialState = {
    isLoggedIn: false,
}

type InitialStateType = typeof initialState

export const authReducer = (
    state: InitialStateType = initialState,
    action: ActionsType
): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value}) as const

// thunks
export const loginTC = (data: LoginDataType) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data).then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
        } else {
            handleServerAppError(res.data, dispatch)
        }
        res.data.data.userId
    }).catch((e => {
        handleServerAppError(e, dispatch)
    }))
}

export const meTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.me().then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
        } else {
            handleServerAppError(res.data, dispatch)
        }
        res.data.data
    }).catch((e => {
        handleServerAppError(e, dispatch)
    })).finally(() => {
        dispatch((setIsInitializedAC(true)))
    })
}

export const logOutTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logOut().then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(false))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }).catch((e => {
        handleServerAppError(e, dispatch)
    }))
}

// types
type ActionsType =
    | ReturnType<typeof setIsLoggedInAC>
    | SetAppStatusActionType
    | SetAppErrorActionType
    | setIsInitializedType