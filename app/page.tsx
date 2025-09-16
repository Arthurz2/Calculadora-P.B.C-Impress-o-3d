"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function PBCCalculator() {
  const [angle, setAngle] = useState("21")
  const [software, setSoftware] = useState("orcaslicer")
  const [results, setResults] = useState<Array<{ nozzle: number; layerHeight: number }>>([])

  const nozzleSizes = [0.2, 0.4, 0.6, 0.8, 1.0]

  const calculateLayerHeights = () => {
    const angleRad = (Number.parseFloat(angle) * Math.PI) / 180
    const newResults = nozzleSizes.map((nozzle) => {
      // Fórmula P.B.C: Layer Height = Nozzle * tan(angle/2)
      const layerHeight = nozzle * Math.tan(angleRad / 2)
      return {
        nozzle,
        layerHeight: Math.round(layerHeight * 100) / 100, // Arredondar para 2 casas decimais
      }
    })
    setResults(newResults)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-center">Calculadora P.B.C (Proporção Bico Camada)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-gray-600 text-center">Digite o ângulo desejado e selecione o software</div>

          <div className="space-y-2">
            <Label htmlFor="angle">Ângulo (°)</Label>
            <Input
              id="angle"
              type="number"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              className="text-center"
            />
          </div>

          <RadioGroup value={software} onValueChange={setSoftware} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="orcaslicer" id="orcaslicer" />
              <Label htmlFor="orcaslicer" className="text-sm">
                OrcaSlicer
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ultimaker" id="ultimaker" />
              <Label htmlFor="ultimaker" className="text-sm">
                Ultimaker Cura
              </Label>
            </div>
          </RadioGroup>

          <Button onClick={calculateLayerHeights} className="w-full bg-green-600 hover:bg-green-700 text-white">
            Calcular
          </Button>

          {results.length > 0 && (
            <div className="mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center font-semibold text-sm border-b pb-2">Bico (mm)</div>
                <div className="text-center font-semibold text-sm border-b pb-2">Altura da Camada (mm)</div>

                {results.map((result, index) => (
                  <div key={index} className="contents">
                    <div className="text-center py-2 text-sm border-b border-gray-100">{result.nozzle.toFixed(1)}</div>
                    <div className="text-center py-2 text-sm border-b border-gray-100">
                      {result.layerHeight.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
