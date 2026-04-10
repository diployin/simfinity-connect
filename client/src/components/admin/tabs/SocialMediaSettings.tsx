import React, { useState, useEffect, useMemo } from "react";
import {
  Save,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Loader2,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "@/contexts/TranslationContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FaAndroid, FaAppStoreIos } from "react-icons/fa";

export function SocialMediaSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();

  // Local state
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [youtube, setYoutube] = useState("");
  const [android, setAndroid] = useState("");
  const [ios, setIos] = useState("");

  const [facebookActive, setFacebookActive] = useState(true);
  const [instagramActive, setInstagramActive] = useState(true);
  const [twitterActive, setTwitterActive] = useState(true);
  const [linkedinActive, setLinkedinActive] = useState(true);
  const [youtubeActive, setYoutubeActive] = useState(true);
  const [androidActive, setAndroidActive] = useState(true);
  const [iosActive, setIosActive] = useState(true);

  // Fetch settings
  const { data: settingsResponse } = useQuery({
    queryKey: ["/api/admin/settings"],
  });

  // Convert array → object
  const settings = useMemo(() => {
    if (!settingsResponse) return {};
    return settingsResponse.reduce(
      (acc: Record<string, string>, s: any) => {
        acc[s.key] = s.value;
        return acc;
      },
      {}
    );
  }, [settingsResponse]);

  // Load values
  useEffect(() => {
    if (!settings) return;

    setWebsite(settings.website_url || "");
    setFacebook(settings.social_facebook || "");
    setInstagram(settings.social_instagram || "");
    setTwitter(settings.social_twitter || "");
    setLinkedin(settings.social_linkedin || "");
    setYoutube(settings.social_youtube || "");
    setAndroid(settings.social_android || "");
    setIos(settings.social_ios || "");

    setFacebookActive(settings.social_facebook_active !== "false");
    setInstagramActive(settings.social_instagram_active !== "false");
    setTwitterActive(settings.social_twitter_active !== "false");
    setLinkedinActive(settings.social_linkedin_active !== "false");
    setYoutubeActive(settings.social_youtube_active !== "false");
    setAndroidActive(settings.social_android_active !== "false");
    setIosActive(settings.social_ios_active !== "false");
  }, [settings]);

  // Mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({
      key,
      value,
      category,
    }: {
      key: string;
      value: string;
      category: string;
    }) =>
      apiRequest("PUT", `/api/admin/settings/${key}`, {
        value,
        category,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: t("admin.settings.success", "Success"),
        description: t(
          "admin.settings.settingsUpdatedSuccess",
          "Settings updated successfully"
        ),
      });
    },
    onError: (err: any) => {
      toast({
        title: t("admin.settings.error", "Error"),
        description:
          err.message ||
          t(
            "admin.settings.failedToUpdateSettings",
            "Failed to update settings"
          ),
        variant: "destructive",
      });
    },
  });

  const save = async (key: string, value: string) =>
    updateSettingMutation.mutateAsync({
      key,
      value,
      category: "social",
    });

  const handleSave = async () => {
    await save("website_url", website);
    await save("social_facebook", facebook);
    await save("social_facebook_active", String(facebookActive));
    await save("social_instagram", instagram);
    await save("social_instagram_active", String(instagramActive));
    await save("social_twitter", twitter);
    await save("social_twitter_active", String(twitterActive));
    await save("social_linkedin", linkedin);
    await save("social_linkedin_active", String(linkedinActive));
    await save("social_youtube", youtube);
    await save("social_youtube_active", String(youtubeActive));
    await save("social_android", android);
    await save("social_android_active", String(androidActive));
    await save("social_ios", ios);
    await save("social_ios_active", String(iosActive));
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--primary-hex)] to-[var(--primary-second-hex)] flex items-center justify-center shadow-lg">
              <Globe className="h-6 w-6 text-black" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[var(--primary-hex)] to-[var(--primary-second-hex)] bg-clip-text text-transparent">
                {t("admin.settings.social.title", "Social Media Links")}
              </CardTitle>
              <CardDescription className="text-lg text-[var(--primary-hex)]/70">
                {t(
                  "admin.settings.social.description",
                  "Manage website and social media profile links"
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Website */}
          <Field
            icon={<Globe />}
            label="Website URL"
            value={website}
            onChange={setWebsite}
            placeholder="https://yourdomain.com"
          />

          <Field
            icon={<Facebook />}
            label="Facebook"
            value={facebook}
            onChange={setFacebook}
            active={facebookActive}
            onActiveChange={setFacebookActive}
            placeholder="https://facebook.com/yourpage"
          />

          <Field
            icon={<Instagram />}
            label="Instagram"
            value={instagram}
            onChange={setInstagram}
            active={instagramActive}
            onActiveChange={setInstagramActive}
            placeholder="https://instagram.com/yourprofile"
          />

          <Field
            icon={<Twitter />}
            label="Twitter / X"
            value={twitter}
            onChange={setTwitter}
            active={twitterActive}
            onActiveChange={setTwitterActive}
            placeholder="https://x.com/yourprofile"
          />

          <Field
            icon={<Linkedin />}
            label="LinkedIn"
            value={linkedin}
            onChange={setLinkedin}
            active={linkedinActive}
            onActiveChange={setLinkedinActive}
            placeholder="https://linkedin.com/company/yourcompany"
          />

          <Field
            icon={<Youtube />}
            label="YouTube"
            value={youtube}
            onChange={setYoutube}
            active={youtubeActive}
            onActiveChange={setYoutubeActive}
            placeholder="https://youtube.com/@yourchannel"
          />

          <Field
            icon={<FaAndroid />}
            label="Android"
            value={android}
            onChange={setAndroid}
            active={androidActive}
            onActiveChange={setAndroidActive}
            placeholder="https://play.google.com/store/apps/details?id=com.yourapp"
          />

          <Field
            icon={<FaAppStoreIos />}
            label="IOS"
            value={ios}
            onChange={setIos}
            active={iosActive}
            onActiveChange={setIosActive}
            placeholder="https://apps.apple.com/app/yourapp"
          />

          <Button
            onClick={handleSave}
            disabled={updateSettingMutation.isPending}
            className="gap-2 h-12 px-8 text-lg bg-gradient-to-r from-[var(--primary-hex)] to-[var(--primary-second-hex)] shadow-lg"
          >
            {updateSettingMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Social Links
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 to-transparent shadow-md">
        <CardContent className="pt-6 flex gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <p className="text-sm text-blue-800">
            These links may be shown in the footer, contact page, or mobile app.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Reusable Field ---------- */

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  active,
  onActiveChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  active?: boolean;
  onActiveChange?: (v: boolean) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold flex items-center gap-2">
          <span className="text-[var(--primary-hex)]">{icon}</span>
          {label}
        </Label>
        {onActiveChange !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {active ? "Active" : "Inactive"}
            </span>
            <Switch
              checked={active}
              onCheckedChange={onActiveChange}
              className="data-[state=checked]:bg-[var(--primary-hex)]"
            />
          </div>
        )}
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 ring-2 ring-[var(--primary-hex)]/20 focus:ring-[var(--primary-hex)]"
      />
    </div>
  );
}

