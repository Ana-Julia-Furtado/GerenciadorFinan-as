import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Trophy, 
  Star, 
  CheckCircle, 
  Play, 
  Award,
  Target,
  TrendingUp
} from 'lucide-react';

const Education = () => {
  const [userProgress, setUserProgress] = useState({
    totalPoints: 1250,
    level: 3,
    completedModules: 4,
    badges: ['first-quiz', 'week-streak', 'investment-expert']
  });

  const modules = [
    {
      id: 1,
      title: 'Fundamentos das Finanças Pessoais',
      description: 'Aprenda os conceitos básicos para controlar suas finanças',
      lessons: 6,
      duration: '45 min',
      completed: true,
      progress: 100
    },
    {
      id: 2,
      title: 'Orçamento e Planejamento',
      description: 'Como criar e manter um orçamento eficiente',
      lessons: 8,
      duration: '60 min',
      completed: true,
      progress: 100
    },
    {
      id: 3,
      title: 'Investimentos para Iniciantes',
      description: 'Seus primeiros passos no mundo dos investimentos',
      lessons: 10,
      duration: '75 min',
      completed: true,
      progress: 100
    },
    {
      id: 4,
      title: 'Renda Fixa vs Renda Variável',
      description: 'Compare diferentes tipos de investimentos',
      lessons: 7,
      duration: '50 min',
      completed: true,
      progress: 100
    },
    {
      id: 5,
      title: 'Análise de Risco',
      description: 'Entenda e gerencie os riscos dos seus investimentos',
      lessons: 9,
      duration: '65 min',
      completed: false,
      progress: 60
    },
    {
      id: 6,
      title: 'Diversificação de Portfólio',
      description: 'Estratégias para diversificar seus investimentos',
      lessons: 8,
      duration: '55 min',
      completed: false,
      progress: 0
    }
  ];

  const badges = [
    { id: 'first-quiz', name: 'Primeiro Quiz', icon: Star, earned: true },
    { id: 'week-streak', name: 'Sequência de 7 dias', icon: Target, earned: true },
    { id: 'investment-expert', name: 'Expert em Investimentos', icon: TrendingUp, earned: true },
    { id: 'budget-master', name: 'Mestre do Orçamento', icon: Award, earned: false },
    { id: 'risk-analyst', name: 'Analista de Risco', icon: Trophy, earned: false }
  ];

  const quizQuestions = [
    {
      id: 1,
      question: 'Qual a importância da reserva de emergência?',
      options: [
        'Cobrir gastos inesperados',
        'Investir em renda variável',
        'Comprar bens de consumo',
        'Pagar dívidas de cartão'
      ],
      correct: 0,
      module: 'Fundamentos das Finanças Pessoais'
    },
    {
      id: 2,
      question: 'Qual percentual da renda deve ser destinado à reserva de emergência?',
      options: [
        '3-6 meses de gastos',
        '1 mês de gastos',
        '12 meses de gastos',
        '50% da renda mensal'
      ],
      correct: 0,
      module: 'Orçamento e Planejamento'
    }
  ];

  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSubmit = () => {
    if (selectedAnswer === quizQuestions[currentQuiz].correct) {
      setScore(score + 100);
    }
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuiz < quizQuestions.length - 1) {
        setCurrentQuiz(currentQuiz + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            Educação Financeira
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aprenda sobre finanças pessoais e investimentos através dos nossos módulos interativos
          </p>
        </div>

        {/* User Progress Overview */}
        <Card className="mb-8 bg-gradient-subtle border-accent/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Seu Progresso</CardTitle>
                <CardDescription>Continue aprendendo para desbloquear novos badges</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{userProgress.totalPoints}</div>
                <div className="text-sm text-muted-foreground">pontos totais</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-investment-fixed">Nível {userProgress.level}</div>
                <div className="text-sm text-muted-foreground">Investidor Intermediário</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-investment-variable">{userProgress.completedModules}/6</div>
                <div className="text-sm text-muted-foreground">Módulos Concluídos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-investment-crypto">{userProgress.badges.length}</div>
                <div className="text-sm text-muted-foreground">Badges Conquistados</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="modules">Módulos</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
          </TabsList>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <Card key={module.id} className="relative overflow-hidden hover:shadow-hover transition-all duration-300">
                  {module.completed && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="h-6 w-6 text-success" />
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{module.lessons} aulas</span>
                      <span>{module.duration}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} />
                    </div>
                    
                    <Button 
                      className="w-full" 
                      variant={module.completed ? "outline" : "default"}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {module.completed ? 'Revisar' : 'Continuar'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz" className="space-y-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Quiz de Conhecimento</CardTitle>
                <CardDescription>
                  Teste seus conhecimentos • Questão {currentQuiz + 1} de {quizQuestions.length}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Módulo: {quizQuestions[currentQuiz].module}
                  </div>
                  
                  <h3 className="text-lg font-medium">
                    {quizQuestions[currentQuiz].question}
                  </h3>
                  
                  <div className="space-y-2">
                    {quizQuestions[currentQuiz].options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswer === index ? "default" : "outline"}
                        className="w-full justify-start h-auto p-4"
                        onClick={() => setSelectedAnswer(index)}
                        disabled={showResult}
                      >
                        <span className="mr-3 font-medium">{String.fromCharCode(65 + index)})</span>
                        {option}
                      </Button>
                    ))}
                  </div>
                  
                  {showResult && (
                    <div className={`p-4 rounded-lg ${
                      selectedAnswer === quizQuestions[currentQuiz].correct 
                        ? 'bg-success/10 text-success' 
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {selectedAnswer === quizQuestions[currentQuiz].correct 
                        ? '✅ Correto! +100 pontos' 
                        : '❌ Incorreto. A resposta correta é: ' + String.fromCharCode(65 + quizQuestions[currentQuiz].correct)
                      }
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Pontuação: {score} pontos
                    </div>
                    
                    <Button 
                      onClick={handleAnswerSubmit}
                      disabled={selectedAnswer === null || showResult}
                    >
                      {currentQuiz === quizQuestions.length - 1 ? 'Finalizar' : 'Próxima'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => {
                const IconComponent = badge.icon;
                return (
                  <Card 
                    key={badge.id} 
                    className={`text-center ${
                      badge.earned 
                        ? 'bg-gradient-subtle border-primary/30' 
                        : 'opacity-50 border-muted'
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                        badge.earned 
                          ? 'bg-gradient-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      
                      <h3 className="font-semibold mb-2">{badge.name}</h3>
                      
                      <Badge variant={badge.earned ? "default" : "outline"}>
                        {badge.earned ? 'Conquistado' : 'Bloqueado'}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Education;