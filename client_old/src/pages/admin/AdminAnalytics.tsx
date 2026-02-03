import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AdminAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: overview, isLoading: overviewLoading } = useQuery<{
    totalRevenue: number;
    activeUsers: number;
    conversionRate: string;
    avgOrderValue: string;
    totalOrders: number;
  }>({
    queryKey: ['/api/admin/analytics/overview'],
  });

  console.log(overview);

  const { data: funnel, isLoading: funnelLoading } = useQuery<{
    visitors: number;
    packageViews: number;
    checkoutStarts: number;
    purchases: number;
  }>({
    queryKey: ['/api/admin/analytics/funnel'],
  });

  const { data: segments, isLoading: segmentsLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/analytics/segments'],
  });

  const { data: abandonedCarts, isLoading: cartsLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/analytics/abandoned-carts'],
  });

  const funnelData = funnel
    ? [
        { name: 'Visitors', value: funnel.visitors },
        { name: 'Package Views', value: funnel.packageViews },
        { name: 'Checkout Starts', value: funnel.checkoutStarts },
        { name: 'Purchases', value: funnel.purchases },
      ]
    : [];

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
  ];

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Analytics - Admin Dashboard</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Track performance metrics and user behavior</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto scrollbar-hide">
          <TabsList className="flex min-w-max gap-1 p-1" data-testid="tabs-analytics">
            <TabsTrigger
              value="overview"
              className="whitespace-nowrap px-3 py-2 text-sm"
              data-testid="tab-overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="funnel"
              className="whitespace-nowrap px-3 py-2 text-sm"
              data-testid="tab-funnel"
            >
              Funnel
            </TabsTrigger>
            <TabsTrigger
              value="segments"
              className="whitespace-nowrap px-3 py-2 text-sm"
              data-testid="tab-segments"
            >
              Segments
            </TabsTrigger>
            <TabsTrigger
              value="abandoned"
              className="whitespace-nowrap px-3 py-2 text-sm"
              data-testid="tab-abandoned"
            >
              Abandoned Carts
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {overviewLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card data-testid="card-total-revenue">
                  <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-total-revenue">
                      ${Number(overview?.totalRevenue).toFixed(2) || '0.00'}
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-active-users">
                  <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users (30d)</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-active-users">
                      {overview?.activeUsers || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-conversion-rate">
                  <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-conversion-rate">
                      {overview?.conversionRate || '0'}%
                    </div>
                  </CardContent>
                </Card>

                <Card data-testid="card-avg-order-value">
                  <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-avg-order-value">
                      ${overview?.avgOrderValue || '0.00'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          {funnelLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Card data-testid="card-conversion-funnel">
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={funnelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          {segmentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Card data-testid="card-segments">
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
              </CardHeader>
              <CardContent>
                {segments && segments.length > 0 ? (
                  <div className="space-y-4">
                    {segments.map((segment) => (
                      <div
                        key={segment.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                        data-testid={`segment-${segment.id}`}
                      >
                        <div>
                          <h3 className="font-medium" data-testid={`segment-name-${segment.id}`}>
                            {segment.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{segment.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold" data-testid={`segment-count-${segment.id}`}>
                            {segment.userCount || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">users</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No segments created yet</p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="abandoned" className="space-y-6">
          {cartsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Card data-testid="card-abandoned-carts">
              <CardHeader>
                <CardTitle>Abandoned Carts</CardTitle>
              </CardHeader>
              <CardContent>
                {abandonedCarts && abandonedCarts.length > 0 ? (
                  <div className="space-y-4">
                    {abandonedCarts.map((cart: any) => (
                      <div
                        key={cart.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                        data-testid={`cart-${cart.id}`}
                      >
                        <div>
                          <p className="font-medium" data-testid={`cart-user-${cart.id}`}>
                            {cart.user?.email || 'Guest'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {cart.package?.title || 'Unknown Package'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(cart.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          {cart.reminderSent ? (
                            <span className="text-xs text-muted-foreground">Reminder sent</span>
                          ) : (
                            <span className="text-xs font-medium">No reminder</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No abandoned carts</p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
