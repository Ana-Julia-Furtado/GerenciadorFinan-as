import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calculator, TrendingUp, Download, DollarSign } from 'lucide-react';

interface InvestmentData {
  month: number;
  rendaFixa: number;
  rendaVariavel: number;
  crypto: number;
}

const InvestmentSimulator = () => {
  const [initialValue, setInitialValue] = useState(10000);
  const [monthlyValue, setMonthlyValue] = useState(1000);
  const [timeInMonths, setTimeInMonths] = useState(60);
  const [selectedAsset, setSelectedAsset] = useState('all');

  // Taxas de retorno médio anual (%)
  const returnRates = {
    rendaFixa: 12, // CDI/Selic
    rendaVariavel: 15, // Ibovespa histórico
    crypto: 25 // Bitcoin histórico (mais volátil)
  };

  const investmentData = useMemo(() => {
    const data: InvestmentData[] = [];
    
    for (let month = 0; month <= timeInMonths; month++) {
      const rendaFixa = month === 0 ? initialValue : 
        initialValue * Math.pow(1 + returnRates.rendaFixa / 12 / 100, month) + 
        monthlyValue * ((Math.pow(1 + returnRates.rendaFixa / 12 / 100, month) - 1) / (returnRates.rendaFixa / 12 / 100));

      const rendaVariavel = month === 0 ? initialValue :
        initialValue * Math.pow(1 + returnRates.rendaVariavel / 12 / 100, month) + 
        monthlyValue * ((Math.pow(1 + returnRates.rendaVariavel / 12 / 100, month) - 1) / (returnRates.rendaVariavel / 12 / 100));

      const crypto = month === 0 ? initialValue :
        initialValue * Math.pow(1 + returnRates.crypto / 12 / 100, month) + 
        monthlyValue * ((Math.pow(1 + returnRates.crypto / 12 / 100, month) - 1) / (returnRates.crypto / 12 / 100));

      data.push({
        month,
        rendaFixa: Math.round(rendaFixa),
        rendaVariavel: Math.round(rendaVariavel),
        crypto: Math.round(crypto),
      });
    }
    
    return data;
  }, [initialValue, monthlyValue, timeInMonths]);

  const finalValues = investmentData[investmentData.length - 1];
  const totalContributed = initialValue + (monthlyValue * timeInMonths);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getGainPercentage = (finalValue: number) => {
    return ((finalValue - totalContributed) / totalContributed * 100).toFixed(1);
  };

  const handleExportPDF = () => {
    // TODO: Implementar exportação PDF
    console.log('Exportando para PDF...');
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`Mês ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const barChartData = [
    {
      name: 'Renda Fixa',
      value: finalValues.rendaFixa,
      fill: 'hsl(var(--investment-renda-fixa))'
    },
    {
      name: 'Renda Variável', 
      value: finalValues.rendaVariavel,
      fill: 'hsl(var(--investment-renda-variavel))'
    },
    {
      name: 'Criptomoedas',
      value: finalValues.crypto,
      fill: 'hsl(var(--investment-crypto))'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Inputs de Simulação */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Simulador de Investimentos
          </CardTitle>
          <CardDescription>
            Compare o desempenho de diferentes tipos de investimentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initial">Valor Inicial</Label>
              <Input
                id="initial"
                type="number"
                value={initialValue}
                onChange={(e) => setInitialValue(Number(e.target.value))}
                placeholder="R$ 10.000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly">Aporte Mensal</Label>
              <Input
                id="monthly"
                type="number"
                value={monthlyValue}
                onChange={(e) => setMonthlyValue(Number(e.target.value))}
                placeholder="R$ 1.000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Período (meses)</Label>
              <Input
                id="time"
                type="number"
                value={timeInMonths}
                onChange={(e) => setTimeInMonths(Number(e.target.value))}
                placeholder="60"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label htmlFor="asset">Visualizar Ativo</Label>
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um ativo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os ativos</SelectItem>
                  <SelectItem value="rendaFixa">Renda Fixa</SelectItem>
                  <SelectItem value="rendaVariavel">Renda Variável</SelectItem>
                  <SelectItem value="crypto">Criptomoedas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleExportPDF} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card border-l-4 border-l-investment-renda-fixa">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Renda Fixa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold">{formatCurrency(finalValues.rendaFixa)}</div>
              <div className="text-sm text-success">
                +{getGainPercentage(finalValues.rendaFixa)}% de ganho
              </div>
              <div className="text-xs text-muted-foreground">
                Taxa: {returnRates.rendaFixa}% a.a.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-investment-renda-variavel">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Renda Variável</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold">{formatCurrency(finalValues.rendaVariavel)}</div>
              <div className="text-sm text-success">
                +{getGainPercentage(finalValues.rendaVariavel)}% de ganho
              </div>
              <div className="text-xs text-muted-foreground">
                Taxa: {returnRates.rendaVariavel}% a.a.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-investment-crypto">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Criptomoedas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold">{formatCurrency(finalValues.crypto)}</div>
              <div className="text-sm text-success">
                +{getGainPercentage(finalValues.crypto)}% de ganho
              </div>
              <div className="text-xs text-muted-foreground">
                Taxa: {returnRates.crypto}% a.a.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Evolução */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução dos Investimentos
          </CardTitle>
          <CardDescription>
            Comparação da evolução patrimonial ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={investmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={customTooltip} />
                <Legend />
                {(selectedAsset === 'all' || selectedAsset === 'rendaFixa') && (
                  <Line 
                    type="monotone" 
                    dataKey="rendaFixa" 
                    stroke="hsl(var(--investment-renda-fixa))" 
                    strokeWidth={3}
                    name="Renda Fixa"
                    dot={{ fill: 'hsl(var(--investment-renda-fixa))', strokeWidth: 2, r: 4 }}
                  />
                )}
                {(selectedAsset === 'all' || selectedAsset === 'rendaVariavel') && (
                  <Line 
                    type="monotone" 
                    dataKey="rendaVariavel" 
                    stroke="hsl(var(--investment-renda-variavel))" 
                    strokeWidth={3}
                    name="Renda Variável"
                    dot={{ fill: 'hsl(var(--investment-renda-variavel))', strokeWidth: 2, r: 4 }}
                  />
                )}
                {(selectedAsset === 'all' || selectedAsset === 'crypto') && (
                  <Line 
                    type="monotone" 
                    dataKey="crypto" 
                    stroke="hsl(var(--investment-crypto))" 
                    strokeWidth={3}
                    name="Criptomoedas"
                    dot={{ fill: 'hsl(var(--investment-crypto))', strokeWidth: 2, r: 4 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Comparação Final */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Comparação de Resultados
          </CardTitle>
          <CardDescription>
            Valor final de cada tipo de investimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Valor Final']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentSimulator;