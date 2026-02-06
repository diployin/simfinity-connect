import React from 'react';

const steps = [
  {
    id: 1,
    title: 'Find your referral code',
    text: 'Open the Simfinity app and tap on “Credits” to find your code.',
  },
  {
    id: 2,
    title: 'Share it with your friends',
    text: 'Tap on the “Share” button and send your code to a friend. Or two.',
  },
  {
    id: 3,
    title: 'Give US$5, get US$5',
    text: 'Anyone using your referral code will get a US$5 discount, while you’ll get US$5 as Simfinity credit.',
  },
];

const faqs = [
  'Does Simfinity have a referral program?',
  'How can I use Simfinity for free?',
  'Can I get a Simfinity discount for referring a friend?',
  'How does Simfinity’s Refer a Friend program work?',
];

const ReferralPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 py-16 px-4 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Refer a friend, and <br />
            you’ll both get US$5!
          </h1>
          <p className="mt-4 text-gray-600">
            Each referral earns you US$5 in Simfinity credits while your pals get a US$5 discount on
            their first plan. Use your credits to get data for less — or even free! With Simfinity,
            sharing pays off — literally.
          </p>

          <div className="flex gap-4 mt-6">
            <img src="/images/stores/AppStore_new.png" className="h-12" alt="App Store" />
            <img src="/images/stores/PlayStore.png" className="h-12" alt="Google Play" />
          </div>

          <p className="mt-3 text-sm text-gray-500">⭐ 4.7 (97,400+ reviews)</p>
        </div>

        <div className="bg-[#5cb3e8] rounded-3xl p-6 flex justify-center">
          <img src="/images/security1.jpeg" alt="Refer friends" className="max-w-md w-full" />
        </div>
      </section>

      {/* WHY Simfinity SECTION */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 py-16 px-4 items-center">
        <div className="bg-[#5cb3e8] rounded-3xl p-6 flex justify-center">
          <img src="/images/security2.jpeg" alt="Why Simfinity" className="max-w-md w-full" />
        </div>

        <div>
          <h2 className="text-3xl font-bold">Why Simfinity?</h2>
          <p className="mt-4 text-gray-600">
            Simfinity is a global eSIM service from Nord Security, one of the most trusted companies
            in the world. A user-friendly app, innovative features, and affordable eSIM prices in
            200+ destinations — everything the modern traveler enjoys.
          </p>
          <p className="mt-4 text-gray-600">
            Now you and your friends can earn Simfinity credits — simply join our referral program.
            It’s easy!
          </p>
        </div>
      </section>

      {/* STEPS SECTION */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center">
            Refer a friend and earn Simfinity credit
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {steps.map((s) => (
              <div key={s.id} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                  {s.id}
                </div>
                <h3 className="mt-4 font-semibold text-lg">{s.title}</h3>
                <p className="mt-2 text-gray-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOWNLOAD + QR SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-primary rounded-3xl grid md:grid-cols-2 items-center p-8 gap-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Download the Simfinity app</h2>

            <div className="flex gap-4 mt-4">
              <img src="/images/stores/AppStore_new.png" className="h-12" alt="App Store" />
              <img src="/images/stores/PlayStore.png" className="h-12" alt="Google Play" />
            </div>

            <p className="mt-4 text-gray-700 text-white">
              Or scan the code with your phone to download the Simfinity app.
            </p>
          </div>

          <div className="flex justify-center">
            <img src="/images/qr.png" className="w-40" alt="QR Code" />
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center">Frequently asked questions</h2>

        <div className="mt-8 space-y-3">
          {faqs.map((q, i) => (
            <details key={i} className="border rounded-lg p-4 cursor-pointer">
              <summary className="font-medium">{q}</summary>
              <p className="mt-2 text-gray-600">Answer for: {q}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ReferralPage;
