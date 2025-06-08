import { Switch, Route } from "wouter";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { DataProvider } from '@/contexts/DataContext';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoginForm } from '@/components/LoginForm';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { StoreDashboard } from '@/pages/StoreDashboard';
import { RestaurantDashboard } from '@/pages/RestaurantDashboard';
import NotFound from "@/pages/not-found";

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <DataProvider>
      <CartProvider>
        <Switch>
          <Route path="/" component={() => {
            switch (user.type) {
              case 'admin':
                return <AdminDashboard />;
              case 'loja':
                return <StoreDashboard />;
              case 'restaurante':
                return <RestaurantDashboard />;
              default:
                return <NotFound />;
            }
          }} />
          <Route component={NotFound} />
        </Switch>
      </CartProvider>
    </DataProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
