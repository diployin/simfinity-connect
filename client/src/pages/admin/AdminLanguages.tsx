import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Globe, Plus, Star, Edit, Trash2, Check, Languages } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';

interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  flagCode: string;
  isRTL: boolean;
  isEnabled: boolean;
  isDefault: boolean;
  sortOrder: number;
  createdAt: string;
}

export default function AdminLanguages() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    nativeName: '',
    flagCode: '',
    isRTL: false,
    isEnabled: true,
    sortOrder: 1,
  });

  const { data: languages = [], isLoading } = useQuery<Language[]>({
    queryKey: ['/api/admin/languages'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest('POST', '/api/admin/languages', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/languages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/languages'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({ title: 'Success', description: 'Language created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      return apiRequest('PUT', `/api/admin/languages/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/languages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/languages'] });
      setEditingLanguage(null);
      resetForm();
      toast({ title: 'Success', description: 'Language updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('POST', `/api/admin/languages/${id}/set-default`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/languages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/languages'] });
      toast({ title: 'Success', description: 'Default language updated' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/admin/languages/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/languages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/languages'] });
      toast({ title: 'Success', description: 'Language deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      nativeName: '',
      flagCode: '',
      isRTL: false,
      isEnabled: true,
      sortOrder: languages.length + 1,
    });
  };

  const handleEdit = (language: Language) => {
    setEditingLanguage(language);
    setFormData({
      code: language.code,
      name: language.name,
      nativeName: language.nativeName,
      flagCode: language.flagCode,
      isRTL: language.isRTL,
      isEnabled: language.isEnabled,
      sortOrder: language.sortOrder,
    });
  };

  const handleSubmit = () => {
    if (editingLanguage) {
      updateMutation.mutate({ id: editingLanguage.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleToggleEnabled = (language: Language) => {
    updateMutation.mutate({
      id: language.id,
      data: { isEnabled: !language.isEnabled },
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Languages className="h-6 w-6" />
              Language Management
            </h1>
            <p className="text-muted-foreground">Manage supported languages for your platform</p>
          </div>

          <Dialog
            open={isAddDialogOpen || !!editingLanguage}
            onOpenChange={(open) => {
              if (!open) {
                setIsAddDialogOpen(false);
                setEditingLanguage(null);
                resetForm();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-language">
                <Plus className="h-4 w-4 mr-2" />
                Add Language
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-1">
              <DialogHeader>
                <DialogTitle>{editingLanguage ? 'Edit Language' : 'Add New Language'}</DialogTitle>
                <DialogDescription>
                  {editingLanguage
                    ? 'Update language details'
                    : 'Add a new language to your platform'}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Language Code</Label>
                    <Input
                      id="code"
                      placeholder="en"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      data-testid="input-language-code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="flagCode">Flag Code</Label>
                    <Input
                      id="flagCode"
                      placeholder="US"
                      value={formData.flagCode}
                      onChange={(e) => setFormData({ ...formData, flagCode: e.target.value })}
                      data-testid="input-flag-code"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name (English)</Label>
                    <Input
                      id="name"
                      placeholder="English"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      data-testid="input-language-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nativeName">Native Name</Label>
                    <Input
                      id="nativeName"
                      placeholder="English"
                      value={formData.nativeName}
                      onChange={(e) => setFormData({ ...formData, nativeName: e.target.value })}
                      data-testid="input-native-name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) =>
                        setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })
                      }
                      data-testid="input-sort-order"
                    />
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isRTL"
                        checked={formData.isRTL}
                        onCheckedChange={(checked) => setFormData({ ...formData, isRTL: checked })}
                      />
                      <Label htmlFor="isRTL">RTL Language</Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isEnabled"
                    checked={formData.isEnabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, isEnabled: checked })}
                  />
                  <Label htmlFor="isEnabled">Enabled</Label>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingLanguage(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-language"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingLanguage
                      ? 'Update'
                      : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Languages</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{languages.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enabled</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {languages.filter((l) => l.isEnabled).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">RTL Languages</CardTitle>
              <Languages className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{languages.filter((l) => l.isRTL).length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Languages</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading languages...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Order</TableHead>
                    <TableHead>Flag</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Native Name</TableHead>
                    <TableHead>RTL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {languages
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((language) => (
                      <TableRow key={language.id} data-testid={`row-language-${language.code}`}>
                        <TableCell>{language.sortOrder}</TableCell>
                        <TableCell>
                          <ReactCountryFlag
                            countryCode={language.flagCode}
                            svg
                            style={{ width: '24px', height: '18px' }}
                          />
                        </TableCell>
                        <TableCell className="font-mono">{language.code}</TableCell>
                        <TableCell>{language.name}</TableCell>
                        <TableCell>{language.nativeName}</TableCell>
                        <TableCell>
                          {language.isRTL ? (
                            <Badge variant="secondary">RTL</Badge>
                          ) : (
                            <span className="text-muted-foreground">LTR</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={language.isEnabled}
                              onCheckedChange={() => handleToggleEnabled(language)}
                              disabled={language.isDefault}
                            />
                            {language.isDefault && (
                              <Badge className="bg-amber-500">
                                <Star className="h-3 w-3 mr-1" />
                                Default
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!language.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDefaultMutation.mutate(language.id)}
                                disabled={setDefaultMutation.isPending}
                                data-testid={`button-set-default-${language.code}`}
                              >
                                <Star className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(language)}
                              data-testid={`button-edit-${language.code}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {!language.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this language?')) {
                                    deleteMutation.mutate(language.id);
                                  }
                                }}
                                disabled={deleteMutation.isPending}
                                data-testid={`button-delete-${language.code}`}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
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
      </div>
    </>
  );
}
