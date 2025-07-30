import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PlusCircle, TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface MonthlyGoal {
  category: string;
  target: number;
  current: number;
}

const FinancialManager = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'income', amount: 5000, category: 'Salário', description: 'Salário mensal', date: '2024-01-01' },
    { id: '2', type: 'expense', amount: 1200, category: 'Alimentação', description: 'Supermercado', date: '2024-01-05' },
    { id: '3', type: 'expense', amount: 800, category: 'Transporte', description: 'Combustível', date: '2024-01-08' },
    { id: '4', type: 'expense', amount: 1500, category: 'Habitação', description: 'Aluguel', date: '2024-01-01' },
  ]);

  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoal[]>([
    { category: 'Alimentação', target: 1500, current: 1200 },
    { category: 'Transporte', target: 1000, current: 800 },
    { category: 'Lazer', target: 500, current: 300 },
    { category: 'Habitação', target: 1500, current: 1500 },
  ]);

  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
  });

  const incomeCategories = ['Salário', 'Freelance', 'Investimentos', 'Outros'];
  const expenseCategories = ['Alimentação', 'Transporte', 'Habitação', 'Saúde', 'Lazer', 'Educação', 'Outros'];

  const handleAddTransaction = () => {
    if (!newTransaction.amount || !newTransaction.category || !newTransaction.description) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type as 'income' | 'expense',
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      description: newTransaction.description,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions([...transactions, transaction]);
    
    // Update monthly goals if it's an expense
    if (transaction.type === 'expense') {
      setMonthlyGoals(goals =>
        goals.map(goal =>
          goal.category === transaction.category
            ? { ...goal, current: goal.current + transaction.amount }
            : goal
        )
      );
    }

    setNewTransaction({ type: 'expense', amount: '', category: '', description: '' });
    
    toast({
      title: "Sucesso",
      description: "Transação adicionada com sucesso!",
    });
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Prepare chart data
  const categoryData = expenseCategories.map(category => {
    const categoryExpenses = transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
    return { category, amount: categoryExpenses };
  }).filter(item => item.amount > 0);

  const pieColors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const monthlyData = [
    { month: 'Jan', income: totalIncome, expenses: totalExpenses },
  ];

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {totalIncome.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              R$ {totalExpenses.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
              R$ {balance.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="goals">Metas</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="add">Adicionar</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nova Transação</CardTitle>
              <CardDescription>Adicione uma nova receita ou despesa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction({...newTransaction, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Receita</SelectItem>
                      <SelectItem value="expense">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Valor</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0,00"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {(newTransaction.type === 'income' ? incomeCategories : expenseCategories).map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    placeholder="Descrição da transação"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleAddTransaction} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Transação
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Transações</CardTitle>
              <CardDescription>Suas movimentações financeiras recentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${transaction.type === 'income' ? 'bg-success' : 'bg-destructive'}`} />
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                        {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Metas Mensais</CardTitle>
              <CardDescription>Acompanhe seus gastos por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {monthlyGoals.map(goal => {
                  const percentage = (goal.current / goal.target) * 100;
                  const isOverTarget = percentage > 100;
                  
                  return (
                    <div key={goal.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{goal.category}</span>
                          {isOverTarget && <AlertTriangle className="h-4 w-4 text-destructive" />}
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground">
                            R$ {goal.current.toLocaleString('pt-BR')} / R$ {goal.target.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={Math.min(percentage, 100)} 
                        className={`h-2 ${isOverTarget ? 'bg-destructive/20' : ''}`}
                      />
                      <div className="flex justify-between items-center">
                        <Badge variant={isOverTarget ? "destructive" : percentage > 80 ? "secondary" : "outline"}>
                          {percentage.toFixed(1)}%
                        </Badge>
                        {isOverTarget && (
                          <span className="text-sm text-destructive">
                            +R$ {(goal.current - goal.target).toLocaleString('pt-BR')} acima da meta
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gastos por Categoria</CardTitle>
                <CardDescription>Distribuição das suas despesas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      label={({ category, value }) => `${category}: R$${value.toLocaleString('pt-BR')}`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receitas vs Despesas</CardTitle>
                <CardDescription>Comparativo mensal</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `R$${(value/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                    <Bar dataKey="income" fill="hsl(var(--success))" name="Receitas" />
                    <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Despesas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialManager;