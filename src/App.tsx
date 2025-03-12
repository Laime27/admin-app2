import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Dashboard from "@/pages/Dashboard";
import PanelControl from "@/pages/PanelControl";
import Categorias from "@/pages/categorias/Categorias";
import Productos from "@/pages/productos/Productos";
import Caja from "@/pages/Caja";
import Proveedores from "@/pages/Proveedores";
import Settings from "@/pages/modal_profile/Settings";
import Profile from "@/pages/modal_profile/Profile";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/login/login";
import CrearProducto from "@/pages/productos/CrearProducto";
import EditarProductoPage from "@/pages/productos/EditarProducto";
import Citas from "@/pages/Citas";
import Documentos from "@/pages/Documentos";
import Migraciones from "@/pages/Migraciones";
import Usuarios from "@/pages/Usuarios";

const queryClient = new QueryClient();

// Componente para proteger rutas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');


  return children;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:ml-[174px]">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="pt-16 px-4 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/panel-control"
            element={
              <ProtectedRoute>
                <Layout>
                  <PanelControl />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categorias"
            element={
              <ProtectedRoute>
                <Layout>
                  <Categorias />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/productos"
            element={
              <ProtectedRoute>
                <Layout>
                  <Productos />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/productos/crear"
            element={
              <ProtectedRoute>
                <Layout>
                  <CrearProducto />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/productos/editar/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <EditarProductoPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/caja"
            element={
              <ProtectedRoute>
                <Layout>
                  <Caja />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/proveedores"
            element={
              <ProtectedRoute>
                <Layout>
                  <Proveedores />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/citas"
            element={
              <ProtectedRoute>
                <Layout>
                  <Citas />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/documentos"
            element={
              <ProtectedRoute>
                <Layout>
                  <Documentos />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/migraciones"
            element={
              <ProtectedRoute>
                <Layout>
                  <Migraciones />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute>
                <Layout>
                  <Usuarios />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
