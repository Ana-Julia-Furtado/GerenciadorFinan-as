import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  Star,
  Search,
  RefreshCw,
  DollarSign,
  Bitcoin
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: number;
}

const StocksCryptoDashboard = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<CryptoData | null>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);

  // Mock stock data (em produção real, usaria API como Alpha Vantage)
  const stockData: StockData[] = [
    {
      symbol: 'VALE3',
      name: 'Vale S.A.',
      price: 68.45,
      change: 1.23,
      changePercent: 1.83
    },
    {
      symbol: 'PETR4',
      name: 'Petrobras PN',
      price: 29.87,
      change: -0.45,
      changePercent: -1.48
    },
    {
      symbol: 'ITUB4',
      name: 'Itaú Unibanco PN',
      price: 25.67,
      change: 0.89,
      changePercent: 3.59
    },
    {
      symbol: 'BBDC4',
      name: 'Bradesco PN',
      price: 14.23,
      change: -0.12,
      changePercent: -0.84
    }
  ];

  // Carregar watchlist do localStorage
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('crypto-watchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);

  // Buscar dados de criptomoedas da API CoinGecko
  const fetchCryptoData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h'
      );
      const data = await response.json();
      setCryptoData(data);
    } catch (error) {
      console.error('Erro ao buscar dados de criptomoedas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar histórico de preços para gráfico
  const fetchPriceHistory = async (coinId: string) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
      );
      const data = await response.json();
      const formattedData = data.prices.map((price: [number, number], index: number) => ({
        time: new Date(price[0]).toLocaleDateString(),
        price: price[1],
        day: index + 1
      }));
      setPriceHistory(formattedData);
    } catch (error) {
      console.error('Erro ao buscar histórico de preços:', error);
    }
  };

  useEffect(() => {
    fetchCryptoData();
  }, []);

  // Adicionar/remover da watchlist
  const toggleWatchlist = (assetId: string) => {
    const newWatchlist = watchlist.includes(assetId)
      ? watchlist.filter(id => id !== assetId)
      : [...watchlist, assetId];
    
    setWatchlist(newWatchlist);
    localStorage.setItem('crypto-watchlist', JSON.stringify(newWatchlist));
  };

  // Filtrar criptomoedas por termo de busca
  const filteredCrypto = cryptoData.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obter dados da watchlist
  const watchlistData = cryptoData.filter(coin => watchlist.includes(coin.id));

  // Selecionar ativo para visualizar gráfico
  const selectAsset = (crypto: CryptoData) => {
    setSelectedAsset(crypto);
    fetchPriceHistory(crypto.id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };

  const formatBRL = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Dashboard de Mercado</h2>
          <p className="text-muted-foreground">Acompanhe ações e criptomoedas em tempo real</p>
        </div>
        <Button onClick={fetchCryptoData} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <Tabs defaultValue="watchlist" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="cryptocurrencies">Criptomoedas</TabsTrigger>
          <TabsTrigger value="stocks">Ações</TabsTrigger>
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
        </TabsList>

        {/* Watchlist Tab */}
        <TabsContent value="watchlist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Minha Watchlist
              </CardTitle>
              <CardDescription>
                Acompanhe seus ativos favoritos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {watchlistData.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Sua watchlist está vazia. Adicione ativos das outras abas.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {watchlistData.map((crypto) => (
                    <div key={crypto.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
                        <div>
                          <p className="font-medium">{crypto.name}</p>
                          <p className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(crypto.current_price)}</p>
                        <div className="flex items-center gap-1">
                          {crypto.price_change_percentage_24h > 0 ? (
                            <TrendingUp className="h-4 w-4 text-success" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-destructive" />
                          )}
                          <span className={crypto.price_change_percentage_24h > 0 ? 'text-success' : 'text-destructive'}>
                            {crypto.price_change_percentage_24h?.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleWatchlist(crypto.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cryptocurrencies Tab */}
        <TabsContent value="cryptocurrencies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bitcoin className="h-5 w-5" />
                Criptomoedas
              </CardTitle>
              <CardDescription>
                Top 50 criptomoedas por capitalização de mercado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar criptomoeda..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {filteredCrypto.map((crypto) => (
                  <div key={crypto.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
                      <div>
                        <p className="font-medium">{crypto.name}</p>
                        <p className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(crypto.current_price)}</p>
                      <div className="flex items-center gap-1">
                        {crypto.price_change_percentage_24h > 0 ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        <span className={crypto.price_change_percentage_24h > 0 ? 'text-success' : 'text-destructive'}>
                          {crypto.price_change_percentage_24h?.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => selectAsset(crypto)}
                      >
                        Ver Gráfico
                      </Button>
                      <Button 
                        variant={watchlist.includes(crypto.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleWatchlist(crypto.id)}
                      >
                        {watchlist.includes(crypto.id) ? (
                          <Star className="h-4 w-4 fill-current" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stocks Tab */}
        <TabsContent value="stocks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Ações Brasileiras
              </CardTitle>
              <CardDescription>
                Principais ações da Bolsa de Valores brasileira
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stockData.map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-sm text-muted-foreground">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatBRL(stock.price)}</p>
                      <div className="flex items-center gap-1">
                        {stock.changePercent > 0 ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        <span className={stock.changePercent > 0 ? 'text-success' : 'text-destructive'}>
                          {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Dica:</strong> Para dados em tempo real de ações, conecte sua conta Supabase e configure uma API como Alpha Vantage.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charts Tab */}
        <TabsContent value="charts" className="space-y-6">
          {selectedAsset ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={selectedAsset.image} alt={selectedAsset.name} className="w-8 h-8" />
                    <div>
                      <CardTitle>{selectedAsset.name}</CardTitle>
                      <CardDescription>{selectedAsset.symbol.toUpperCase()}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formatPrice(selectedAsset.current_price)}</p>
                    <div className="flex items-center gap-1">
                      {selectedAsset.price_change_percentage_24h > 0 ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                      <span className={selectedAsset.price_change_percentage_24h > 0 ? 'text-success' : 'text-destructive'}>
                        {selectedAsset.price_change_percentage_24h?.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [formatPrice(Number(value)), 'Preço']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-xl font-bold mb-2">Selecione um Ativo</h3>
                <p className="text-muted-foreground">
                  Escolha uma criptomoeda na aba "Criptomoedas" para visualizar o gráfico de preços dos últimos 7 dias.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StocksCryptoDashboard;
