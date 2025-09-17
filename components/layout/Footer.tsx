
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-24 border-t border-slate-200/60">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10" aria-hidden />
      <div className="relative container mx-auto grid gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-600/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 11.25 12 4l9 7.25M6 9v11h12V9" />
              </svg>
            </span>
            <div>
              <p className="text-lg font-semibold text-slate-900">Estato</p>
              <p className="text-sm text-slate-500">Elevated living, curated for you.</p>
            </div>
          </div>
          <p className="max-w-sm text-sm text-slate-600">
            เราคัดสรรบ้าน คอนโด และอสังหาริมทรัพย์คุณภาพ ในทำเลศักยภาพพร้อมข้อมูลครบถ้วนเพื่อการตัดสินใจที่มั่นใจและโปร่งใส
          </p>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">ศูนย์บริการลูกค้า</p>
          <p>เปิดบริการทุกวัน 09:00 - 18:00 น.</p>
          <p>โทร. 02-123-4567</p>
          <p>อีเมล: hello@estato.co</p>
        </div>
        <div className="space-y-3 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">ติดตามเรา</p>
          <div className="flex flex-wrap gap-3">
            {['Facebook', 'Instagram', 'Line', 'YouTube'].map((platform) => (
              <span
                key={platform}
                className="inline-flex items-center rounded-full border border-slate-200/70 bg-white/80 px-4 py-1 font-medium text-slate-600 shadow-sm"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200/60 bg-white/70 py-6">
        <p className="text-center text-xs font-medium uppercase tracking-[0.35em] text-slate-500">
          © {new Date().getFullYear()} Estato. Crafted for modern urban living.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
