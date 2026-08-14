import { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import { getCurrentUser } from "./features/auth/auth.service.js";
import { useAuthStore } from "./features/auth/authStore.js";

import { AppLayout } from "./components/layouts/AppLayout.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

import { CategoryPage } from "./features/categories/CategoryPage.jsx";
import { LoginPage } from "./features/auth/LoginPage.jsx";
import { RegisterPage } from "./features/auth/RegisterPage.jsx";
import { DashboardPage } from "./features/dashboard/DashboardPage.jsx";
import { ProductsPage } from "./features/products/ProductsPage.jsx";
import { ProductDetailsPage } from "./features/products/ProductDetailsPage.jsx";
import { ProductCreatePage } from "./features/products/ProductCreatePage.jsx";
import StockMovementsPage from "./features/stock-movements/StockMovementsPage.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { RecipeCreatePage } from "./features/recipes/RecipeCreatePage.jsx";
import { RecipesPage } from "./features/recipes/RecipesPage.jsx";
import { RecipeDetailsPage } from "./features/recipes/RecipeDetailsPage.jsx";

function App() {
  const { token, logout, setAuthLoading, isAuthLoading } = useAuthStore();

  useEffect(() => {
    async function currentUser() {
      try {
        if (token) {
          setAuthLoading(true);
          await getCurrentUser();
          setAuthLoading(false);
        } else {
          logout();
          setAuthLoading(false);
        }
      } catch (error) {
        console.error("Failed to restore session: ", error);
        logout();
        setAuthLoading(false);
      }
    }
    currentUser();
  }, []);

  if (isAuthLoading) return null;
  return (
    <div>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/new" element={<ProductCreatePage />} />
                <Route path="/products/:id" element={<ProductDetailsPage />} />
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/movements" element={<StockMovementsPage />} />
                <Route path="/recipes" element={<RecipesPage />} />
                <Route path="/recipes/new" element={<RecipeCreatePage />} />
                <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
              </Route>
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
      <Toaster />
    </div>
  );
}

export default App;
