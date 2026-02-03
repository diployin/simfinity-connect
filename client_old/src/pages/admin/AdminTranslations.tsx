import { useState, useMemo, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import {
  FileText,
  Search,
  Save,
  AlertCircle,
  Check,
  Download,
  Upload,
  Globe,
  FileUp,
  Plus,
  Trash2,
} from 'lucide-react';
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
}

interface TranslationKey {
  id: string;
  namespace: string;
  key: string;
  description: string | null;
  value: string | null;
  isMissing: boolean;
}

interface TranslationStats {
  total: number;
  translated: number;
  missing: number;
}

interface TranslationsData {
  language: Language;
  translations: TranslationKey[];
  stats: TranslationStats;
}

const NAMESPACES = ['common', 'website', 'userPanel', 'adminPanel', 'app'];

export default function AdminTranslations() {
  const { toast } = useToast();
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('');
  const [selectedNamespace, setSelectedNamespace] = useState<string>('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState<string>('');
  const [importFormat, setImportFormat] = useState<'json' | 'csv'>('json');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAddKeyDialog, setShowAddKeyDialog] = useState(false);
  const [newKeyData, setNewKeyData] = useState({ namespace: 'common', key: '', description: '' });

  const { data: languages = [] } = useQuery<Language[]>({
    queryKey: ['/api/admin/languages'],
  });

  const selectedLanguage = languages.find((l) => l.id === selectedLanguageId);

  const { data: translationsData, isLoading } = useQuery<TranslationsData>({
    queryKey: [`/api/admin/translations/${selectedLanguageId}`, { namespace: selectedNamespace }],
    enabled: !!selectedLanguageId,
  });

  const translations = translationsData?.translations || [];
  const stats = translationsData?.stats;

  const saveMutation = useMutation({
    mutationFn: async ({ keyId, value }: { keyId: string; value: string }) => {
      return apiRequest('PUT', `/api/admin/translations/${selectedLanguageId}/${keyId}`, {
        value,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/admin/translations/${selectedLanguageId}`],
      });
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0];
          return typeof key === 'string' && key.startsWith('/api/translations/');
        },
      });
      setEditingKey(null);
      toast({ title: 'Success', description: 'Translation saved' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const importMutation = useMutation({
    mutationFn: async (data: { translations: Record<string, string>; format: string }) => {
      return apiRequest('POST', `/api/admin/translations/${selectedLanguageId}/import`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/admin/translations/${selectedLanguageId}`],
      });
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0];
          return typeof key === 'string' && key.startsWith('/api/translations/');
        },
      });
      setShowImportDialog(false);
      setImportData('');
      toast({
        title: 'Import Successful',
        description: 'Translations have been imported successfully',
      });
    },
    onError: (error: Error) => {
      toast({ title: 'Import Failed', description: error.message, variant: 'destructive' });
    },
  });

  const createKeyMutation = useMutation({
    mutationFn: async (data: { namespace: string; key: string; description?: string }) => {
      return apiRequest('POST', '/api/admin/translations/keys', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0];
          return typeof key === 'string' && key.startsWith('/api/admin/translations/');
        },
      });
      setShowAddKeyDialog(false);
      setNewKeyData({ namespace: 'common', key: '', description: '' });
      toast({ title: 'Success', description: 'Translation key created' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      return apiRequest('DELETE', `/api/admin/translations/keys/${keyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0];
          return (
            typeof key === 'string' &&
            (key.startsWith('/api/admin/translations/') || key.startsWith('/api/translations/'))
          );
        },
      });
      toast({ title: 'Success', description: 'Translation key deleted' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const filteredTranslations = useMemo(() => {
    let result = translations.filter((t) => t.namespace === selectedNamespace);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.key.toLowerCase().includes(query) || (t.value && t.value.toLowerCase().includes(query)),
      );
    }

    if (showMissingOnly) {
      result = result.filter((t) => t.isMissing);
    }

    return result;
  }, [translations, selectedNamespace, searchQuery, showMissingOnly]);

  const handleEdit = (key: TranslationKey) => {
    setEditingKey(key.id);
    setEditValue(key.value || '');
  };

  const handleSave = (keyId: string) => {
    saveMutation.mutate({ keyId, value: editValue });
  };

  const handleExport = () => {
    if (!selectedLanguageId) return;
    window.open(`/api/admin/translations/${selectedLanguageId}/export?format=json`, '_blank');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);

      if (file.name.endsWith('.csv')) {
        setImportFormat('csv');
      } else {
        setImportFormat('json');
      }
      setShowImportDialog(true);
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const parseImportData = (): Record<string, string> | null => {
    try {
      if (importFormat === 'json') {
        const parsed = JSON.parse(importData);
        const result: Record<string, string> = {};

        if (typeof parsed === 'object' && !Array.isArray(parsed)) {
          for (const [ns, keys] of Object.entries(parsed)) {
            if (typeof keys === 'object' && keys !== null) {
              for (const [key, value] of Object.entries(keys as Record<string, string>)) {
                result[`${ns}.${key}`] = String(value);
              }
            }
          }
        }
        return result;
      } else {
        const lines = importData.trim().split('\n');
        const result: Record<string, string> = {};

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const firstComma = line.indexOf(',');
          if (firstComma === -1) continue;

          const key = line.substring(0, firstComma).trim().replace(/^"|"$/g, '');
          let value = line.substring(firstComma + 1).trim();

          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1).replace(/""/g, '"');
          }

          if (key && value) {
            result[key] = value;
          }
        }
        return result;
      }
    } catch (error) {
      toast({
        title: 'Parse Error',
        description: 'Failed to parse the import file. Please check the format.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const handleImport = () => {
    const flatTranslations = parseImportData();
    if (!flatTranslations || Object.keys(flatTranslations).length === 0) {
      toast({
        title: 'No Data',
        description: 'No valid translations found in the file.',
        variant: 'destructive',
      });
      return;
    }

    const nestedTranslations: Record<string, Record<string, string>> = {};
    for (const [fullKey, value] of Object.entries(flatTranslations)) {
      const dotIndex = fullKey.indexOf('.');
      if (dotIndex === -1) continue;

      const namespace = fullKey.substring(0, dotIndex);
      const key = fullKey.substring(dotIndex + 1);

      if (!nestedTranslations[namespace]) {
        nestedTranslations[namespace] = {};
      }
      nestedTranslations[namespace][key] = value;
    }

    if (Object.keys(nestedTranslations).length > 0) {
      importMutation.mutate({
        translations: nestedTranslations as unknown as Record<string, string>,
        format: importFormat,
      });
    } else {
      toast({
        title: 'No Data',
        description: 'No valid translations found in the file.',
        variant: 'destructive',
      });
    }
  };

  const completionPercentage = stats ? Math.round((stats.translated / stats.total) * 100) : 0;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
              Translation Editor
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage translations for all supported languages
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json,.csv"
              className="hidden"
              data-testid="input-import-file"
            />

            <Button
              onClick={() => setShowAddKeyDialog(true)}
              data-testid="button-add-key"
              size="sm"
              className="h-9"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Key
            </Button>

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={!selectedLanguageId}
              data-testid="button-import"
              size="sm"
              className="h-9"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>

            <Button
              variant="outline"
              onClick={handleExport}
              disabled={!selectedLanguageId}
              data-testid="button-export"
              size="sm"
              className="h-9"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Language</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {languages.map((lang) => (
                <Button
                  key={lang.id}
                  variant={selectedLanguageId === lang.id ? 'default' : 'outline'}
                  className="flex items-center gap-2 justify-start"
                  onClick={() => setSelectedLanguageId(lang.id)}
                  data-testid={`button-select-lang-${lang.code}`}
                >
                  <ReactCountryFlag
                    countryCode={lang.flagCode}
                    svg
                    style={{ width: '20px', height: '15px' }}
                  />
                  <span>{lang.name}</span>
                  {lang.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedLanguageId && stats && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Translated</CardTitle>
                <Check className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.translated}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Missing</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{stats.missing}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{Math.min(completionPercentage, 100)}%</div>
                </div>
                <Progress
                  value={Math.min(completionPercentage, 100)}
                  className="mt-2 [&>div]:bg-teal-500"
                />
              </CardContent>
            </Card>
          </div>
        )}

        {selectedLanguageId && (
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  {selectedLanguage && (
                    <>
                      <ReactCountryFlag
                        countryCode={selectedLanguage.flagCode}
                        svg
                        style={{ width: '24px', height: '18px' }}
                      />
                      {selectedLanguage.name} Translations
                    </>
                  )}
                </CardTitle>

                <div className="flex-1" />

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search keys or values..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 w-64"
                      data-testid="input-search-translations"
                    />
                  </div>
                  <Button
                    variant={showMissingOnly ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setShowMissingOnly(!showMissingOnly)}
                    data-testid="button-show-missing"
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Missing Only
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedNamespace} onValueChange={setSelectedNamespace}>
                <TabsList className="mb-4">
                  {NAMESPACES.map((ns) => {
                    const nsTranslations = translations.filter((t) => t.namespace === ns);
                    const nsMissing = nsTranslations.filter((t) => t.isMissing).length;
                    return (
                      <TabsTrigger key={ns} value={ns} className="gap-2">
                        {ns}
                        {nsMissing > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {nsMissing}
                          </Badge>
                        )}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {NAMESPACES.map((ns) => (
                  <TabsContent key={ns} value={ns}>
                    {isLoading ? (
                      <div className="text-center py-8">Loading translations...</div>
                    ) : filteredTranslations.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No translations found
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/3">Key</TableHead>
                            <TableHead className="w-1/2">Translation</TableHead>
                            <TableHead className="w-24">Status</TableHead>
                            <TableHead className="w-20 text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTranslations.map((translation) => (
                            <TableRow
                              key={translation.id}
                              data-testid={`row-translation-${translation.key}`}
                            >
                              <TableCell className="font-mono text-sm">{translation.key}</TableCell>
                              <TableCell>
                                {editingKey === translation.id ? (
                                  <Textarea
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="min-h-[60px]"
                                    placeholder="Enter translation..."
                                    dir={selectedLanguage?.isRTL ? 'rtl' : 'ltr'}
                                    data-testid="textarea-translation"
                                  />
                                ) : translation.value ? (
                                  <span
                                    className="cursor-pointer"
                                    onClick={() => handleEdit(translation)}
                                    dir={selectedLanguage?.isRTL ? 'rtl' : 'ltr'}
                                  >
                                    {translation.value}
                                  </span>
                                ) : (
                                  <span
                                    className="text-muted-foreground italic cursor-pointer"
                                    onClick={() => handleEdit(translation)}
                                  >
                                    Click to add translation
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                {translation.isMissing ? (
                                  <Badge
                                    variant="outline"
                                    className="text-amber-600 border-amber-300"
                                  >
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Missing
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-green-600 border-green-300"
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Done
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {editingKey === translation.id ? (
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditingKey(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleSave(translation.id)}
                                      disabled={saveMutation.isPending}
                                      data-testid="button-save-translation"
                                    >
                                      <Save className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleEdit(translation)}
                                      data-testid={`button-edit-${translation.key}`}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        if (
                                          confirm(
                                            `Delete key "${translation.namespace}.${translation.key}"? This will remove the key and all its translations.`,
                                          )
                                        ) {
                                          deleteKeyMutation.mutate(translation.id);
                                        }
                                      }}
                                      disabled={deleteKeyMutation.isPending}
                                      data-testid={`button-delete-${translation.key}`}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}

        <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileUp className="h-5 w-5" />
                Import Translations
              </DialogTitle>
              <DialogDescription>
                Import translations from a JSON or CSV file. Existing translations will be updated.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label>Format Detected:</Label>
                <Badge variant="outline">{importFormat.toUpperCase()}</Badge>
              </div>

              <div className="space-y-2">
                <Label>Preview (first 500 characters)</Label>
                <div className="bg-muted p-3 rounded-md font-mono text-xs max-h-48 overflow-auto whitespace-pre-wrap">
                  {importData.slice(0, 500)}
                  {importData.length > 500 && '...'}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md text-sm">
                <p className="font-medium mb-2">Expected Format:</p>
                <p className="text-muted-foreground mb-2">
                  <strong>JSON:</strong> Nested object with namespaces as keys, containing key-value
                  pairs.
                </p>
                <pre className="bg-background p-2 rounded text-xs overflow-auto">
                  {`{
  "common": {
    "button.save": "Save",
    "button.cancel": "Cancel"
  },
  "website": {
    "home.hero.title": "Welcome"
  }
}`}
                </pre>
                <p className="text-muted-foreground mt-2">
                  <strong>CSV:</strong> Two columns - key and value, with header row.
                </p>
                <pre className="bg-background p-2 rounded text-xs mt-1">
                  {`key,value
common.button.save,Save
common.button.cancel,Cancel`}
                </pre>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowImportDialog(false)}
                data-testid="button-import-cancel"
              >
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={importMutation.isPending || !importData}
                data-testid="button-import-confirm"
              >
                {importMutation.isPending ? 'Importing...' : 'Import Translations'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showAddKeyDialog} onOpenChange={setShowAddKeyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Translation Key
              </DialogTitle>
              <DialogDescription>
                Create a new translation key. This will create the key for all languages.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="namespace">Namespace</Label>
                <Select
                  value={newKeyData.namespace}
                  onValueChange={(value) => setNewKeyData({ ...newKeyData, namespace: value })}
                >
                  <SelectTrigger data-testid="select-namespace">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NAMESPACES.map((ns) => (
                      <SelectItem key={ns} value={ns}>
                        {ns}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key">Key</Label>
                <Input
                  id="key"
                  placeholder="e.g., button.submit or hero.title"
                  value={newKeyData.key}
                  onChange={(e) => setNewKeyData({ ...newKeyData, key: e.target.value })}
                  data-testid="input-new-key"
                />
                <p className="text-xs text-muted-foreground">
                  Use dot notation for nested keys (e.g., home.hero.title)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  placeholder="Describe where this key is used"
                  value={newKeyData.description}
                  onChange={(e) => setNewKeyData({ ...newKeyData, description: e.target.value })}
                  data-testid="input-key-description"
                />
              </div>

              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium">Full Key Path:</p>
                <code className="text-sm text-muted-foreground">
                  {newKeyData.namespace}.{newKeyData.key || '<key>'}
                </code>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddKeyDialog(false);
                  setNewKeyData({ namespace: 'common', key: '', description: '' });
                }}
                data-testid="button-add-key-cancel"
              >
                Cancel
              </Button>
              <Button
                onClick={() => createKeyMutation.mutate(newKeyData)}
                disabled={createKeyMutation.isPending || !newKeyData.key.trim()}
                data-testid="button-add-key-confirm"
              >
                {createKeyMutation.isPending ? 'Creating...' : 'Create Key'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
