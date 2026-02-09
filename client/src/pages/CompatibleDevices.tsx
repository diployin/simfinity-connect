import { Link } from 'wouter';
import { Globe, Smartphone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTranslation } from '@/contexts/TranslationContext';
// import { useTranslation } from '@/contexts/TranslationContext';

export default function CompatibleDevices() {
  const { t } = useTranslation();
  const devices = [
    {
      brand: 'Apple',
      models: [
        'iPhone 15 Pro Max',
        'iPhone 15 Pro',
        'iPhone 15 Plus',
        'iPhone 15',
        'iPhone 14 Pro Max',
        'iPhone 14 Pro',
        'iPhone 14 Plus',
        'iPhone 14',
        'iPhone 13 Pro Max',
        'iPhone 13 Pro',
        'iPhone 13',
        'iPhone 13 mini',
        'iPhone 12 Pro Max',
        'iPhone 12 Pro',
        'iPhone 12',
        'iPhone 12 mini',
        'iPhone 11 Pro Max',
        'iPhone 11 Pro',
        'iPhone 11',
        'iPhone XS Max',
        'iPhone XS',
        'iPhone XR',
        'iPad Pro 12.9" (3rd gen+)',
        'iPad Pro 11" (all models)',
        'iPad Air (3rd gen+)',
        'iPad (7th gen+)',
        'iPad mini (5th gen+)',
      ],
    },
    {
      brand: 'Samsung',
      models: [
        'Galaxy S24 Ultra',
        'Galaxy S24+',
        'Galaxy S24',
        'Galaxy S23 Ultra',
        'Galaxy S23+',
        'Galaxy S23',
        'Galaxy S23 FE',
        'Galaxy S22 Ultra',
        'Galaxy S22+',
        'Galaxy S22',
        'Galaxy S21 Ultra 5G',
        'Galaxy S21+ 5G',
        'Galaxy S21 5G',
        'Galaxy S21 FE 5G',
        'Galaxy S20 Ultra 5G',
        'Galaxy S20+ 5G',
        'Galaxy S20 5G',
        'Galaxy Z Fold5',
        'Galaxy Z Fold4',
        'Galaxy Z Fold3 5G',
        'Galaxy Z Flip5',
        'Galaxy Z Flip4',
        'Galaxy Z Flip3 5G',
        'Galaxy Note 20 Ultra 5G',
        'Galaxy Note 20 5G',
      ],
    },
    {
      brand: 'Google',
      models: [
        'Pixel 8 Pro',
        'Pixel 8',
        'Pixel 7 Pro',
        'Pixel 7',
        'Pixel 7a',
        'Pixel 6 Pro',
        'Pixel 6',
        'Pixel 6a',
        'Pixel 5',
        'Pixel 4a (5G)',
        'Pixel 4',
      ],
    },
    {
      brand: 'Other',
      models: [
        'Motorola Razr 5G',
        'Motorola Edge+',
        'Oppo Find X3 Pro',
        'Oppo Find X5',
        'Oppo Reno 5A',
        'Sony Xperia 1 IV',
        'Sony Xperia 5 IV',
        'Huawei P40 Pro',
        'Huawei Mate 40 Pro',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}

      <div className="container mx-auto px-4 mt-24 md:mt-0">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Smartphone className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">{t('website.compatibleDevices.title')}</h1>
            <p className="text-lg text-muted-foreground">
              {t('website.compatibleDevices.description')}
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('website.compatibleDevices.howToCheck')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h3 className="font-medium mb-1">{t('website.compatibleDevices.iphoneUsers')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('website.compatibleDevices.iphoneInstructions')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h3 className="font-medium mb-1">
                    {t('website.compatibleDevices.androidUsers')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('website.compatibleDevices.androidInstructions')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {devices.map((category) => (
              <Card key={category.brand}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    {category.brand}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.models.map((model) => (
                      <div key={model} className="text-sm p-2 rounded-md bg-muted/50">
                        {model}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-center">
                {t(
                  'website.compatibleDevices.notListed',
                  "Don't see your device? Contact our support team to verify eSIM compatibility.",
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
