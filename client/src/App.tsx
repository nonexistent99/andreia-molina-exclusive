import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Download from "./pages/Download";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminModelForm from "./pages/AdminModelForm";
import ProductsPage from "./pages/admin/ProductsPage";
import ProductFormPage from "./pages/admin/ProductFormPage";
import OrderBumpsPage from "./pages/admin/OrderBumpsPage";
import OrderBumpFormPage from "./pages/admin/OrderBumpFormPage";
import ModelPage from "./pages/ModelPage";
import Success from "./pages/Success";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/checkout/:productId" component={Checkout} />
      <Route path="/payment/:orderNumber" component={Payment} />
      <Route path="/success/:orderNumber" component={Success} />
      <Route path="/download/:token" component={Download} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/models/new" component={AdminModelForm} />
      <Route path="/admin/models/edit/:id" component={AdminModelForm} />
      <Route path="/admin/products" component={ProductsPage} />
      <Route path="/admin/products/new" component={ProductFormPage} />
      <Route path="/admin/products/edit/:id" component={ProductFormPage} />
      <Route path="/admin/order-bumps" component={OrderBumpsPage} />
      <Route path="/admin/order-bumps/new" component={OrderBumpFormPage} />
      <Route path="/admin/order-bumps/edit/:id" component={OrderBumpFormPage} />
      <Route path="/modelo/:slug" component={ModelPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
