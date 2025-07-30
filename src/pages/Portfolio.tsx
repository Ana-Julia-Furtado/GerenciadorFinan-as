import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StocksCryptoDashboard from '@/components/StocksCryptoDashboard';

const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 85750.00,
    totalCost: 72000.00,
    totalReturn: 13750.00,
    returnPercentage: 19.1,
    sharpeRatio: 1.45,
    volatility: 12.8,
    cagr: 15.2
  });

  const allocationData = [
    { name: 'Renda Fixa', value: 45, amount: 38587.50, color: '#3B82F6' },
    { name: 'Ações', value: 35, amount: 30012.50, color: '#10B981' },
    { name: 'Fundos Imobiliários', value: 15, amount: 12862.50, color: '#F59E0B' },
    { name: 'Criptomoedas', value: 5, amount: 4287.50, color: '#8B5CF6' }
  ];

  const riskAnalysis = [
    { metric: 'Concentração por Setor', value: 'Média', status: 'warning' },
    { metric: 'Diversificação Geográfica', value: 'Baixa', status: 'error' },
    { metric: 'Liquidez', value: 'Alta', status: 'success' },
    { metric: 'Correlação entre Ativos', value: 'Moderada', status: 'success' }
  ];

  const suggestions = [
    {
      type: 'Diversificação',
      title: 'Aumentar exposição internacional',
      description: 'Considere adicionar ETFs internacionais para reduzir concentração no mercado brasileiro',
      priority: 'Alta'
    },
    {
      type: 'Rebalanceamento',
      title: 'Reduzir peso em renda fixa',
      description: 'Seu perfil sugere maior tolerância ao risco. Considere aumentar ações de 35% para 45%',
      priority: 'Média'
    },
    {
      type: 'Otimização',
      title: 'Consolidar posições pequenas',
      description: 'Você tem várias posições abaixo de R$ 1.000. Considere consolidar para reduzir custos',
      priority: 'Baixa'
    }
  ];

  const performanceData = [
    { month: 'Jan', portfolio: 5.2, benchmark: 3.8 },
    { month: 'Fev', portfolio: -2.1, benchmark: -1.5 },
    { month: 'Mar', portfolio: 8.7, benchmark: 6.2 },
    { month: 'Abr', portfolio: 3.4, benchmark: 4.1 },
    { month: 'Mai', portfolio: 6.8, benchmark: 5.3 },
    { month: 'Jun', portfolio: 4.2, benchmark: 3.9 }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Aqui seria implementada a lógica de processamento do CSV
      console.log('Arquivo carregado:', file.name);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'destructive';
      case 'Média': return 'outline';
      case 'Baixa': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            Análise de Portfólio
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Analise sua carteira de investimentos e receba sugestões personalizadas
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Importar Carteira
            </CardTitle>
            <CardDescription>
              Faça upload do seu extrato em formato CSV para análise detalhada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Arraste seu arquivo CSV aqui</p>
              <p className="text-muted-foreground mb-4">ou clique para selecionar</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="portfolio-upload"
              />
              <Button asChild>
                <label htmlFor="portfolio-upload" className="cursor-pointer">
                  Selecionar Arquivo
                </label>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold">R$ {portfolioData.totalValue.toLocaleString('pt-BR')}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Retorno Total</p>
                  <p className="text-2xl font-bold text-success">
                    +{portfolioData.returnPercentage}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                  <p className="text-2xl font-bold">{portfolioData.sharpeRatio}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-investment-variable" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Volatilidade</p>
                  <p className="text-2xl font-bold">{portfolioData.volatility}%</p>
                </div>
                <TrendingDown className="h-8 w-8 text-investment-crypto" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="allocation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="allocation">Alocação</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="risk">Análise de Risco</TabsTrigger>
            <TabsTrigger value="suggestions">Sugestões</TabsTrigger>
            <TabsTrigger value="market">Mercado</TabsTrigger>
          </TabsList>

          {/* Allocation Tab */}
          <TabsContent value="allocation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Classe de Ativo</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detalhamento da Carteira</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {allocationData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">
                          R$ {item.amount.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={item.value} className="flex-1" />
                        <span className="text-sm font-medium w-12">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance vs Benchmark (CDI)</CardTitle>
                <CardDescription>Comparação mensal dos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                    <Bar dataKey="portfolio" fill="#10B981" name="Seu Portfólio" />
                    <Bar dataKey="benchmark" fill="#6B7280" name="CDI" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">CAGR (Retorno Anualizado)</p>
                  <p className="text-3xl font-bold text-success">{portfolioData.cagr}%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Maior Alta Mensal</p>
                  <p className="text-3xl font-bold text-success">+8.7%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Maior Baixa Mensal</p>
                  <p className="text-3xl font-bold text-destructive">-2.1%</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Risk Analysis Tab */}
          <TabsContent value="risk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Risco</CardTitle>
                <CardDescription>Avaliação dos principais fatores de risco da sua carteira</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {riskAnalysis.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={getStatusColor(item.status)}>
                        {getStatusIcon(item.status)}
                      </div>
                      <span className="font-medium">{item.metric}</span>
                    </div>
                    <Badge variant={item.status === 'success' ? 'default' : 'outline'}>
                      {item.value}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Risco</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Beta</span>
                    <span className="font-medium">0.85</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VaR (95%)</span>
                    <span className="font-medium">-3.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Drawdown</span>
                    <span className="font-medium">-8.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Correlação com Ibovespa</span>
                    <span className="font-medium">0.72</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Perfil de Risco</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-6xl">⚖️</div>
                    <h3 className="text-xl font-bold">Moderado</h3>
                    <p className="text-muted-foreground">
                      Sua carteira apresenta um nível de risco equilibrado, adequado para investidores com tolerância moderada a volatilidade.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-6">
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                        <CardDescription className="mt-1">{suggestion.type}</CardDescription>
                      </div>
                      <Badge variant={getPriorityColor(suggestion.priority)}>
                        {suggestion.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{suggestion.description}</p>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Rebalanceamento Sugerido</CardTitle>
                <CardDescription>Ajustes recomendados para otimizar sua carteira</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Alocação Atual</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Renda Fixa</span>
                        <span>45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ações</span>
                        <span>35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>FIIs</span>
                        <span>15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cripto</span>
                        <span>5%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Alocação Sugerida</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Renda Fixa</span>
                        <span className="text-investment-fixed">35% ↓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ações</span>
                        <span className="text-investment-variable">45% ↑</span>
                      </div>
                      <div className="flex justify-between">
                        <span>FIIs</span>
                        <span>15% →</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cripto</span>
                        <span>5% →</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-6">
                  Aplicar Rebalanceamento
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Dashboard Tab */}
          <TabsContent value="market" className="space-y-6">
            <StocksCryptoDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Portfolio;
