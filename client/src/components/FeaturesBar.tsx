import {
    Signpost,
    Zap,
    Tag,
    Headphones
} from "lucide-react";

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
            title: "Plans from 500 MB to Unlimited Data",
        },
        {
            icon: Headphones,
            title: "1K+ Positive Reviews",
        },
    ];

    return (
        <div className="w-full bg-white mt-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4">
                {features.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={index}
                            className={`
                flex flex-col items-center justify-center text-center
                px-6 py-10 gap-3
                ${index !== 0 && index !== features.length - 1
                                    ? "md:border-x border-gray-200"
                                    : ""}
              `}
                        >
                            <Icon className="w-6 h-6 text-green-600" />
                            <p className="text-sm md:text-base font-medium text-gray-900 max-w-[180px]">
                                {item.title}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
