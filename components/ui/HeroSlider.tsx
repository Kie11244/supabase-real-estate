import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Slide {
  readonly image: string;
  readonly eyebrow: string;
  readonly headline: string;
  readonly description: string;
  readonly ctaLabel: string;
  readonly ctaLink: string;
}

const SLIDES: Slide[] = [
  {
    image:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1920&q=80',
    eyebrow: 'Luxury Living',
    headline: 'ค้นพบบ้านในฝัน ที่สะท้อนตัวตนของคุณ',
    description:
      'สำรวจคอลเลกชันบ้านเดี่ยวและคอนโดระดับพรีเมียม ในทำเลศักยภาพทั่วกรุงเทพฯ พร้อมสิ่งอำนวยความสะดวกครบครัน.',
    ctaLabel: 'ดูรายการทรัพย์ทั้งหมด',
    ctaLink: '/properties',
  },
  {
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1920&q=80',
    eyebrow: 'Seamless Experience',
    headline: 'ลงทุนอย่างมั่นใจ ด้วยข้อมูลที่โปร่งใส',
    description:
      'ทีมงานมืออาชีพคัดสรรทรัพย์ที่มีศักยภาพในการเติบโต พร้อมข้อมูลการลงทุนที่ชัดเจน เพื่อการตัดสินใจที่ดีที่สุด.',
    ctaLabel: 'เริ่มต้นค้นหา',
    ctaLink: '/properties',
  },
  {
    image:
      'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1920&q=80',
    eyebrow: 'Resort Style',
    headline: 'พักผ่อนในบรรยากาศรีสอร์ตทุกวัน',
    description:
      'สัมผัสประสบการณ์การอยู่อาศัยที่ผ่อนคลาย ด้วยดีไซน์ร่วมสมัยและพื้นที่สีเขียวกว้างขวางสำหรับทุกคนในครอบครัว.',
    ctaLabel: 'ค้นหาโครงการที่ใช่',
    ctaLink: '/properties',
  },
];

const AUTO_PLAY_INTERVAL = 6000;

const HeroSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((previousIndex) => (previousIndex + 1) % SLIDES.length);
    }, AUTO_PLAY_INTERVAL);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeIndex, isPaused]);

  const handlePrevious = () => {
    setActiveIndex((previousIndex) =>
      previousIndex === 0 ? SLIDES.length - 1 : previousIndex - 1,
    );
  };

  const handleNext = () => {
    setActiveIndex((previousIndex) => (previousIndex + 1) % SLIDES.length);
  };

  return (
    <section
      className="relative isolate overflow-hidden bg-gray-900 text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="relative h-[70vh] min-h-[480px] w-full">
        <div className="absolute inset-0">
          {SLIDES.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={slide.image}
                className={`absolute inset-0 transform transition-all duration-[1200ms] ease-out ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
                aria-hidden={!isActive}
              >
                <img
                  src={slide.image}
                  alt={slide.headline}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
              </div>
            );
          })}
        </div>

        <div className="relative z-10 flex h-full items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80 sm:text-sm">
                {SLIDES[activeIndex].eyebrow}
              </span>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
                {SLIDES[activeIndex].headline}
              </h1>
              <p className="text-base text-white/80 sm:text-lg md:text-xl">
                {SLIDES[activeIndex].description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to={SLIDES[activeIndex].ctaLink}
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 sm:text-base"
                >
                  {SLIDES[activeIndex].ctaLabel}
                </Link>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-base"
                >
                  เลื่อนดูถัดไป
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="absolute inset-y-0 left-0 z-20 flex items-center px-4 sm:px-6">
          <button
            type="button"
            onClick={handlePrevious}
            className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="ดูสไลด์ก่อนหน้า"
          >
            <span className="sr-only">Previous slide</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 19.5-7.5-7.5 7.5-7.5" />
            </svg>
          </button>
        </div>

        <div className="absolute inset-y-0 right-0 z-20 flex items-center px-4 sm:px-6">
          <button
            type="button"
            onClick={handleNext}
            className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="ดูสไลด์ถัดไป"
          >
            <span className="sr-only">Next slide</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {SLIDES.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={slide.image}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  isActive
                    ? 'w-10 bg-white'
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`สไลด์หมายเลข ${index + 1}`}
                aria-current={isActive}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
