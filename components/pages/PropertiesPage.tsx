import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabase';
import type { Property } from '../../types';
import PropertyCard from '../ui/PropertyCard';
import Spinner from '../ui/Spinner';

const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [typeFilter, setTypeFilter] = useState<'all' | 'rent' | 'buy'>('all');
  const [bedroomFilter, setBedroomFilter] = useState<'all' | '0' | '1' | '2' | '3+'>('all');
  const [sortBy, setSortBy] = useState<'created_at_desc' | 'price_asc' | 'price_desc'>('created_at_desc');

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          projects (
            name_th
          )
        `);

      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }

      if (bedroomFilter !== 'all') {
        if (bedroomFilter === '3+') {
          query = query.gte('bedrooms', 3);
        } else {
          query = query.eq('bedrooms', parseInt(bedroomFilter));
        }
      }
      
      const [sortField, sortOrder] = sortBy.split('_');
      query = query.order(sortField, { ascending: sortOrder === 'asc' });

      const { data, error: supabaseError } = await query;

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
  }, [typeFilter, bedroomFilter, sortBy]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return (
    <div className="container mx-auto space-y-10 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-500">Curated collection</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">สำรวจรายการทรัพย์ทั้งหมด</h1>
        <p className="mt-4 text-base text-slate-600">
          ปรับแต่งการค้นหาเพื่อหาบ้านและคอนโดที่ตรงใจ พร้อมเรียงลำดับตามงบประมาณหรือความใหม่ของประกาศได้ทันที
        </p>
      </div>

      {/* Filter Bar */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-gradient-to-br from-blue-100 via-indigo-100 to-transparent opacity-60" aria-hidden />
        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col">
            <label htmlFor="typeFilter" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              ประเภทประกาศ
            </label>
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">ทั้งหมด</option>
              <option value="rent">เช่า</option>
              <option value="buy">ขาย</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="bedroomFilter" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              จำนวนห้องนอน
            </label>
            <select
              id="bedroomFilter"
              value={bedroomFilter}
              onChange={(e) => setBedroomFilter(e.target.value as any)}
              className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">ทั้งหมด</option>
              <option value="0">สตูดิโอ</option>
              <option value="1">1 ห้อง</option>
              <option value="2">2 ห้อง</option>
              <option value="3+">3 ห้องขึ้นไป</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="sortBy" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              เรียงลำดับตาม
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="created_at_desc">ประกาศล่าสุด</option>
              <option value="price_asc">ราคาต่ำไปสูง</option>
              <option value="price_desc">ราคาสูงไปต่ำ</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50/90 px-6 py-12 text-center text-red-600 shadow-lg shadow-red-100">
          {error}
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 py-20 text-center shadow-lg shadow-slate-200/60">
          <h2 className="text-2xl font-semibold text-slate-900">ไม่พบรายการที่ต้องการ</h2>
          <p className="mt-2 text-slate-600">ลองปรับตัวกรองเพื่อค้นหาอสังหาริมทรัพย์ที่เหมาะกับคุณมากขึ้น</p>
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;