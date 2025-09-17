import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import type { Project, Property } from '../../types';
import Spinner from '../ui/Spinner';
import PropertyCard from '../ui/PropertyCard';
import { useCanonical } from '../../utils/useCanonical';

const ProjectPage: React.FC = () => {
  const { projectSlug, type } = useParams<{ projectSlug: string; type?: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeTab: 'all' | 'rent' | 'buy' = type === 'rent' || type === 'buy' ? type : 'all';

  useCanonical(projectSlug ? `/projects/${projectSlug}${activeTab !== 'all' ? `/${activeTab}` : ''}` : null);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectSlug) {
        setError('ไม่พบโครงการที่ต้องการ');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [{ data: projectData, error: projectError }, { data: propertiesData, error: propertiesError }] = await Promise.all([
          supabase
            .from('projects')
            .select('*')
            .eq('slug', projectSlug)
            .single(),
          supabase
            .from('properties')
            .select(`
              *,
              projects (
                name_th,
                name_en
              )
            `)
            .eq('project_slug', projectSlug)
            .order('created_at', { ascending: false }),
        ]);

        if (projectError) {
          throw projectError;
        }

        if (propertiesError) {
          throw propertiesError;
        }

        setProject(projectData as Project);
        const transformed = (propertiesData || []).map((property) => ({
          ...property,
          projects: Array.isArray(property.projects) ? property.projects[0] : property.projects,
        }));

        setProperties(transformed as Property[]);
      } catch (err: any) {
        let errorMessage = 'ไม่สามารถโหลดข้อมูลโครงการได้';
        if (typeof err === 'string') {
          errorMessage = err;
        } else if (err && typeof err === 'object' && 'message' in err) {
          errorMessage = String(err.message);
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectSlug]);

  const filteredProperties = useMemo(() => {
    if (activeTab === 'all') {
      return properties;
    }

    return properties.filter((property) => property.type === activeTab);
  }, [properties, activeTab]);

  const propertyCounts = useMemo(() => {
    return properties.reduce(
      (acc, property) => {
        acc.all += 1;
        acc[property.type] += 1;
        return acc;
      },
      { all: 0, rent: 0, buy: 0 } as { all: number; rent: number; buy: number }
    );
  }, [properties]);

  return (
    <div className="container mx-auto space-y-12 px-4 py-16 sm:px-6 lg:px-8">
      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50/80 px-6 py-16 text-center text-red-600 shadow-lg shadow-red-100">
          {error}
        </div>
      ) : !project ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 py-20 text-center shadow-lg shadow-slate-200/60">
          <h2 className="text-2xl font-semibold text-slate-900">ไม่พบข้อมูลโครงการ</h2>
          <p className="mt-2 text-slate-600">ตรวจสอบลิงก์อีกครั้งหรือเริ่มต้นจากหน้ารวมโครงการ</p>
          <Link
            to="/projects"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white"
          >
            กลับหน้ารวมโครงการ
          </Link>
        </div>
      ) : (
        <>
          <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 px-8 py-10 shadow-2xl shadow-slate-200/60">
            <div className="absolute -left-24 top-1/2 hidden h-64 w-64 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-100 via-indigo-100 to-transparent opacity-60 lg:block" />
            <div className="relative grid gap-10 lg:grid-cols-[2fr,1fr] lg:items-center">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-blue-600">
                  {project.name_en || 'featured project'}
                </span>
                <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">{project.name_th}</h1>
                <p className="text-base text-slate-600">
                  {project.landmark || 'โครงการระดับพรีเมียมเชื่อมต่อเมือง สะดวกทุกการเดินทาง พร้อมสิ่งอำนวยความสะดวกครบครัน'}
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  {project.year_built && <span>สร้างเสร็จ {project.year_built}</span>}
                  {project.units && <span>{project.units} ยูนิต</span>}
                  {project.floors && <span>{project.floors} ชั้น</span>}
                </div>
              </div>
              <div className="space-y-4 rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 text-sm text-slate-600">
                <p className="font-semibold uppercase tracking-[0.3em] text-slate-500">ปุ่มลัด</p>
                <div className="grid gap-3">
                  <Link
                    to={`/projects/${project.slug}/rent`}
                    className="inline-flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>ประกาศเช่า ({propertyCounts.rent})</span>
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
                  <Link
                    to={`/projects/${project.slug}/buy`}
                    className="inline-flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>ประกาศขาย ({propertyCounts.buy})</span>
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
                  <a
                    href="tel:021234567"
                    className="inline-flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/40 transition hover:-translate-y-0.5"
                  >
                    <span>นัดชมโครงการ</span>
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
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-slate-200/80 bg-white/95 p-4">
              {[
                { key: 'all' as const, label: `ทั้งหมด (${propertyCounts.all})`, to: `/projects/${project.slug}` },
                { key: 'rent' as const, label: `เช่า (${propertyCounts.rent})`, to: `/projects/${project.slug}/rent` },
                { key: 'buy' as const, label: `ขาย (${propertyCounts.buy})`, to: `/projects/${project.slug}/buy` },
              ].map((tab) => (
                <Link
                  key={tab.key}
                  to={tab.to}
                  className={`inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] transition ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-600/40'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>

            {filteredProperties.length === 0 ? (
              <div className="rounded-3xl border border-slate-200/80 bg-white/90 py-16 text-center shadow-lg shadow-slate-200/60">
                <h2 className="text-2xl font-semibold text-slate-900">ยังไม่มีประกาศในหมวดนี้</h2>
                <p className="mt-2 text-slate-600">ติดต่อทีมงานเพื่อรับข่าวเมื่อมียูนิตใหม่ในโครงการ</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default ProjectPage;
