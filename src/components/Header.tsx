import { Button } from './ui/button';
import { TrendingUp, PiggyBank, GraduationCap, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gradient-hero text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Investia
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Sua plataforma completa para educação e gestão financeira pessoal
          </p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Aprenda a investir, simule cenários e gerencie suas finanças de forma inteligente
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button size="lg" variant="secondary" className="flex items-center gap-2" asChild>
              <Link to="/educacao">
                <TrendingUp className="h-5 w-5" />
                Começar Agora
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
              <Link to="/portfolio">
                <GraduationCap className="h-5 w-5" />
                Analisar Portfólio
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-white" />
            <h3 className="text-xl font-semibold mb-2">Simulador de Investimentos</h3>
            <p className="text-white/80">Compare diferentes ativos e veja o potencial de crescimento</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <PiggyBank className="h-12 w-12 mx-auto mb-4 text-white" />
            <h3 className="text-xl font-semibold mb-2">Gestão Financeira</h3>
            <p className="text-white/80">Controle receitas, despesas e atinja suas metas</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-white" />
            <h3 className="text-xl font-semibold mb-2">Análise de Portfólio</h3>
            <p className="text-white/80">Avalie seus investimentos e otimize sua estratégia</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;