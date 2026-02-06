import React from 'react';

const features = [
    {
        tag: 'Virtual location',
        title: 'Changing your location is effortless',
        description:
            'The Simfinity eSIM app lets you change your virtual location in a matter of seconds. While using this feature, you can:',
        bullets: [
            'Choose from 115+ virtual locations.',
            'Browse more privately.',
            'Access your home content without borders.',
        ],
        img: '/images/security2.jpg',
        reverse: false,
    },
    {
        tag: 'Ad blocker',
        title: 'More blocked ads, more relaxed browsing',
        description:
            'Turning on the ad blocker in the Simfinity app takes just a single click. Make those annoying advertisements disappear and enjoy the benefits:',
        bullets: ['Browse without distractions.', 'Save mobile data.', 'Increase browsing speed.'],
        img: '/images/security3.jpg',
        reverse: true,
    },
    {
        tag: 'Web protection',
        title: 'Don’t let online threats ruin your trip',
        description:
            'An eSIM that guards you against internet dangers? Yes, please. The Simfinity Web protection feature allows you to:',
        bullets: ['Block malicious sites.', 'Limit online trackers.', 'Browse faster.'],
        img: '/images/security4.jpg',
        reverse: false,
    },
];

const SecurityPage: React.FC = () => {
    return (
        <div className="bg-white">
            {/* HERO SECTION */}
            <section className="bg-[#78a1d8] py-20">
                <div className="max-w-6xl mx-auto text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
                        Safe travels with the <br />
                        Simfinity security features
                    </h1>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        Stay connected wherever you go and protect your browsing.
                    </p>

                    <div className="mt-10 flex justify-center">
                        <img
                            src="/images/security1.png"
                            alt="Security features"
                            // className="max-w-md w-full h-80"
                            className="max-w-md w-full h-80 object-contain"
                        />
                    </div>
                </div>
            </section>

            {/* INTRO TEXT */}
            <section className="max-w-6xl mx-auto py-16 px-4 grid md:grid-cols-2 gap-10">
                <h2 className="text-3xl font-bold">
                    Better eSIM security — stay safer across your travels
                </h2>
                <p className="text-gray-600">
                    You don’t want to run out of data because some websites use too many trackers and ads. You
                    also shouldn’t have to worry about malicious websites instead of enjoying your time
                    abroad. Enable “Ad blocker” and “Web protection” in your eSIM settings and increase your
                    privacy when traveling.
                </p>
            </section>

            {/* FEATURE SECTIONS */}
            <section className="space-y-24 max-w-6xl mx-auto px-4 pb-20">
                {features.map((f, i) => (
                    <div
                        key={i}
                        className={`grid md:grid-cols-2 gap-12 items-center ${f.reverse ? 'md:flex-row-reverse' : ''
                            }`}
                    >
                        {/* Image */}
                        <div className="bg-gray-100 rounded-2xl p-6 flex justify-center">
                            <img src={f.img} alt={f.title} className="max-w-md w-full rounded-xl" />
                        </div>

                        {/* Content */}
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <span>•</span> {f.tag}
                            </div>

                            <h3 className="text-3xl font-bold">{f.title}</h3>

                            <p className="mt-4 text-gray-600">{f.description}</p>

                            <ul className="mt-4 space-y-2">
                                {f.bullets.map((b, j) => (
                                    <li key={j} className="flex items-start gap-2 text-gray-700">
                                        <span className="text-[#2c7338]">✔</span> {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </section>

            {/* BOTTOM SECTION (PLACEHOLDER) */}
            <section className="text-center py-12">
                <h3 className="text-2xl font-semibold">Stay connected wherever you go</h3>
            </section>
        </div>
    );
};

export default SecurityPage;
