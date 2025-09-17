import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabase';
import type { Property } from '../../types';
import Spinner from '../ui/Spinner';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // FIX: Select all required fields for the nested 'projects' object
      // to match the 'Project' type definition. Supabase returns nested objects
      // as an array for list queries, and the `Property` type expects a single object.
      const { data, error: supabaseError } = await supabase
        .from('properties')
        .select(`
          id,
          created_at,
          project_slug,
          title_th,
          price,
          type,
          status,
          projects (
            id,
            created_at,
            slug,
            name_th,
            name_en
          )
        `)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }
      
      // FIX: The Supabase query for a list returns related tables as an array, but the 
      // `Property` type expects `projects` to be a single object. We transform the data
      // to take the first item from the `projects` array to match the expected type.
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
      console.error('Error fetching properties for dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) {
        alert('Error deleting property: ' + error.message);
      } else {
        alert('Property deleted successfully.');
        fetchProperties();
      }
    }
  };

  const formatter = new Intl.NumberFormat('th-TH');

  return (
    <div className="container mx-auto space-y-10 px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 px-8 py-10 shadow-xl shadow-slate-200/60 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">control center</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">จัดการรายการทรัพย์ทั้งหมด</h1>
          <p className="mt-2 text-sm text-slate-600">ตรวจสอบอัปเดตสถานะ เพิ่มหรือลบประกาศได้จากแดชบอร์ดเดียว</p>
        </div>
        <Link
          to="/add-property"
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-slate-900/30 transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          <span>+ เพิ่มทรัพย์ใหม่</span>
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-2xl shadow-slate-200/60">
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : properties.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200/80 text-sm">
              <thead className="bg-slate-50/90 text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left font-semibold uppercase tracking-[0.25em]">ชื่อประกาศ</th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold uppercase tracking-[0.25em]">โครงการ</th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold uppercase tracking-[0.25em]">ประเภท</th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold uppercase tracking-[0.25em]">ราคา</th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold uppercase tracking-[0.25em]">สถานะ</th>
                  <th scope="col" className="px-6 py-4 text-right font-semibold uppercase tracking-[0.25em]">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 bg-white/70 text-slate-700">
                {properties.map((prop) => (
                  <tr key={prop.id} className="transition hover:bg-blue-50/50">
                    <td className="px-6 py-4 font-semibold text-slate-900">{prop.title_th}</td>
                    <td className="px-6 py-4 text-slate-500">{prop.projects?.name_th || '-'}</td>
                    <td className="px-6 py-4 capitalize text-slate-500">{prop.type}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{formatter.format(prop.price)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
                          prop.status === 'available'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full bg-current" />
                        {prop.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-3">
                        <button className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 transition hover:text-blue-800">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(prop.id)}
                          className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600 transition hover:text-rose-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-8 py-16 text-center text-slate-500">ยังไม่มีรายการทรัพย์ ให้เริ่มต้นเพิ่มทรัพย์ชิ้นแรกของคุณได้เลย</div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;