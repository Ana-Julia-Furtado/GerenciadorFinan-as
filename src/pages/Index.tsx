import Header from '../components/Header';
import InvestmentSimulator from '../components/InvestmentSimulator';
import FinancialManager from '../components/FinancialManager';
import BlockchainRanking from '../components/BlockchainRanking';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          <section id="simulador">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                Simulador de Investimentos
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Descubra o potencial de crescimento dos seus investimentos e compare diferentes estratégias
              </p>
            </div>
            <InvestmentSimulator />
          </section>

          <section id="financas">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                Gestão Financeira
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Controle suas receitas, despesas e acompanhe suas metas financeiras
              </p>
            </div>
            <FinancialManager />
          </section>

          <section id="blockchain">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                Ranking de Blockchains
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Acompanhe as blockchains mais utilizadas e suas métricas em tempo real
              </p>
            </div>
            <BlockchainRanking />
          </section>
        </div>
      </main>
      
      <footer className="bg-muted mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Investia. Todos os direitos reservados.</p>
            <p className="text-sm mt-2">
              Plataforma educacional para gestão financeira pessoal
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
