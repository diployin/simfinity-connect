import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Check, X, DollarSign, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { CurrencyRate } from '@shared/schema';
import { useTranslation } from '@/contexts/TranslationContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Currencies() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<CurrencyRate | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    symbol: '',
    conversionRate: '1.000000',
  });

  const { data: currencies, isLoading } = useQuery<CurrencyRate[]>({
    queryKey: ['/api/admin/currencies'],
  });

  const addCurrencyMutation = useMutation({
    mutationFn: async (currency: Partial<CurrencyRate>) => {
      const payload = {
        ...currency,
        conversionRate: Number(currency.conversionRate),
      };
      return await apiRequest('POST', '/api/admin/currencies', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/currencies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/currencies'] });
      resetForm();
      setShowAddDialog(false);
      toast({
        title: 'Success',
        description: 'Currency added successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add currency',
        variant: 'destructive',
      });
    },
  });

  const updateCurrencyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CurrencyRate> }) => {
      return await apiRequest('PUT', `/api/admin/currencies/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/currencies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/currencies'] });
      resetForm();
      setEditingCurrency(null);
      toast({
        title: 'Success',
        description: 'Currency updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update currency',
        variant: 'destructive',
      });
    },
  });

  const deleteCurrencyMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/admin/currencies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/currencies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/currencies'] });
      toast({
        title: 'Success',
        description: 'Currency deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete currency',
        variant: 'destructive',
      });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('PUT', `/api/admin/currencies/${id}`, { isDefault: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/currencies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/currencies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      toast({
        title: 'Success',
        description: 'Default currency updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to set default currency',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      symbol: '',
      conversionRate: '1.000000',
    });
  };

  const handleAddCurrency = () => {
    if (!formData.code || !formData.name || !formData.symbol) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    const rate = parseFloat(formData.conversionRate);
    if (isNaN(rate) || rate <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Conversion rate must be a positive number',
        variant: 'destructive',
      });
      return;
    }
    addCurrencyMutation.mutate({
      ...formData,
      conversionRate: rate.toString(),
    });
  };

  const handleUpdateCurrency = () => {
    if (!editingCurrency) return;
    const rate = parseFloat(formData.conversionRate);
    if (isNaN(rate) || rate <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Conversion rate must be a positive number',
        variant: 'destructive',
      });
      return;
    }
    updateCurrencyMutation.mutate({
      id: editingCurrency.id,
      data: {
        code: formData.code,
        name: formData.name,
        symbol: formData.symbol,
        conversionRate: rate.toString(),
      },
    });
  };

  const openEditDialog = (currency: CurrencyRate) => {
    setEditingCurrency(currency);
    setFormData({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      conversionRate: currency.conversionRate?.toString() || '1.000000',
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Currency Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage currencies and conversion rates for your platform
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowAddDialog(true);
          }}
          className="gap-2"
          data-testid="button-add-currency"
        >
          <Plus className="h-4 w-4" />
          Add Currency
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Currencies
          </CardTitle>
          <CardDescription>
            All prices are stored in USD. Conversion rates are multipliers from USD to target
            currency.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !currencies || currencies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No currencies configured. Add your first currency to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Conversion Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currencies.map((currency) => (
                  <TableRow key={currency.id} data-testid={`currency-row-${currency.code}`}>
                    <TableCell className="text-2xl font-mono">{currency.symbol}</TableCell>
                    <TableCell className="font-semibold">{currency.code}</TableCell>
                    <TableCell>{currency.name}</TableCell>
                    <TableCell className="font-mono">
                      1 USD = {currency.conversionRate} {currency.code}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={currency.isEnabled}
                        onCheckedChange={(checked) =>
                          updateCurrencyMutation.mutate({
                            id: currency.id,
                            data: { isEnabled: checked },
                          })
                        }
                        data-testid={`switch-enabled-${currency.code}`}
                      />
                    </TableCell>
                    <TableCell>
                      {currency.isDefault ? (
                        <Badge className="bg-[#2c7338] text-white">Default</Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDefaultMutation.mutate(currency.id)}
                          disabled={setDefaultMutation.isPending}
                          data-testid={`button-set-default-${currency.code}`}
                        >
                          Set Default
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(currency)}
                          data-testid={`button-edit-${currency.code}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        {!currency.isDefault && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteCurrencyMutation.mutate(currency.id)}
                            disabled={deleteCurrencyMutation.isPending}
                            data-testid={`button-delete-${currency.code}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Currency</DialogTitle>
            <DialogDescription>
              Add a new currency with its conversion rate from USD.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Currency Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="USD"
                  maxLength={3}
                  data-testid="input-currency-code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  placeholder="$"
                  maxLength={5}
                  data-testid="input-currency-symbol"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Currency Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="US Dollar"
                data-testid="input-currency-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Conversion Rate (from USD)</Label>
              <Input
                id="rate"
                type="number"
                step="0.000001"
                value={formData.conversionRate}
                onChange={(e) => setFormData({ ...formData, conversionRate: e.target.value })}
                placeholder="1.000000"
                data-testid="input-currency-rate"
              />
              <p className="text-xs text-muted-foreground">
                Enter how many units of this currency equals 1 USD
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCurrency}
              disabled={addCurrencyMutation.isPending}
              data-testid="button-save-currency"
            >
              {addCurrencyMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Currency'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCurrency} onOpenChange={(open) => !open && setEditingCurrency(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Currency</DialogTitle>
            <DialogDescription>Update currency details and conversion rate.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Currency Code</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="USD"
                  maxLength={3}
                  data-testid="input-edit-currency-code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-symbol">Symbol</Label>
                <Input
                  id="edit-symbol"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  placeholder="$"
                  maxLength={5}
                  data-testid="input-edit-currency-symbol"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Currency Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="US Dollar"
                data-testid="input-edit-currency-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-rate">Conversion Rate (from USD)</Label>
              <Input
                id="edit-rate"
                type="number"
                step="0.000001"
                value={formData.conversionRate}
                onChange={(e) => setFormData({ ...formData, conversionRate: e.target.value })}
                placeholder="1.000000"
                data-testid="input-edit-currency-rate"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCurrency(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCurrency}
              disabled={updateCurrencyMutation.isPending}
              data-testid="button-update-currency"
            >
              {updateCurrencyMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Currency'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
