import React, { useState, useEffect, useMemo } from "react";
import { Save, Loader2, MessageSquare, ExternalLink, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useTranslation } from "@/contexts/TranslationContext";

export function LiveChatSettings() {
  const { toast } = useToast();
  const { t } = useTranslation();

  /* ---------------- STATE ---------------- */
  const [propertyId, setPropertyId] = useState("");
  const [widgetId, setWidgetId] = useState("");
  const [enabled, setEnabled] = useState(false);

  /* ---------------- FETCH SETTINGS ---------------- */
  const { data: settingsResponse } = useQuery({
    queryKey: ["/api/admin/settings"],
  });

  /* ---------------- ARRAY → OBJECT ---------------- */
  const settings = useMemo(() => {
    if (!settingsResponse) return {};

    return (settingsResponse as any[]).reduce(
      (acc: Record<string, string>, setting: any) => {
        acc[setting.key] = setting.value;
        return acc;
      },
      {}
    );
  }, [settingsResponse]);

  /* ---------------- LOAD INTO STATE ---------------- */
  useEffect(() => {
    if (settings) {
      setPropertyId(settings.tawk_property_id || "");
      setWidgetId(settings.tawk_widget_id || "");
      setEnabled(settings.tawk_enabled === "true");
    }
  }, [settings]);

  /* ---------------- MUTATION ---------------- */
  const updateSettingMutation = useMutation({
    mutationFn: async ({
      key,
      value,
      category,
    }: {
      key: string;
      value: string;
      category: string;
    }) => {
      return await apiRequest("PUT", `/api/admin/settings/${key}`, {
        value,
        category,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/settings"],
      });
      // Invalidate public settings query as well
      queryClient.invalidateQueries({
        queryKey: ["/api/public/settings"],
      });

      toast({
        title: "Success",
        description: "Live chat settings updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const saveSetting = async (key: string, value: string) => {
    await updateSettingMutation.mutateAsync({
      key,
      value,
      category: "general",
    });
  };

  /* ---------------- SAVE HANDLER ---------------- */
  const handleSave = async () => {
    try {
      await saveSetting("tawk_property_id", propertyId.trim());
      await saveSetting("tawk_widget_id", widgetId.trim());
      await saveSetting("tawk_enabled", String(enabled));
    } catch (e) {
      // toast is shown by mutation error handler
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      {/* Config Card */}
      <Card className="border-0 shadow-xl dark:bg-gray-900">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                Tawk.to Live Chat
              </CardTitle>
              <CardDescription>
                Integrate real-time customer support chat on your eSIM marketplace.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 dark:bg-gray-800/50">
            <div>
              <Label className="text-base font-medium">Enable Live Chat Widget</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Toggle the chat widget visibility on the customer-facing website.
              </p>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
              data-testid="switch-tawk-enabled"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property ID */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="tawk_property_id">Tawk.to Property ID</Label>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" title="The unique identifier for your website property in tawk.to dashboard." />
              </div>
              <Input
                id="tawk_property_id"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                placeholder="e.g. 64d9f78cc2f1ac6c21dc5c23"
                className="dark:bg-gray-950 dark:border-gray-800"
                data-testid="input-tawk-property-id"
              />
            </div>

            {/* Widget ID */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="tawk_widget_id">Tawk.to Widget ID</Label>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" title="The specific widget style/configuration ID (usually 'default')." />
              </div>
              <Input
                id="tawk_widget_id"
                value={widgetId}
                onChange={(e) => setWidgetId(e.target.value)}
                placeholder="e.g. 1h7o2g9ab or default"
                className="dark:bg-gray-950 dark:border-gray-800"
                data-testid="input-tawk-widget-id"
              />
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={updateSettingMutation.isPending}
            className="w-full sm:w-auto gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium"
            data-testid="button-save-tawk-settings"
          >
            {updateSettingMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Tawk.to Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Guide/Help Card */}
      <Card className="border border-green-500/20 bg-green-500/5 dark:bg-green-950/10">
        <CardContent className="pt-6 space-y-4">
          <h4 className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
            How to get your Tawk.to IDs?
          </h4>
          <ol className="text-sm space-y-2.5 text-muted-foreground list-decimal pl-4">
            <li>
              Sign up or log in to your dashboard at{" "}
              <a
                href="https://www.tawk.to/"
                target="_blank"
                rel="noreferrer"
                className="text-green-600 dark:text-green-400 underline inline-flex items-center gap-1"
              >
                tawk.to <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>Go to <strong>Administration (Gear Icon)</strong> &gt; <strong>Chat Widget</strong>.</li>
            <li>
              Look at the <strong>Direct Chat Link</strong> or the script snippet. The URL looks like:
              <br />
              <code className="text-xs bg-muted p-1 rounded block mt-1 break-all dark:bg-gray-800 font-mono text-foreground">
                https://embed.tawk.to/{"{"}PROPERTY_ID{"}"}/{"{"}WIDGET_ID{"}"}
              </code>
            </li>
            <li>Copy and paste those two values into the settings fields above.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
