export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">প্রকল্প সম্পর্কে</h1>
        <p className="text-lg leading-8">
          এই প্রকল্পে pH, তাপমাত্রা, TDS এবং ঘোলাভাব সেন্সর ব্যবহার করে
          পানির মান পরিমাপ করা হয়। ডেটা ThingSpeak-এ পাঠানো হয় এবং
          এই ওয়েব অ্যাপ সাধারণ ব্যবহারকারীর জন্য সহজ বাংলায় পরামর্শ দেয়।
        </p>
      </div>
    </main>
  );
}