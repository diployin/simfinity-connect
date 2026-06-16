import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package as PackageIcon,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import WorldMap from '@/components/WorldMap';
import { format } from 'date-fns';
import { useTranslation } from '@/contexts/TranslationContext';

interface StatsData {
  totalOrders: number;
  totalRevenue: number;
  totalEsims: number;
  totalCost: number;
  totalCustomers: number;
  activePackages: number;
  totalPackages: number;
  pendingTickets: number;
  totalTickets: number;
  trends: {
    orders: number;
    revenue: number;
    customers: number;
  };
  revenueByMonth: Array<{ month: string; revenue: number }>;
  ordersByStatus: Array<{ status: string; count: number }>;
  topDestinations: Array<{ country: string; flag: string; count: number; revenue: number }>;
  latestOrders: Array<{
    id: string;
    displayOrderId: number;
    userEmail: string;
    packageTitle: string;
    destinationName: string;
    price: number;
    status: string;
    createdAt: string;
  }>;
  latestCustomers: Array<{
    id: string;
    displayUserId: number;
    email: string;
    name: string | null;
    createdAt: string;
  }>;
  ordersByCountry: Array<{
    country: string;
    iso2: string;
    count: number;
  }>;
}

const COLORS = {
  pending: '#f59e0b',
  processing: 'var(--primary)',
  completed: '#10b981',
  failed: '#ef4444',
  cancelled: '#6b7280',
};

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [timeFilter, setTimeFilter] = useState<'7days' | '30days' | 'lifetime'>('lifetime');

  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ['/api/admin/stats', timeFilter],
    queryFn: async () => {
      const response = await fetch(`/api/admin/stats?timeFilter=${timeFilter}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const json = await response.json();
      // Extract data from standardized API response format
      return json.data || json;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-second mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            {t('admin.dashboard.loadingDashboard', 'Loading dashboard...')}
          </p>
        </div>
      </div>
    );
  }

  const hasOrders = stats && stats.totalOrders > 0;
  const pieData =
    stats?.ordersByStatus?.map((item) => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      value: item.count,
      color: COLORS[item.status as keyof typeof COLORS] || '#6b7280',
    })) || [];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          {t('admin.dashboard.title', 'Dashboard')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          {t(
            'admin.dashboard.description',
            "Welcome back! Here's what's happening with your eSIM marketplace today.",
          )}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Total Revenue */}
        <Card
          className="relative overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-sm border border-slate-100 dark:border-slate-800"
          data-testid="card-total-revenue"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t('admin.dashboard.totalRevenue', 'Total Revenue')}
                </p>
                <h3
                  className="text-2xl font-bold text-slate-900 dark:text-white mt-1"
                  data-testid="text-total-revenue"
                >
                  ${stats?.totalRevenue.toFixed(2) || '0.00'}
                </h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 text-primary">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </div>
        </Card>

        {/* Total Cost */}
        <Card
          className="relative overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-sm border border-slate-100 dark:border-slate-800"
          data-testid="card-total-cost"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t('admin.dashboard.totalCost', 'Total Cost')}
                </p>
                <h3
                  className="text-2xl font-bold text-slate-900 dark:text-white mt-1"
                  data-testid="text-total-cost"
                >
                  ${stats?.totalCost.toFixed(2) || '0.00'}
                </h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                <TrendingDown className="h-5 w-5" />
              </div>
            </div>
          </div>
        </Card>

        {/* Total Orders */}
        <Card
          className="relative overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-sm border border-slate-100 dark:border-slate-800"
          data-testid="card-total-orders"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t('admin.dashboard.totalOrders', 'Total Orders')}
                </p>
                <h3
                  className="text-2xl font-bold text-slate-900 dark:text-white mt-1"
                  data-testid="text-total-orders"
                >
                  {stats?.totalOrders.toLocaleString() || 0}
                </h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                <ShoppingCart className="h-5 w-5" />
              </div>
            </div>
          </div>
        </Card>

        {/* Total Customers */}
        <Card
          className="relative overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-sm border border-slate-100 dark:border-slate-800"
          data-testid="card-total-customers"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t('admin.dashboard.customers', 'Customers')}
                </p>
                <h3
                  className="text-2xl font-bold text-slate-900 dark:text-white mt-1"
                  data-testid="text-total-customers"
                >
                  {stats?.totalCustomers.toLocaleString() || 0}
                </h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>
        </Card>

        {/* Active Packages */}
        <Card
          className="relative overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-sm border border-slate-100 dark:border-slate-800"
          data-testid="card-active-packages"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t('admin.dashboard.activePackages', 'Active Packages')}
                </p>
                <h3
                  className="text-2xl font-bold text-slate-900 dark:text-white mt-1"
                  data-testid="text-active-packages"
                >
                  {stats?.activePackages.toLocaleString() || 0}
                </h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                <PackageIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
        </Card>

        {/* Total Tickets */}
        <Card
          className="relative overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-sm border border-slate-100 dark:border-slate-800"
          data-testid="card-total-tickets"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t('admin.dashboard.totalTickets', 'Total Tickets')}
                </p>
                <h3
                  className="text-2xl font-bold text-slate-900 dark:text-white mt-1"
                  data-testid="text-total-tickets"
                >
                  {stats?.totalTickets.toLocaleString() || 0}
                </h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {hasOrders ? (
        <>
          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-7">
            {/* Revenue Trend */}
            <Card className="lg:col-span-4 border-0 shadow-lg dark:bg-gray-900/50 dark:border-gray-800">
              <div className="p-6 border-b border-slate-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t('admin.dashboard.revenueTrend', 'Revenue Trend')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                  {t('admin.dashboard.last6Months', 'Last 6 months performance')}
                </p>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats?.revenueByMonth || []}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      className="dark:stroke-gray-700"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="#64748b"
                      className="dark:stroke-gray-400"
                      style={{ fontSize: '12px' }}
                      tick={{ fill: 'currentColor' }}
                    />
                    <YAxis
                      stroke="#64748b"
                      className="dark:stroke-gray-400"
                      style={{ fontSize: '12px' }}
                      tick={{ fill: 'currentColor' }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                      itemStyle={{ color: '#1e293b' }}
                      labelStyle={{ color: '#1e293b' }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--primary)"
                      strokeWidth={3}
                      fill="url(#colorRevenue)"
                      dot={{ fill: 'var(--primary)', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Order Status */}
            <Card className="lg:col-span-3 border-0 shadow-lg dark:bg-gray-900/50 dark:border-gray-800">
              <div className="p-6 border-b border-slate-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t('admin.dashboard.orderStatus', 'Order Status')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                  {t('admin.dashboard.distributionOverview', 'Distribution overview')}
                </p>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                      itemStyle={{ color: '#1e293b' }}
                      labelStyle={{ color: '#1e293b' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Top Destinations */}
          <Card className="border-0 shadow-lg dark:bg-gray-900/50 dark:border-gray-800">
            <div className="p-6 border-b border-slate-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {t('admin.dashboard.topDestinations', 'Top Destinations')}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                    {t('admin.dashboard.topDestinationsDesc', 'Most popular packages by country')}
                  </p>
                </div>
                <Link href="/admin/unified-packages">
                  <Button variant="outline" size="sm" className="gap-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white">
                    {t('admin.dashboard.viewAll', 'View All')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats?.topDestinations.slice(0, 6).map((dest, index) => (
                  <div
                    key={dest.country}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-800/50 transition-all duration-200"
                    data-testid={`top-destination-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{dest.flag}</span>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {dest.country}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-gray-400">
                          {dest.count} {t('admin.dashboard.orders', 'orders')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        ${dest.revenue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* World Map */}
          <WorldMap
            data={stats?.ordersByCountry || []}
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
          />

          {/* Latest Orders & Customers Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Latest Orders */}
            <Card className="border-0 shadow-lg dark:bg-gray-900/50 dark:border-gray-800">
              <div className="p-6 border-b border-slate-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {t('admin.dashboard.latestOrders', 'Latest Orders')}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                      {t('admin.dashboard.latestOrdersDesc', 'Recent eSIM purchases')}
                    </p>
                  </div>
                  <Link href="/admin/orders">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                      data-testid="button-view-all-orders"
                    >
                      {t('admin.dashboard.viewAll', 'View All')}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats?.latestOrders?.slice(0, 10).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-800/50 transition-all duration-200"
                      data-testid={`latest-order-${order.displayOrderId}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="secondary" className="font-mono text-xs dark:bg-gray-700 dark:text-gray-300">
                            OID{String(order.displayOrderId).padStart(3, '0')}
                          </Badge>
                          <Badge
                            variant={
                              order.status === 'completed'
                                ? 'default'
                                : order.status === 'failed'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                            className="capitalize dark:bg-opacity-80"
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">
                          {order.packageTitle}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-gray-400">
                          {order.userEmail || t('admin.dashboard.adminOrder', 'Admin Order')} •{' '}
                          {order.destinationName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">
                          {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600 dark:text-emerald-400">
                          ${order.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Latest Customers */}
            <Card className="border-0 shadow-lg dark:bg-gray-900/50 dark:border-gray-800">
              <div className="p-6 border-b border-slate-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {t('admin.dashboard.latestCustomers', 'Latest Customers')}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                      {t('admin.dashboard.latestCustomersDesc', 'Recently registered users')}
                    </p>
                  </div>
                  <Link href="/admin/customers">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                      data-testid="button-view-all-customers"
                    >
                      {t('admin.dashboard.viewAll', 'View All')}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats?.latestCustomers?.slice(0, 10).map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-800/50 transition-all duration-200"
                      data-testid={`latest-customer-${customer.displayUserId}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="font-mono text-xs dark:bg-gray-700 dark:text-gray-300">
                            UID{String(customer.displayUserId).padStart(3, '0')}
                          </Badge>
                        </div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">
                          {customer.name || t('admin.dashboard.noName', 'No Name')}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-gray-400">
                          {customer.email}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">
                          {t('admin.dashboard.joined', 'Joined')}{' '}
                          {format(new Date(customer.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </>
      ) : (
        /* Empty State */
        <Card className="border-0 shadow-lg dark:bg-gray-900/50 dark:border-gray-800">
          <div className="p-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-indigo-100 dark:from-primary/20 dark:to-indigo-900/40 mx-auto mb-6">
              <ShoppingCart className="h-10 w-10 text-primary dark:text-primary-light" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {t('admin.dashboard.noOrdersYet', 'No Orders Yet')}
            </h3>
            <p className="text-slate-600 dark:text-gray-300 max-w-md mx-auto mb-6">
              {t(
                'admin.dashboard.noOrdersDesc',
                'Your marketplace is ready! Start by adding packages and wait for customers to place their first orders.',
              )}
            </p>
            <div className="flex gap-4 justify-center flex-col md:flex-row">
              <Link href="/admin/unified-packages">
                <Button className="bg-hero-gradient hover:bg-hero-gradient text-white shadow-md hover:shadow-lg transition-all duration-300">
                  {t('admin.dashboard.managePackages', 'Manage Packages')}
                </Button>
              </Link>
              <Link href="/admin/customers">
                <Button variant="outline" className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white">
                  {t('admin.dashboard.viewCustomers', 'View Customers')}
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
