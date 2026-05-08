import Link from 'next/link';
import Image from 'next/image';

const steps = [
  {
    label: 'Live',
    icon: '/asset/Live.png',
    href: '/WatchLive'
  },
  {
    label: 'Videos',
    icon: '/asset/Video.png',
    href: '/Videos'
  },
  {
    label: 'Audios',
    icon: '/asset/Headphone.png',
    href: '/Audios'
  },
  {
    label: 'Gallery',
    icon: '/asset/Image.png',
    href: '/Gallery'
  }
];

export default function Flow() {
  return (
    <div className="w-full flex justify-center pt-10 pb-6 bg-transparent">
      <div className="w-full max-w-6xl px-4 flex flex-col md:flex-row gap-4">
        {steps.map((step, index) => (
          <div key={index} className="w-full md:flex-1">
            <div className="rounded-full bg-gradient-to-r from-[#ff7a4b] via-[#ff4b5c] to-[#7b5cff] p-[1.5px]">
              <Link
                href={step.href}
                className="flex items-center justify-between rounded-full bg-white px-5 py-3 md:px-7 md:py-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={step.icon}
                    alt={step.label}
                    width={32}
                    height={32}
                  />
                  <span className="font-semibold text-gray-900 text-sm md:text-base whitespace-nowrap">
                    {step.label}
                  </span>
                </div>
                <span className="text-gray-400 text-lg">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
