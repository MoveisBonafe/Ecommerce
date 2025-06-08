import { useState } from 'react';
import { Header } from '@/components/Header';
import { ProductsTab } from '@/components/admin/ProductsTab';
import { CategoriesTab } from '@/components/admin/CategoriesTab';
import { ColorsTab } from '@/components/admin/ColorsTab';
import { PricingTab } from '@/components/admin/PricingTab';
import { PromotionsTab } from '@/components/admin/PromotionsTab';
import { AnnouncementsTab } from '@/components/admin/AnnouncementsTab';
import { Box, Tags, Palette, DollarSign, Percent, Megaphone } from 'lucide-react';

type AdminTab = 'produtos' | 'categorias' | 'cores' | 'precos' | 'promocoes' | 'avisos';

const tabs = [
  { id: 'produtos' as AdminTab, label: 'Produtos', icon: Box },
  { id: 'categorias' as AdminTab, label: 'Categorias', icon: Tags },
  { id: 'cores' as AdminTab, label: 'Cores', icon: Palette },
  { id: 'precos' as AdminTab, label: 'Tabelas de Preço', icon: DollarSign },
  { id: 'promocoes' as AdminTab, label: 'Promoções', icon: Percent },
  { id: 'avisos' as AdminTab, label: 'Avisos', icon: Megaphone },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('produtos');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'produtos':
        return <ProductsTab />;
      case 'categorias':
        return <CategoriesTab />;
      case 'cores':
        return <ColorsTab />;
      case 'precos':
        return <PricingTab />;
      case 'promocoes':
        return <PromotionsTab />;
      case 'avisos':
        return <AnnouncementsTab />;
      default:
        return <ProductsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="mt-2 text-gray-600">
            Gerencie produtos, categorias e configurações do sistema
          </p>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
