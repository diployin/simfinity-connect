import { Coins, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrency } from "@/contexts/CurrencyContext";

export function CurrencySelector({ isDarkBackground = false }: { isDarkBackground?: boolean }) {
  const { currency, setCurrency, currencies, isLoading } = useCurrency();

  if (isLoading || currencies.length === 0) {
    return null;
  }

  const enabledCurrencies = currencies.filter((c) => c.isEnabled);
  const currentCurrency =
    enabledCurrencies.find((c) => c.code === currency) || enabledCurrencies[0];

  if (!currentCurrency) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "hidden md:flex items-center gap-1.5 rounded-full px-3 transition-all",
            isDarkBackground
              ? "text-white border-white/30 hover:bg-white/10"
              : "border-border/50 text-black dark:text-gray-300 hover:bg-gray-100"
          )}
          data-testid="button-currency-selector"
        >
          <span className="text-base font-semibold">{currentCurrency.symbol}</span>
          <span className="text-sm font-medium">{currentCurrency.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Select Currency
        </div>
        {enabledCurrencies.map((curr) => (
          <DropdownMenuItem
            key={curr.id}
            onClick={() => setCurrency(curr.code)}
            className="flex items-center justify-between cursor-pointer"
            data-testid={`option-currency-${curr.code}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold w-6 text-center">{curr.symbol}</span>
              <div>
                <div className="font-medium">{curr.code}</div>
                <div className="text-xs text-muted-foreground">{curr.name}</div>
              </div>
            </div>
            {currency === curr.code && (
              <Check className="h-4 w-4 text-teal-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
