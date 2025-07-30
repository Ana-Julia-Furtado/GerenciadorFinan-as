import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

interface BlockchainData {
  id: string;
  name: string;
  symbol: string;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
}

const BlockchainRanking = () => {
  const [blockchains, setBlockchains] = useState<BlockchainData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<'market_cap' | 'total_volume'>('market_cap');

  const blockchainIds = [
    'bitcoin', 'ethereum', 'binancecoin', 'solana', 'cardano', 
    'avalanche-2', 'polygon', 'chainlink', 'polkadot', 'near'
  ];

  useEffect(() => {
    const fetchBlockchainData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${blockchainIds.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
        );
        const data = await response.json();
        setBlockchains(data);
      } catch (error) {
        console.error('Erro ao buscar dados das blockchains:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockchainData();
    const interval = setInterval(fetchBlockchainData, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatVolume = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const getBarData = () => {
    return blockchains.map((blockchain, index) => ({
      name: blockchain.symbol.toUpperCase(),
      value: activeMetric === 'market_cap' ? blockchain.market_cap : blockchain.total_volume,
      fullName: blockchain.name,
      change: blockchain.price_change_percentage_24h,
      rank: index + 1,
    }));
  };

  const getBarColor = (index: number) => {
    const colors = [
      'hsl(var(--primary))',
      'hsl(var(--secondary))', 
      'hsl(var(--accent))',
      'hsl(var(--muted-foreground))',
      'hsl(var(--primary) / 0.8)',
      'hsl(var(--secondary) / 0.8)',
      'hsl(var(--accent) / 0.8)',
      'hsl(var(--muted-foreground) / 0.8)',
      'hsl(var(--primary) / 0.6)',
      'hsl(var(--secondary) / 0.6)',
    ];
    return colors[index % colors.length];
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{data.fullName}</p>
          <p className="text-sm text-muted-foreground">#{data.rank} no ranking</p>
          <p className="text-primary font-medium">
            {activeMetric === 'market_cap' ? 'Market Cap: ' : 'Volume 24h: '}
            {formatCurrency(data.value)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            {data.change >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={`text-xs ${data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {data.change.toFixed(2)}% (24h)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Ranking de Blockchains
          </CardTitle>
          <CardDescription>
            Carregando dados das blockchains mais utilizadas...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Ranking de Blockchains
        </CardTitle>
        <CardDescription>
          Rankings das blockchains mais utilizadas em tempo real
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeMetric} onValueChange={(value) => setActiveMetric(value as 'market_cap' | 'total_volume')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="market_cap" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Market Cap
            </TabsTrigger>
            <TabsTrigger value="total_volume" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Volume 24h
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeMetric} className="mt-6">
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getBarData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => formatVolume(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {getBarData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blockchains.slice(0, 6).map((blockchain, index) => (
                <div key={blockchain.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="min-w-[2rem] justify-center">
                      #{index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-foreground">{blockchain.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {blockchain.symbol.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {activeMetric === 'market_cap' 
                        ? formatCurrency(blockchain.market_cap)
                        : formatCurrency(blockchain.total_volume)
                      }
                    </p>
                    <div className="flex items-center gap-1">
                      {blockchain.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs ${
                        blockchain.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {blockchain.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BlockchainRanking;
