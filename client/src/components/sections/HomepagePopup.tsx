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
            <DialogContent className="max-w-[92vw] sm:max-w-[440px] p-0 overflow-hidden border-0 bg-transparent shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] focus:outline-none" aria-describedby={undefined}>
                <DialogHeader className="sr-only">
                    <DialogTitle>{t('website.home.popup.title', 'Promotion')}</DialogTitle>
                    <DialogDescription>{t('website.home.popup.description', 'Special offer popup')}</DialogDescription>
                </DialogHeader>
                <div className="relative bg-background rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col w-full border border-border/50">
                    
                    {/* Floating Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all z-30 shadow-lg border border-white/20 active:scale-95"
                        aria-label="Close"
                    >
                        <X className="h-4.5 w-4.5" />
                    </button>

                    {imageUrl && (
                        <div className="w-full relative flex-shrink-0 bg-muted">
                            {/* Gradient overlay to smoothly transition to content */}
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
                            <img 
                                src={imageUrl} 
                                alt="Promotion" 
                                className="w-full h-auto max-h-[45vh] sm:max-h-[50vh] object-cover" 
                                loading="eager"
                            />
                        </div>
                    )}

                    <div className="flex-1 relative z-10 bg-background px-5 sm:px-8 pb-7 pt-2">
                        {(!imageUrl) && <div className="pt-10" />} {/* Add padding top if no image */}

                        <div className="space-y-6 flex flex-col items-center">
                            {text && (
                                <div className="text-center space-y-2 w-full">
                                    <p className="text-lg sm:text-xl leading-snug font-bold text-foreground tracking-tight px-2">{text}</p>
                                </div>
                            )}
                            
                            {code && (
                                <div className="w-full bg-primary/5 rounded-2xl p-4 sm:p-5 border border-primary/20 relative overflow-hidden group shadow-inner">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                    <p className="text-[10px] sm:text-[11px] font-bold text-primary uppercase tracking-[0.15em] text-center mb-3 opacity-90">{t('website.home.popup.promoLabel', 'Your Exclusive Promo Code')}</p>
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-background rounded-xl p-2.5 border border-border/60 shadow-sm">
                                        <code className="text-xl sm:text-2xl font-black text-foreground px-4 tracking-widest select-all py-1">
                                            {code}
                                        </code>
                                        <Button
                                            variant={copied ? "default" : "secondary"}
                                            size="default"
                                            onClick={copyCode}
                                            className="w-full sm:w-28 shrink-0 transition-all duration-300 font-bold shadow-sm h-11 sm:h-10"
                                        >
                                            {copied ? (
                                                <div className="flex items-center text-primary-foreground"><Check className="h-4 w-4 mr-2 stroke-[3px]" />{t('website.home.popup.copied', 'Copied')}</div>
                                            ) : (
                                                <div className="flex items-center"><Copy className="h-4 w-4 mr-2" />{t('website.home.popup.copy', 'Copy')}</div>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-center pt-2 w-full border-t border-border/40 mt-2">
                                <label className="flex items-center gap-3 pt-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors group select-none">
                                    <Checkbox
                                        id="dontShow"
                                        checked={dontShowToday}
                                        onCheckedChange={(checked) => setDontShowToday(checked as boolean)}
                                        className="h-5 w-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all shadow-sm"
                                    />
                                    <span className="font-semibold text-sm tracking-tight">{t('website.home.popup.dontShowAgain', "Don't show this again today")}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
