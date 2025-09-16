"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PBCCalculator() {
  const [activeTab, setActiveTab] = useState("pbc")

  // PBC Calculator states
  const [angle, setAngle] = useState("21")
  const [software, setSoftware] = useState("orcaslicer")
  const [results, setResults] = useState<Array<{ nozzle: number; layerHeight: number }>>([])

  const [priceData, setPriceData] = useState({
    filamentPrice: "129.90",
    materialUsed: "105",
    printDuration: "24",
    energyRate: "1.191",
    printerConsumption: "400",
    paintPrice: "6.00",
    paintBottles: "2",
    profitMargin: "100",
  })
  const [priceResults, setPriceResults] = useState<{
    withoutPaint: {
      filamentCost: number
      energyCost: number
      total: number
      suggestedPrice: number
      salePrice: number
      profit: number
    }
    withPaint: {
      filamentCost: number
      energyCost: number
      paintCost: number
      laborCost: number
      total: number
      suggestedPrice: number
      salePrice: number
      profit: number
    }
  } | null>(null)

  const nozzleSizes = [0.2, 0.4, 0.6, 0.8, 1.0]

  const calculateLayerHeights = () => {
    const angleRad = (Number.parseFloat(angle) * Math.PI) / 180
    const newResults = nozzleSizes.map((nozzle) => {
      const layerHeight = nozzle * Math.tan(angleRad / 2)
      return {
        nozzle,
        layerHeight: Math.round(layerHeight * 100) / 100,
      }
    })
    setResults(newResults)
  }

  const calculatePrice = () => {
    const filamentPricePerKg = Number.parseFloat(priceData.filamentPrice)
    const materialUsedG = Number.parseFloat(priceData.materialUsed)
    const printDurationH = Number.parseFloat(priceData.printDuration)
    const energyRateKwh = Number.parseFloat(priceData.energyRate)
    const printerConsumptionW = Number.parseFloat(priceData.printerConsumption)
    const paintPricePerMl = Number.parseFloat(priceData.paintPrice)
    const paintBottles = Number.parseFloat(priceData.paintBottles)
    const profitMarginPercent = Number.parseFloat(priceData.profitMargin)

    // Calculate costs
    const filamentCost = (filamentPricePerKg * materialUsedG) / 1000
    const energyCost = (printerConsumptionW / 1000) * printDurationH * energyRateKwh
    const paintCost = paintPricePerMl * paintBottles
    const laborCost = 10.0 // Fixed labor cost for painting

    // Without paint calculations
    const totalWithoutPaint = filamentCost + energyCost
    const suggestedPriceWithoutPaint = totalWithoutPaint * (1 + profitMarginPercent / 100)
    const salePriceWithoutPaint = suggestedPriceWithoutPaint * 0.995 // Small discount
    const profitWithoutPaint = salePriceWithoutPaint - totalWithoutPaint

    // With paint calculations
    const totalWithPaint = filamentCost + energyCost + paintCost + laborCost
    const suggestedPriceWithPaint = totalWithPaint * (1 + profitMarginPercent / 100)
    const salePriceWithPaint = suggestedPriceWithPaint * 1.59 // Higher markup for painted items
    const profitWithPaint = salePriceWithPaint - totalWithPaint

    setPriceResults({
      withoutPaint: {
        filamentCost: Math.round(filamentCost * 100) / 100,
        energyCost: Math.round(energyCost * 100) / 100,
        total: Math.round(totalWithoutPaint * 100) / 100,
        suggestedPrice: Math.round(suggestedPriceWithoutPaint * 100) / 100,
        salePrice: Math.round(salePriceWithoutPaint * 100) / 100,
        profit: Math.round(profitWithoutPaint * 100) / 100,
      },
      withPaint: {
        filamentCost: Math.round(filamentCost * 100) / 100,
        energyCost: Math.round(energyCost * 100) / 100,
        paintCost: Math.round(paintCost * 100) / 100,
        laborCost: laborCost,
        total: Math.round(totalWithPaint * 100) / 100,
        suggestedPrice: Math.round(suggestedPriceWithPaint * 100) / 100,
        salePrice: Math.round(salePriceWithPaint * 100) / 100,
        profit: Math.round(profitWithPaint * 100) / 100,
      },
    })
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 text-balance">
            Calculadora 3D Profissional
          </h1>
          <p className="text-muted-foreground text-lg">Ferramentas avançadas para impressão 3D</p>
        </div>

        <Card className="border-border shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted">
                <TabsTrigger
                  value="pbc"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
                >
                  P.B.C (Proporção Bico Camada)
                </TabsTrigger>
                <TabsTrigger
                  value="price"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
                >
                  Calculadora de Preço
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pbc" className="space-y-8">
                <div className="text-center">
                  <p className="text-muted-foreground text-base">Digite o ângulo desejado e selecione o software</p>
                </div>

                <div className="max-w-md mx-auto space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="angle" className="text-base font-medium">
                      Ângulo (°)
                    </Label>
                    <Input
                      id="angle"
                      type="number"
                      value={angle}
                      onChange={(e) => setAngle(e.target.value)}
                      className="text-center text-lg h-12 border-border focus:ring-ring"
                      placeholder="21"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Software</Label>
                    <RadioGroup value={software} onValueChange={setSoftware} className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="orcaslicer" id="orcaslicer" />
                        <Label htmlFor="orcaslicer" className="text-base cursor-pointer flex-1">
                          OrcaSlicer
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="ultimaker" id="ultimaker" />
                        <Label htmlFor="ultimaker" className="text-base cursor-pointer flex-1">
                          Ultimaker Cura
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button
                    onClick={calculateLayerHeights}
                    className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Calcular
                  </Button>
                </div>

                {results.length > 0 && (
                  <div className="max-w-2xl mx-auto">
                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="text-center text-xl">Resultados</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <div className="grid grid-cols-2 gap-0 min-w-[300px]">
                            <div className="bg-muted p-4 font-semibold text-center border-r border-border">
                              Bico (mm)
                            </div>
                            <div className="bg-muted p-4 font-semibold text-center">Altura da Camada (mm)</div>

                            {results.map((result, index) => (
                              <div key={index} className="contents">
                                <div className="p-4 text-center border-r border-t border-border bg-card">
                                  {result.nozzle.toFixed(1)}
                                </div>
                                <div className="p-4 text-center border-t border-border bg-card">
                                  {result.layerHeight.toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="price" className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Calculadora de Preço de Impressão 3D</h2>
                  <p className="text-muted-foreground">Calcule custos e preços de venda com precisão</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Input Section */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-xl">Dados de Entrada</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="filamentPrice" className="text-sm font-medium">
                            Filamento (kg) - R$
                          </Label>
                          <Input
                            id="filamentPrice"
                            type="number"
                            step="0.01"
                            value={priceData.filamentPrice}
                            onChange={(e) => setPriceData({ ...priceData, filamentPrice: e.target.value })}
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="materialUsed" className="text-sm font-medium">
                            Material utilizado (g)
                          </Label>
                          <Input
                            id="materialUsed"
                            type="number"
                            value={priceData.materialUsed}
                            onChange={(e) => setPriceData({ ...priceData, materialUsed: e.target.value })}
                            className="h-10"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="printDuration" className="text-sm font-medium">
                            Duração da impressão (h)
                          </Label>
                          <Input
                            id="printDuration"
                            type="number"
                            value={priceData.printDuration}
                            onChange={(e) => setPriceData({ ...priceData, printDuration: e.target.value })}
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="energyRate" className="text-sm font-medium">
                            Taxa de energia (Kw/h)
                          </Label>
                          <Input
                            id="energyRate"
                            type="number"
                            step="0.001"
                            value={priceData.energyRate}
                            onChange={(e) => setPriceData({ ...priceData, energyRate: e.target.value })}
                            className="h-10"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="printerConsumption" className="text-sm font-medium">
                            Consumo da impressora (w)
                          </Label>
                          <Input
                            id="printerConsumption"
                            type="number"
                            value={priceData.printerConsumption}
                            onChange={(e) => setPriceData({ ...priceData, printerConsumption: e.target.value })}
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="profitMargin" className="text-sm font-medium">
                            % de lucro
                          </Label>
                          <Input
                            id="profitMargin"
                            type="number"
                            value={priceData.profitMargin}
                            onChange={(e) => setPriceData({ ...priceData, profitMargin: e.target.value })}
                            className="h-10"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="paintPrice" className="text-sm font-medium">
                            Tinta (ml) - R$
                          </Label>
                          <Input
                            id="paintPrice"
                            type="number"
                            step="0.01"
                            value={priceData.paintPrice}
                            onChange={(e) => setPriceData({ ...priceData, paintPrice: e.target.value })}
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paintBottles" className="text-sm font-medium">
                            Frascos de tinta
                          </Label>
                          <Input
                            id="paintBottles"
                            type="number"
                            value={priceData.paintBottles}
                            onChange={(e) => setPriceData({ ...priceData, paintBottles: e.target.value })}
                            className="h-10"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={calculatePrice}
                        className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Calcular Preço
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Results Section */}
                  {priceResults && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-6">
                        {/* Without Paint */}
                        <Card className="border-border">
                          <CardHeader className="bg-accent text-accent-foreground">
                            <CardTitle className="text-center text-lg">SEM PINTURA</CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            {/* Expenses */}
                            <div className="bg-muted/50 p-4">
                              <div className="bg-accent text-accent-foreground text-xs font-semibold p-2 rounded mb-3 text-center">
                                DESPESAS
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Filamento (kg)</span>
                                  <span className="font-medium">R$ {priceData.filamentPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Material utilizado (g)</span>
                                  <span className="font-medium">{priceData.materialUsed}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Duração da impressão (h)</span>
                                  <span className="font-medium">{priceData.printDuration}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Taxa de energia (Kw/h)</span>
                                  <span className="font-medium">{priceData.energyRate}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Consumo da impressora (w)</span>
                                  <span className="font-medium">{priceData.printerConsumption}</span>
                                </div>
                              </div>
                            </div>

                            {/* Costs */}
                            <div className="bg-muted/30 p-4">
                              <div className="bg-accent text-accent-foreground text-xs font-semibold p-2 rounded mb-3 text-center">
                                CUSTO
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Consumo de filamento</span>
                                  <span className="font-medium">
                                    R$ {priceResults.withoutPaint.filamentCost.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Consumo de energia</span>
                                  <span className="font-medium">
                                    R$ {priceResults.withoutPaint.energyCost.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between font-semibold border-t pt-2">
                                  <span>CUSTO TOTAL</span>
                                  <span>R$ {priceResults.withoutPaint.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Profit */}
                            <div className="bg-secondary/50 p-4">
                              <div className="bg-primary text-primary-foreground text-xs font-semibold p-2 rounded mb-3 text-center">
                                LUCRO
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>% de lucro</span>
                                  <span className="font-medium">{priceData.profitMargin}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Preço sugerido</span>
                                  <span className="font-medium">
                                    R$ {priceResults.withoutPaint.suggestedPrice.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Preço de venda</span>
                                  <span className="font-medium">
                                    R$ {priceResults.withoutPaint.salePrice.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between font-semibold border-t pt-2">
                                  <span>Lucro total</span>
                                  <span>R$ {priceResults.withoutPaint.profit.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* With Paint */}
                        <Card className="border-border">
                          <CardHeader className="bg-accent text-accent-foreground">
                            <CardTitle className="text-center text-lg">COM PINTURA</CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            {/* Expenses */}
                            <div className="bg-muted/50 p-4">
                              <div className="bg-accent text-accent-foreground text-xs font-semibold p-2 rounded mb-3 text-center">
                                DESPESAS
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Filamento (kg)</span>
                                  <span className="font-medium">R$ {priceData.filamentPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Material utilizado (g)</span>
                                  <span className="font-medium">{priceData.materialUsed}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Duração da impressão (h)</span>
                                  <span className="font-medium">{priceData.printDuration}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Taxa de energia</span>
                                  <span className="font-medium">{priceData.energyRate}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Consumo da impressora (w)</span>
                                  <span className="font-medium">{priceData.printerConsumption}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Tinta (ml)</span>
                                  <span className="font-medium">R$ {priceData.paintPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Frascos de tinta</span>
                                  <span className="font-medium">{priceData.paintBottles}</span>
                                </div>
                              </div>
                            </div>

                            {/* Costs */}
                            <div className="bg-muted/30 p-4">
                              <div className="bg-accent text-accent-foreground text-xs font-semibold p-2 rounded mb-3 text-center">
                                CUSTO
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Consumo de filamento</span>
                                  <span className="font-medium">
                                    R$ {priceResults.withPaint.filamentCost.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Consumo de energia</span>
                                  <span className="font-medium">R$ {priceResults.withPaint.energyCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Custo com tinta</span>
                                  <span className="font-medium">R$ {priceResults.withPaint.paintCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Mão de obra da pintura</span>
                                  <span className="font-medium">R$ {priceResults.withPaint.laborCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-semibold border-t pt-2">
                                  <span>CUSTO TOTAL</span>
                                  <span>R$ {priceResults.withPaint.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Profit */}
                            <div className="bg-secondary/50 p-4">
                              <div className="bg-primary text-primary-foreground text-xs font-semibold p-2 rounded mb-3 text-center">
                                LUCRO
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>% de lucro</span>
                                  <span className="font-medium">{priceData.profitMargin}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Preço sugerido</span>
                                  <span className="font-medium">
                                    R$ {priceResults.withPaint.suggestedPrice.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Preço de venda</span>
                                  <span className="font-medium">R$ {priceResults.withPaint.salePrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-semibold border-t pt-2">
                                  <span>Lucro total</span>
                                  <span>R$ {priceResults.withPaint.profit.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
