import {
    Signpost,
    Zap,
    Tag,
    Headphones
} from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import * as React from "react";

export default function FeaturesBar() {
    const features = [
        {
            icon: Signpost,
            title: "50K eSIM Users Worldwide",
        },
        {
            icon: Zap,
            title: "Coverage in 200+ Destinations",
        },
        {
            icon: Tag,
            title: "Plans from 500 MB to Unlimited",
        },
        {
            icon: Headphones,
            title: "1K+ Positive Reviews",
        },
    ];

    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: false })
    );

    return (
        <div className="w-full bg-primary/[0.03] dark:bg-primary/[0.02] mt-8 py-4 shadow-sm backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4">
                <Carousel
                    plugins={[plugin.current]}
                    className="w-full"
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {features.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <CarouselItem key={index} className="pl-2 md:pl-4 basis-full xs:basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                                    <div className="flex items-center justify-center gap-4 px-4 py-2 rounded-xl transition-colors hover:bg-primary/[0.05]">
                                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20 shadow-sm">
                                            <Icon className="w-4.5 h-4.5 text-primary" />
                                        </div>
                                        <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap tracking-tight">
                                            {item.title}
                                        </p>
                                    </div>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    );
}
