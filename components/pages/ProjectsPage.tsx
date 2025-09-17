import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import type { Project } from '../../types';
import Spinner from '../ui/Spinner';
import { useCanonical } from '../../utils/useCanonical';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useCanonical('/projects');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: supabaseError } = await supabase
          .from('projects')
          .select(`
            *
          `)
          .order('name_th', { ascending: true });

        if (supabaseError) {
          throw supabaseError;
        }

        setProjects((data || []) as Project[]);
      } catch (err: any) {
        let errorMessage = 'ไม่สามารถโหลดรายชื่อโครงการได้';
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

    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto space-y-12 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-500">Curated neighbourhoods</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">รวมทุกโครงการคอนโดในพอร์ตของเรา</h1>
        <p className="mt-4 text-base text-slate-600">
          สำรวจคอนโดที่ทีมงานคัดสรร พร้อมข้อมูลปีที่สร้าง จำนวนยูนิต และไฮไลต์สำคัญเพื่อให้คุณเลือกทำเลที่ใช่ได้ง่ายขึ้น
        </p>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50/80 px-6 py-12 text-center text-red-600 shadow-lg shadow-red-100">
          {error}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 py-16 text-center shadow-lg shadow-slate-200/60">
          <h2 className="text-2xl font-semibold text-slate-900">ยังไม่มีโครงการในระบบ</h2>
          <p className="mt-2 text-slate-600">เริ่มต้นเพิ่มโครงการใหม่ได้จากแดชบอร์ดผู้ดูแล</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-lg shadow-slate-200/60 transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-blue-100 via-indigo-100 to-transparent opacity-60 transition group-hover:scale-125" />
              <div className="relative space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-500">{project.name_en}</p>
                <h2 className="text-2xl font-semibold text-slate-900">{project.name_th}</h2>
                {project.highlights && project.highlights.length > 0 && (
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {project.highlights.slice(0, 3).map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <span>{highlight}</span>
                      </li>)
                    )}
                  </ul>
                )}
                <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  {project.bts && <span>BTS {project.bts}</span>}
                  {project.mrt && <span>MRT {project.mrt}</span>}
                  {project.year_built && <span>สร้างเสร็จ {project.year_built}</span>}
                </div>
              </div>
              <div className="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-blue-600">
                ดูรายละเอียดโครงการ
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
