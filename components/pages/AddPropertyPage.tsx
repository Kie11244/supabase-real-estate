import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import type { Project } from '../../types';

const AddPropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  // Form state
  const [title_th, setTitleTh] = useState('');
  const [project_slug, setProjectSlug] = useState('');
  const [type, setType] = useState<'rent' | 'buy'>('rent');
  const [price, setPrice] = useState<number | ''>('');
  const [bedrooms, setBedrooms] = useState<number | ''>('');
  const [bathrooms, setBathrooms] = useState<number | ''>('');
  const [size_sqm, setSizeSqm] = useState<number | ''>('');
  const [floor, setFloor] = useState<number | ''>('');
  const [status, setStatus] = useState<'available' | 'unavailable'>('available');

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('projects').select('slug, name_th');
      if (error) {
        console.error('Error fetching projects:', error);
        setError('Could not load projects. Please try again later.');
      } else {
        setProjects(data as any[]);
      }
    };
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!project_slug || !title_th || price === '' || bedrooms === '' || bathrooms === '' || size_sqm === '') {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
    }

    try {
      const { error: insertError } = await supabase.from('properties').insert([
        {
          title_th,
          project_slug,
          type,
          price: Number(price),
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          size_sqm: Number(size_sqm),
          floor: floor === '' ? null : Number(floor),
          status,
        },
      ]);

      if (insertError) {
        throw insertError;
      }
      
      alert('Property added successfully!');
      navigate('/dashboard');

    } catch (err: any) {
        let errorMessage = 'An unexpected error occurred.';
        if (typeof err === 'string') {
            errorMessage = err;
        } else if (err && typeof err === 'object' && 'message' in err) {
            errorMessage = String(err.message);
        }
        setError(errorMessage);
        console.error('Error adding property:', err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 px-8 py-10 text-center shadow-xl shadow-slate-200/60">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">new listing</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">เพิ่มอสังหาฯ ลงระบบ</h1>
          <p className="mt-2 text-sm text-slate-600">กรอกข้อมูลสำคัญของทรัพย์เพื่อเผยแพร่บนเว็บไซต์และจัดการในแดชบอร์ด</p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-2xl shadow-slate-200/60">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="project" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  โครงการ
                </label>
                <select
                  id="project"
                  value={project_slug}
                  onChange={(e) => setProjectSlug(e.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="" disabled>
                    เลือกโครงการ
                  </option>
                  {projects.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name_th}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="title_th" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  ชื่อประกาศ (ภาษาไทย)
                </label>
                <input
                  type="text"
                  id="title_th"
                  value={title_th}
                  onChange={(e) => setTitleTh(e.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label htmlFor="type" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  ประเภทประกาศ
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as 'rent' | 'buy')}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="rent">ปล่อยเช่า</option>
                  <option value="buy">ประกาศขาย</option>
                </select>
              </div>

              <div>
                <label htmlFor="price" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  ราคา (บาท)
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label htmlFor="bedrooms" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  ห้องนอน
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  min="0"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label htmlFor="bathrooms" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  ห้องน้ำ
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  min="1"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label htmlFor="size_sqm" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  พื้นที่ใช้สอย (ตร.ม.)
                </label>
                <input
                  type="number"
                  id="size_sqm"
                  value={size_sqm}
                  onChange={(e) => setSizeSqm(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  min="0"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label htmlFor="floor" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  ชั้นที่ตั้ง
                </label>
                <input
                  type="number"
                  id="floor"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value === '' ? '' : Number(e.target.value))}
                  min="0"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label htmlFor="status" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  สถานะประกาศ
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'available' | 'unavailable')}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="available">พร้อมเผยแพร่</option>
                  <option value="unavailable">พักการขาย/เช่า</option>
                </select>
              </div>
            </div>

            {error && <p className="text-center text-sm font-semibold text-rose-600">{error}</p>}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white shadow-lg shadow-blue-600/40 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูลทรัพย์'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyPage;
