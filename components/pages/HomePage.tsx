import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import type { Property } from '../../types';
import PropertyCard from '../ui/PropertyCard';
import Spinner from '../ui/Spinner';
import HeroSlider from '../ui/HeroSlider';

const HomePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: supabaseError } = await supabase
          .from('properties')
          .select(`
            *,
            projects (
              name_th,
              name_en
            )
          `)
          .order('created_at', { ascending: false })
          .limit(6);

        if (supabaseError) {
          throw supabaseError;
        }

        // FIX: Transform the data to match the expected 'Property' type.
        // Supabase returns related tables as an array, but the type expects an object.
        const transformedData = data?.map(p => ({
          ...p,
          projects: Array.isArray(p.projects) ? p.projects[0] : p.projects,
        }));

        setProperties((transformedData || []) as Property[]);
      } catch (err: any) {
        let errorMessage = 'An unexpected error occurred while fetching properties.';
        if (typeof err === 'string') {
            errorMessage = err;
        } else if (err && typeof err === 'object' && 'message' in err) {
            errorMessage = String(err.message);
        }
        setError(errorMessage);
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <HeroSlider />

      {/* Featured Properties Section */}
      <section className="relative">
        <div className="absolute inset-x-0 -top-16 -z-10 h-64 bg-gradient-to-b from-blue-100/40 via-transparent to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-500">Selected for you</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              ผลงานล่าสุดจากทีมคอนเซียร์จของเรา
            </h2>
            <p className="mt-4 text-base text-slate-600">
              อสังหาริมทรัพย์ระดับพรีเมียมที่ผ่านการตรวจสอบโดยผู้เชี่ยวชาญ พร้อมข้อมูลครบถ้วนและโปร่งใส เพื่อการตัดสินใจที่มั่นใจทุกครั้ง
            </p>
          </div>

          <div className="mt-12">
            {loading ? (
              <Spinner />
            ) : error ? (
              <div className="rounded-3xl border border-red-200 bg-red-50/80 px-6 py-10 text-center text-red-600 shadow-lg shadow-red-100">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Value propositions */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-white via-blue-50/40 to-white" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[2fr,3fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-blue-600">
                why estato
              </span>
              <h3 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                บริการครบวงจร ตั้งแต่ค้นหา จนถึงปิดการขาย
              </h3>
              <p className="text-base text-slate-600">
                ทีมที่ปรึกษาของเราพร้อมสนับสนุนคุณในทุกขั้นตอนด้วยเทคโนโลยีและข้อมูลที่ทันสมัย เพื่อให้ได้ทรัพย์ที่ใช่ในราคาที่ดีที่สุด
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: 'ข้อมูลครบถ้วนแบบเรียลไทม์',
                  description:
                    'เชื่อมต่อฐานข้อมูล Supabase เพื่อติดตามสถานะ ราคา และข้อมูลโครงการได้แบบอัปเดตตลอดเวลา.',
                },
                {
                  title: 'ดีไซน์ประทับใจทุกครั้ง',
                  description:
                    'เราออกแบบประสบการณ์การค้นหาให้เรียบง่าย สอดคล้องกับไลฟ์สไตล์เมืองและคอนเซปต์ Luxury Urban Living.',
                },
                {
                  title: 'ทีมงานมืออาชีพ',
                  description:
                    'ที่ปรึกษาพร้อมให้คำแนะนำทั้งภาษาไทยและอังกฤษ พร้อมบริการจัดทัวร์โครงการแบบส่วนตัว.',
                },
                {
                  title: 'บริการครบจบในที่เดียว',
                  description:
                    'ตั้งแต่เอกสาร สินเชื่อ จนถึงบริการตกแต่ง เรามีพันธมิตรครบทุกด้านเพื่อให้คุณสบายใจ.',
                },
              ].map(({ title, description }) => (
                <div
                  key={title}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 via-indigo-100 to-transparent opacity-60 transition group-hover:scale-125" />
                  <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
                  <p className="mt-3 text-sm text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-14 text-white shadow-2xl shadow-blue-600/40 sm:px-12">
          <div className="absolute -left-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <div className="relative flex flex-col gap-6 text-center sm:text-left sm:items-center sm:justify-between sm:flex-row">
            <div className="max-w-xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/70">personal concierge</p>
              <h3 className="text-3xl font-bold sm:text-4xl">เริ่มต้นวางแผนอสังหาฯ กับผู้เชี่ยวชาญวันนี้</h3>
              <p className="text-white/80">
                นัดหมายเพื่อรับคำปรึกษาและพาชมโครงการแบบส่วนตัว พร้อมแนะนำตัวเลือกการลงทุนที่เหมาะกับคุณที่สุด
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 sm:items-end">
              <a
                href="tel:021234567"
                className="inline-flex items-center gap-3 rounded-full bg-white/90 px-6 py-3 text-base font-semibold text-blue-700 transition hover:bg-white"
              >
                02-123-4567
                <span className="text-xs font-medium uppercase tracking-[0.35em] text-blue-500">call us</span>
              </a>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/20"
              >
                ดูรายการทรัพย์ทั้งหมด
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="h-4 w-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5 15.75 12 8.25 19.5" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;