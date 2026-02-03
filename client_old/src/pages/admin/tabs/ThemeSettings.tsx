// components/admin/tabs/ThemeSettings.tsx - Fixed Import and API Integration
import React, { useState, useEffect, useMemo } from 'react';
import {
  Save,
  Palette,
  Loader2,
  RefreshCw,
  Download,
  Sparkles,
  Eye,
  Check,
  Type,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/TranslationContext';
import { useTheme, availableFonts } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { ChromePicker } from 'react-color';

export function ThemeSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [showPickers, setShowPickers] = useState({
    primary: false,
    primarySecond: false,
    primaryLight: false,
    primaryDark: false,
  });

  const { colors, fonts, updateColor, updateFont } = useTheme();

  /* ---------------- Fetch Settings ---------------- */
  const { data: settingsResponse } = useQuery({
    queryKey: ['/api/admin/settings'],
  });

  /* ---------------- Normalize Settings ---------------- */
  const settings = useMemo(() => {
    if (!settingsResponse) return {};
    return settingsResponse.reduce((acc: Record<string, string>, s: any) => {
      acc[s.key] = s.value;
      return acc;
    }, {});
  }, [settingsResponse]);

  /* ---------------- Load From API ---------------- */
  useEffect(() => {
    if (!settings || Object.keys(settings).length === 0) return;

    updateColor('primary', settings.theme_primary || colors.primary);
    updateColor('primarySecond', settings.theme_primary_second || colors.primarySecond);
    updateColor('primaryLight', settings.theme_primary_light || colors.primaryLight);
    updateColor('primaryDark', settings.theme_primary_dark || colors.primaryDark);

    updateFont('primary', settings.theme_font_primary || fonts.primary);
    updateFont('secondary', settings.theme_font_secondary || fonts.secondary);
  }, [settings]);

  /* ---------------- Save Mutation ---------------- */
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      return apiRequest('PUT', `/api/admin/settings/${key}`, {
        value,
        category: 'theme',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* ---------------- Load From API ---------------- */
  const handleLoadFromAPI = async () => {
    setIsLoading(true);
    try {
      if (!settings || Object.keys(settings).length === 0) return;

      updateColor('primary', settings.theme_primary);
      updateColor('primarySecond', settings.theme_primary_second);
      updateColor('primaryLight', settings.theme_primary_light);
      updateColor('primaryDark', settings.theme_primary_dark);

      updateFont('heading', settings.theme_font_heading);
      updateFont('body', settings.theme_font_body);

      toast({
        title: 'Success',
        description: 'Theme loaded from server',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to load theme',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- Reset ---------------- */
  const handleReset = () => {
    updateColor('primary', '#14b8a6');
    updateColor('primarySecond', '#0d9488');
    updateColor('primaryLight', '#2dd4bf');
    updateColor('primaryDark', '#0f766e');

    updateFont('heading', 'Inter');
    updateFont('body', 'Inter');

    toast({
      title: 'Reset Complete',
      description: 'Theme reset to defaults',
    });
  };

  const colorKeys = [
    {
      key: 'primary' as const,
      label: 'Primary Color',
      description: 'Main brand color used throughout the application',
      icon: '🎨',
    },
    {
      key: 'primarySecond' as const,
      label: 'Secondary Color',
      description: 'Complementary color for gradients and accents',
      icon: '✨',
    },
    {
      key: 'primaryLight' as const,
      label: 'Light Variant',
      description: 'Lighter shade for backgrounds and hover states',
      icon: '☀️',
    },
    {
      key: 'primaryDark' as const,
      label: 'Dark Variant',
      description: 'Darker shade for text and borders',
      icon: '🌙',
    },
  ];

  const handleSaveToAPI = async () => {
    setIsSaving(true);
    try {
      await updateSettingMutation.mutateAsync({
        key: 'theme_primary',
        value: colors.primary,
      });
      await updateSettingMutation.mutateAsync({
        key: 'theme_primary_second',
        value: colors.primarySecond,
      });
      await updateSettingMutation.mutateAsync({
        key: 'theme_primary_light',
        value: colors.primaryLight,
      });
      await updateSettingMutation.mutateAsync({
        key: 'theme_primary_dark',
        value: colors.primaryDark,
      });

      await updateSettingMutation.mutateAsync({
        key: 'theme_font_heading',
        value: fonts.heading,
      });
      await updateSettingMutation.mutateAsync({
        key: 'theme_font_body',
        value: fonts.body,
      });

      toast({
        title: 'Success',
        description: 'Theme saved successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save theme',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Preview */}
      <Card className="border shadow-xl bg-gradient-to-br from-[var(--primary-light-hex)]/10 to-transparent border-[var(--primary-hex)]/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[var(--primary-hex)] flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            Live Preview
          </CardTitle>
          <CardDescription>
            See how your color scheme looks across different components
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              className="h-12 px-6 rounded-lg font-semibold shadow-lg hover:shadow-glow transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primarySecond})`,
                color: 'black',
              }}
            >
              Primary Button
            </button>
            <button
              className="h-12 px-6 rounded-lg font-semibold border-2 hover:shadow-md transition-all duration-300"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
              }}
            >
              Outline Button
            </button>
            <Badge
              className="h-8 px-4 text-sm font-semibold shadow-md"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primarySecond})`,
                color: 'black',
              }}
            >
              <Check className="h-3 w-3 mr-1" />
              Active Badge
            </Badge>
          </div>

          {/* Typography Preview */}
          <div className="p-6 bg-gradient-to-br from-[var(--primary-light-hex)]/10 to-transparent border border-[var(--primary-hex)]/20 rounded-xl">
            <h1 style={{ fontFamily: fonts.heading }} className="text-3xl font-bold mb-2">
              Heading Preview
            </h1>
            <p style={{ fontFamily: fonts.body }} className="text-base text-muted-foreground">
              Body text preview with current font selection
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Color Customization Card */}
      <Card className="border-0 shadow-xl hover:shadow-[0_25px_50px_-12px_color-mix(in_srgb,var(--primary-hex)_30%,transparent)] transition-all duration-500">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--primary-hex)] to-[var(--primary-second-hex)] flex items-center justify-center shadow-lg">
              <Palette className="h-6 w-6 text-black" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[var(--primary-hex)] to-[var(--primary-second-hex)] bg-clip-text text-transparent">
                Color Customization
              </CardTitle>
              <CardDescription className="text-lg text-[var(--primary-hex)]/70">
                Customize your platform's color scheme
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Color Pickers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {colorKeys.map(({ key, label, description, icon }) => (
              <Card
                key={key}
                className="bg-gradient-to-br from-[var(--primary-light-hex)]/10 to-transparent border border-[var(--primary-hex)]/20 hover:border-[var(--primary-hex)]/40 transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{icon}</div>
                      <div>
                        <Label className="text-lg font-bold text-foreground">{label}</Label>
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                      </div>
                    </div>
                    <Popover
                      open={showPickers[key]}
                      onOpenChange={(open) => setShowPickers((prev) => ({ ...prev, [key]: open }))}
                    >
                      <PopoverTrigger asChild>
                        <button
                          className="h-12 w-12 rounded-xl border-2 border-[var(--primary-hex)]/30 shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer relative group"
                          style={{ backgroundColor: colors[key] }}
                        >
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                            <Palette className="h-5 w-5 text-white" />
                          </div>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-0 shadow-2xl">
                        <ChromePicker
                          color={colors[key]}
                          onChange={(color) => updateColor(key, color.hex)}
                          disableAlpha
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`input-${key}`} className="text-sm font-semibold">
                      Hex Code
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`input-${key}`}
                        value={colors[key]}
                        onChange={(e) => updateColor(key, e.target.value)}
                        className="font-mono uppercase ring-2 ring-[var(--primary-hex)]/20 focus:ring-[var(--primary-hex)] h-10"
                        maxLength={7}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 flex-shrink-0"
                        onClick={() =>
                          setShowPickers((prev) => ({
                            ...prev,
                            [key]: !prev[key],
                          }))
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Color Preview Bar */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Preview</Label>
                    <div
                      className="h-3 rounded-full shadow-inner"
                      style={{
                        background: `linear-gradient(90deg, ${colors[key]} 0%, ${colors[key]}dd 100%)`,
                      }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Font Selection Card */}
      <Card className="border-0 shadow-xl hover:shadow-[0_25px_50px_-12px_color-mix(in_srgb,var(--primary-hex)_30%,transparent)] transition-all duration-500">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--primary-hex)] to-[var(--primary-second-hex)] flex items-center justify-center shadow-lg">
              <Type className="h-6 w-6 text-black" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[var(--primary-hex)] to-[var(--primary-second-hex)] bg-clip-text text-transparent">
                Typography Settings
              </CardTitle>
              <CardDescription className="text-lg text-[var(--primary-hex)]/70">
                Choose fonts for headings and body text
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Heading Font */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Heading Font</Label>
              <Select value={fonts.heading} onValueChange={(value) => updateFont('heading', value)}>
                <SelectTrigger className="h-12 ring-2 ring-[var(--primary-hex)]/20 focus:ring-[var(--primary-hex)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableFonts.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: font.value }}>{font.label}</span>
                        <Badge
                          variant="outline"
                          className="text-xs bg-[var(--primary-light-hex)]/20"
                        >
                          {font.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="p-6 bg-gradient-to-br from-[var(--primary-light-hex)]/10 to-transparent border border-[var(--primary-hex)]/20 rounded-xl">
                <h1 style={{ fontFamily: fonts.heading }} className="text-3xl font-bold mb-2">
                  Sample Heading
                </h1>
                <h2 style={{ fontFamily: fonts.heading }} className="text-2xl font-semibold mb-2">
                  Subheading Example
                </h2>
                <h3 style={{ fontFamily: fonts.heading }} className="text-xl font-medium">
                  Smaller Heading
                </h3>
              </div>
            </div>

            {/* Body Font */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Body Font</Label>
              <Select value={fonts.body} onValueChange={(value) => updateFont('body', value)}>
                <SelectTrigger className="h-12 ring-2 ring-[var(--primary-hex)]/20 focus:ring-[var(--primary-hex)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableFonts.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: font.value }}>{font.label}</span>
                        <Badge
                          variant="outline"
                          className="text-xs bg-[var(--primary-light-hex)]/20"
                        >
                          {font.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="p-6 bg-gradient-to-br from-[var(--primary-light-hex)]/10 to-transparent border border-[var(--primary-hex)]/20 rounded-xl">
                <p style={{ fontFamily: fonts.body }} className="text-base mb-3 leading-relaxed">
                  This is a sample paragraph text. The quick brown fox jumps over the lazy dog.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <p style={{ fontFamily: fonts.body }} className="text-sm text-muted-foreground">
                  Smaller text example for captions and descriptions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleSaveToAPI}
          disabled={isSaving}
          className="gap-2 h-12 px-6 bg-gradient-to-r from-[var(--primary-hex)] to-[var(--primary-second-hex)] hover:from-[var(--primary-dark-hex)] hover:to-[var(--primary-hex)] shadow-lg hover:shadow-glow transition-all duration-300"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Theme (Colors + Fonts)
            </>
          )}
        </Button>

        <Button
          onClick={handleLoadFromAPI}
          disabled={isLoading}
          variant="outline"
          className="gap-2 h-12 px-6 border-[var(--primary-hex)] text-[var(--primary-hex)] hover:bg-[var(--primary-hex)] hover:text-black transition-all duration-300"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              Load from Server
            </>
          )}
        </Button>

        <Button
          onClick={handleReset}
          variant="outline"
          className="gap-2 h-12 px-6 hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
        >
          <RefreshCw className="h-5 w-5" />
          Reset to Defaults
        </Button>
      </div>

      {/* Info Card */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 via-blue-100/50 to-transparent dark:from-blue-950/30 dark:via-blue-900/20 dark:to-transparent shadow-xl border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold mb-2 text-blue-900 dark:text-blue-100">
                Theme Tips
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                <li>Changes apply instantly across the entire platform</li>
                <li>Save to server to persist colors and fonts together</li>
                <li>Use contrasting colors for better accessibility</li>
                <li>Test font combinations in both light and dark modes</li>
                <li>Google Fonts load automatically when selected</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
