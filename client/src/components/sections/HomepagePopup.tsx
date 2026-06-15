import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useSettingByKey } from '@/hooks/useSettings';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';

export function HomepagePopup() {
    const [open, setOpen] = useState(false);
    const [dontShowToday, setDontShowToday] = useState(false);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();
    const { t } = useTranslation();

    const enabledStr = useSettingByKey('homepage_popup_enabled');
    const imageUrl = useSettingByKey('homepage_popup_image');
    const code = useSettingByKey('homepage_popup_code');
    const text = useSettingByKey('homepage_popup_text');

    useEffect(() => {
        if (enabledStr === 'true') {
            const today = new Date().toDateString();
            const hideDate = localStorage.getItem('hide_homepage_popup_date');
            if (hideDate !== today) {
                // Show popup after a short delay
                const timer = setTimeout(() => setOpen(true), 1500);
                return () => clearTimeout(timer);
            }
        } else {
            setOpen(false);
        }
    }, [enabledStr, imageUrl, code, text]);

    const handleClose = () => {
        if (dontShowToday) {
            localStorage.setItem('hide_homepage_popup_date', new Date().toDateString());
        }
        setOpen(false);
    };

    const copyCode = () => {
        if (code) {
            navigator.clipboard.writeText(code);
            setCopied(true);
            toast({ title: 'Code copied!' });
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) handleClose();
        }}>
            <DialogContent
                className="w-[calc(100%-32px)] sm:w-auto sm:max-w-[440px] p-0 overflow-hidden border-0 bg-transparent shadow-2xl focus:outline-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0"
                aria-describedby={undefined}
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>{t('website.home.popup.title', 'Promotion')}</DialogTitle>
                    <DialogDescription>{t('website.home.popup.description', 'Special offer popup')}</DialogDescription>
                </DialogHeader>

                <div className="relative bg-background rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col w-full border border-border/50 max-h-[85vh] sm:max-h-[90vh] shadow-xl">
                    {/* Floating Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 z-30 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-all duration-200 shadow-lg border border-white/30 hover:scale-105 active:scale-95"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {imageUrl && (
                        <div className="relative flex-shrink-0 bg-gradient-to-b from-muted to-background">
                            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
                            <img
                                src={imageUrl}
                                alt="Promotion"
                                className="w-full h-auto max-h-[200px] sm:max-h-[240px] object-cover object-center"
                                loading="eager"
                            />
                        </div>
                    )}

                    <div className="flex-1 relative z-10 bg-background px-5 sm:px-7 pb-6 sm:pb-7 pt-4 overflow-y-auto">
                        {!imageUrl && <div className="pt-2" />}

                        <div className="space-y-5 sm:space-y-6">
                            {text && (
                                <div className="text-center">
                                    <p className="text-base sm:text-lg font-bold text-foreground leading-relaxed">
                                        {text}
                                    </p>
                                </div>
                            )}

                            {code && (
                                <div className="bg-gradient-to-br from-primary/5 to-primary/8 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-primary/20 shadow-sm">
                                    <p className="text-[10px] sm:text-[11px] font-bold text-primary uppercase tracking-wider text-center mb-3">
                                        {t('website.home.popup.promoLabel', 'Your Exclusive Promo Code')}
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-center gap-3">
                                        <code className="flex-1 text-center sm:text-left text-xl sm:text-2xl font-bold text-foreground bg-secondary/30 rounded-lg px-4 py-2 sm:py-2.5 tracking-wider border border-border/50 break-all w-full">
                                            {code}
                                        </code>
                                        <Button
                                            variant={copied ? "default" : "outline"}
                                            size="default"
                                            onClick={copyCode}
                                            className="w-full sm:w-auto min-w-[100px] transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                                        >
                                            {copied ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Check className="h-4 w-4" />
                                                    {t('website.home.popup.copied', 'Copied')}
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Copy className="h-4 w-4" />
                                                    {t('website.home.popup.copy', 'Copy Code')}
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-center pt-2 sm:pt-3 border-t border-border/40">
                                <label className="flex items-center gap-2 sm:gap-2.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors group py-2 px-3 rounded-lg hover:bg-secondary/30">
                                    <Checkbox
                                        id="dontShow"
                                        checked={dontShowToday}
                                        onCheckedChange={(checked) => setDontShowToday(checked as boolean)}
                                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all" // Removed flex-shrink-0
                                    />
                                    <span className="text-[11px] sm:text-xs font-medium select-none">
                                        {t('website.home.popup.dontShowAgain', "Don't show this again today")}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}