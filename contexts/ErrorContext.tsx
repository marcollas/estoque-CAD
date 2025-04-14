"use client"

import {createContext, useState, useContext, ReactNode} from 'react'

type ErrorType = {
    id?: string
    mensagem: string
    tipo: 'error' | 'alerta' | 'info' 
}

//Inicializo o context com valores padrãos
type ErrorContextType = {
    errors: ErrorType[]
    addError: (error: ErrorType | string) => void
    removeError: (error: ErrorType) => void
    clearErrors: () => void
}

type ErrorProviderProps = {
    children: ReactNode
}

const ErrorContext = createContext<ErrorContextType>({
    errors: [],
    addError: () => {},
    removeError: () => {},
    clearErrors: () => {},
  });

export const ErrorProvider = ({children} : ErrorProviderProps) =>{
    const [errors, setErrors] = useState<ErrorType[]>([])

    /**
    * Adiciona um novo erro à lista de erros
    * @param error Pode ser um objeto ErrorType ou uma string simples
    */

    const addError = (error: ErrorType | string) => {
        const errorObj: ErrorType = typeof error === 'string' ? {mensagem: error, tipo: 'error'} : error //Aqui é feito uma inserção condicional, onde se o tipo passado for string, simplesmente adiciona a mesmo a um objeto de erros
        
        //É preciso criar um id para poder acessar os erros mais facilmente. 
        const errorComId = {...errorObj, id: errorObj.id || crypto.randomUUID()}
        
        //Adiciono o erro com id no vetor de erros
        setErrors(prev => [...prev, errorComId])

        setTimeout(() => removeError(errorComId), 5000);
    }

    /**
    * Remove um erro específico da lista
    * @param errorToRemove O erro a ser removido
    */

    const removeError = (errorRemove: ErrorType) => {
        setErrors(prev => prev.filter(error =>
            error.id !== errorRemove.id || error.mensagem != errorRemove.mensagem
        ))
    }

    /**
    * Limpa todos os erros
    */
    const clearErrors = () => {
        setErrors([]);
    };

    return(
        <ErrorContext.Provider value={{errors, addError, removeError, clearErrors}}>
            {children}
        </ErrorContext.Provider>
    )
}

/**
 * Hook personalizado para acessar o contexto de erros
 * @returns Retorna o contexto de erros
 */
export const useError = (): ErrorContextType => {
    const context = useContext(ErrorContext)
    if(!context){
        throw new Error("useErro não pode ser usado sem contexto")
    }
    return context
}