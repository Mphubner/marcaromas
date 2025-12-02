import React from "react";
import { Routes, Route, NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Zap,
  ShoppingBag,
  CreditCard,
  Package,
  Layers,
  Tag,
  Users,
  Ticket,
  Share2,
  Star,
  Settings,
  LogOut,
  FileText,
  Menu,
  X
} from "lucide-react";

import OverviewDashboard from "./dashboard/OverviewDashboard";
import AnalyticsDashboard from "./analytics/AnalyticsDashboard";
import QuickActionsDashboard from "./actions/QuickActionsDashboard";
import CouponsListPage from "./coupons/CouponsListPage";
import CouponCreatePage from "./coupons/CouponCreatePage";
import CouponEditPage from "./coupons/CouponEditPage";
import ReviewsListPage from "./reviews/ReviewsListPage";
import ReferralsListPage from "./referrals/ReferralsListPage";
import ReferralProgramsList from "./referrals/ReferralProgramsList";
import ReferralProgramConfig from "./referrals/ReferralProgramConfig";
import ReferralAnalytics from "./referrals/ReferralAnalytics";
import PayoutManagement from "./referrals/PayoutManagement";
import SocialMediaMentions from "./referrals/SocialMediaMentions";
import ConfigurationsPage from "./configurations/ConfigurationsPage";

import ProductListPage from "./ProductListPage";
import ProductCreatePage from "./products/ProductCreatePage";
import ProductEditPage from "./products/ProductEditPage";

import CustomersListPage from "./customers/CustomersListPage";
import CustomerDetailPage from "./customers/CustomerDetailPage";


import OrdersListPage from "./orders/OrdersListPage";
import OrderDetailPage from "./orders/OrderDetailPage";

import SubscriptionsListPage from "./subscriptions/SubscriptionsListPage";
import SubscriptionDetailPage from "./subscriptions/SubscriptionDetailPage";

import BoxesListPage from "./boxes/BoxesListPage";
import BoxCreatePage from "./boxes/BoxCreatePage";
import BoxEditorPage from "./boxes/BoxEditorPage";
import BoxDetailPage from "./boxes/BoxDetailPage";

import PlansPage from "./PlansPage";
import PlanCreatePage from "./plans/PlanCreatePage";
import PlanEditPage from "./plans/PlanEditPage";

import ContentPage from "./ContentPage";
import ContentListPage from "./content/ContentListPage";
import ContentCreatePage from "./content/ContentCreatePage";
import ContentEditPage from "./content/ContentEditPage";
import MediaPage from "./MediaPage";
import SystemLogs from "@/pages/admin/logs/SystemLogs";
import WebhookLogs from "@/pages/admin/logs/WebhookLogs";

const navItems = [
  { path: "/admin", label: "Overview", icon: LayoutDashboard },
  { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/admin/actions", label: "Quick Actions", icon: Zap },
  { path: "/admin/orders", label: "Pedidos", icon: ShoppingBag },
  { path: "/admin/subscriptions", label: "Assinaturas", icon: CreditCard },
  { path: "/admin/boxes", label: "Boxes", icon: Package },
  { path: "/admin/plans", label: "Planos", icon: Layers },
  { path: "/admin/products", label: "Produtos", icon: Tag },
  { path: "/admin/customers", label: "Clientes", icon: Users },
  { path: "/admin/coupons", label: "Cupons", icon: Ticket },
  { path: "/admin/referrals", label: "Indicações", icon: Share2 },
  { path: "/admin/reviews", label: "Reviews", icon: Star },
  { path: "/admin/content", label: "Content", icon: FileText },
  { path: "/admin/media", label: "Galeria", icon: ImageIcon },
  { path: "/admin/logs/system", label: "Logs Sistema", icon: Activity },
  { path: "/admin/logs/webhooks", label: "Logs Webhooks", icon: Share2 },
  { path: "/admin/configurations", label: "Configurações", icon: Settings },
];

const Admin = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-20 flex items-center px-4 justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-bold text-lg text-[#8B7355]">Marc Aromas Admin</span>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-gradient-to-b from-[#8B7355] to-[#5e4e3a] text-white
          fixed inset-y-0 left-0 z-40 shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#8B7355] font-bold text-xl">M</span>
            </div>
            <div>
              <span className="text-xl font-bold tracking-wide block leading-none">Marc Aromas</span>
              <span className="text-[10px] text-white/60 uppercase tracking-wider font-medium block mt-1">
                Painel Administrativo
              </span>
            </div>
          </Link>
          {/* Close button on mobile sidebar header */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                  ? "bg-white/20 text-white shadow-sm backdrop-blur-sm"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
              end={item.path === "/admin"}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-[#5e4e3a]">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200">
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route index element={<OverviewDashboard />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="actions" element={<QuickActionsDashboard />} />

            <Route path="coupons" element={<CouponsListPage />} />
            <Route path="coupons/create" element={<CouponCreatePage />} />
            <Route path="coupons/:id/edit" element={<CouponEditPage />} />

            <Route path="reviews" element={<ReviewsListPage />} />
            <Route path="referrals" element={<ReferralsListPage />} />
            <Route path="referrals/programs" element={<ReferralProgramsList />} />
            <Route path="referrals/programs/new" element={<ReferralProgramConfig />} />
            <Route path="referrals/programs/:id/edit" element={<ReferralProgramConfig />} />
            <Route path="referrals/analytics" element={<ReferralAnalytics />} />
            <Route path="configurations" element={<ConfigurationsPage />} />

            <Route path="products" element={<ProductListPage />} />
            <Route path="products/create" element={<ProductCreatePage />} />
            <Route path="products/:id/edit" element={<ProductEditPage />} />

            <Route path="customers" element={<CustomersListPage />} />
            <Route path="customers/:id" element={<CustomerDetailPage />} />


            <Route path="orders" element={<OrdersListPage />} />
            <Route path="orders/:orderId" element={<OrderDetailPage />} />

            <Route path="subscriptions" element={<SubscriptionsListPage />} />
            <Route path="subscriptions/:id" element={<SubscriptionDetailPage />} />

            <Route path="boxes" element={<BoxesListPage />} />
            <Route path="boxes/new" element={<BoxCreatePage />} />
            <Route path="boxes/:id/edit" element={<BoxEditorPage />} />
            <Route path="boxes/:id" element={<BoxDetailPage />} />

            <Route path="plans" element={<PlansPage />} />
            <Route path="plans/create" element={<PlanCreatePage />} />
            <Route path="plans/:id/edit" element={<PlanEditPage />} />

            <Route path="content" element={<ContentListPage />} />
            <Route path="content/new" element={<ContentCreatePage />} />
            <Route path="content/:id/edit" element={<ContentEditPage />} />

            <Route path="media" element={<MediaPage />} />

            <Route path="logs/system" element={<SystemLogs />} />
            <Route path="logs/webhooks" element={<WebhookLogs />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Admin;
