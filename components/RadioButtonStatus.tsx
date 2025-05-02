"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"

interface RadioButtonStatusProps {
    status: number
    onStatusChange: (newStatus: number) => void
}

export default function RadioButtonStatus({ status, onStatusChange }: RadioButtonStatusProps) {

  return (
    <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
            <input
                type="radio"
                id="admin"
                name="filtroPerfil"
                value={1}
                checked={status === 1}
                onChange={() => onStatusChange(1)}
                className="h-4 w-4 text-[#1e3a8a] focus:ring-[#1e3a8a]"
            />
            <Label htmlFor="admin" className="text-sm font-medium">
                Ativo
            </Label>
        </div>
        <div className="flex items-center space-x-2">
            <input
                type="radio"
                id="almoxarifado"
                name="filtroPerfil"
                value={0}
                checked={status === 0}
                onChange={() => onStatusChange(0)}
                className="h-4 w-4 text-[#1e3a8a] focus:ring-[#1e3a8a]"
            />
            <Label htmlFor="almoxarifado" className="text-sm font-medium">
                Inativo
            </Label>
        </div>
    </div>
  
  )
}