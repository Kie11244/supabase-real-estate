import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import type { Property } from '../../types';
import Spinner from '../ui/Spinner';
import { BedIcon, BathIcon, AreaIcon } from '../ui/PropertyIcons';
import { buildPropertyPath } from '../../utils/url';
import { useCanonical } from '../../utils/useCanonical';

const PropertyDetailPage: React.FC = () => {
  const { projectSlug, type, roomSlugId } = useParams<{
    projectSlug: string;
    type?: string;
    roomSlugId: string;
  }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const propertyId = useMemo(() => {
    if (!roomSlugId) return null;
    const slugParts = roomSlugId.split('-');
    const idPart = slugParts[slugParts.length - 1];
    const parsedId = Number.parseInt(idPart, 10);
    return Number.isNaN(parsedId) ? null : parsedId;
  }, [roomSlugId]);

  useCanonical(property ? buildPropertyPath(property) : null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!projectSlug || !propertyId) {
        setError('ไม่พบประกาศที่ต้องการ');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const { data, error: supabaseError } = await supabase
          .from('properties')
          .select(`
            *,
            projects (*)
          `)
          .eq('id', propertyId)
          .eq('project_slug', projectSlug)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        const propertyData = {
          ...data,
          projects: Array.isArray(data?.projects) ? data?.projects?.[0] : data?.projects,
        } as Property;

        if (type && type !== propertyData.type) {
          throw new Error('ประเภทประกาศไม่ตรงกับลิงก์ที่เลือก');
        }

        setProperty(propertyData);
        if (propertyData?.images && propertyData.images.length > 0) {
          setSelectedImage(propertyData.images[0]);
        }
      } catch (err: any) {
        let errorMessage = 'An unexpected error occurred while fetching property details.';
        if (typeof err === 'string') {
          errorMessage = err;
        } else if (err && typeof err === 'object' && 'message' in err) {
          errorMessage = String(err.message);
        }
        setError(errorMessage);
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [projectSlug, propertyId, type]);

  const formatter = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  });

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner /></div>;
  if (error) return <div className="rounded-3xl border border-red-200 bg-red-50/80 px-6 py-16 text-center text-red-600 shadow-lg shadow-red-100">Error: {error}</div>;
  if (!property) return <div className="text-center text-slate-500 py-16">Property not found.</div>;

  const project = property.projects;

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="grid gap-10 lg:grid-cols-[1.65fr,1fr]">
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/70">
              <div className="relative h-[420px] w-full">
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt={property.title_th}
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" aria-hidden />
                <div className="absolute left-6 top-6 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-700 shadow-sm shadow-white/60">
                    {property.type === 'rent' ? 'for rent' : 'for sale'}
                  </span>
                  {property.status && (
                    <span className="inline-flex items-center rounded-full border border-white/70 bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
                      {property.status}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                      {project?.name_en}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-white">
                      {project?.name_th || property.projects?.name_th}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/90 px-4 py-3 text-right shadow-md">
                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">ราคา</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatter.format(property.price)}
                      {property.type === 'rent' && <span className="ml-1 text-xs font-medium text-slate-500">/เดือน</span>}
                    </p>
                  </div>
                </div>
              </div>

              {property.images && property.images.length > 1 && (
                <div className="border-t border-slate-200/70 bg-white/90 px-5 py-4">
                  <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                    {property.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`relative h-20 overflow-hidden rounded-2xl border-2 transition ${
                          selectedImage === img ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-transparent hover:border-blue-200'
                        }`}
                      >
                        <img src={img} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 text-center shadow-lg shadow-slate-200/60 sm:grid-cols-2 lg:grid-cols-4">
              {typeof property.bedrooms !== 'undefined' && (
                <div className="space-y-2">
                  <BedIcon className="mx-auto h-8 w-8 text-blue-500" />
                  <p className="text-sm font-semibold text-slate-900">{property.bedrooms > 0 ? `${property.bedrooms} ห้องนอน` : 'สตูดิโอ'}</p>
                </div>
              )}
              {typeof property.bathrooms !== 'undefined' && (
                <div className="space-y-2">
                  <BathIcon className="mx-auto h-8 w-8 text-blue-500" />
                  <p className="text-sm font-semibold text-slate-900">{property.bathrooms} ห้องน้ำ</p>
                </div>
              )}
              {property.size_sqm && (
                <div className="space-y-2">
                  <AreaIcon className="mx-auto h-8 w-8 text-blue-500" />
                  <p className="text-sm font-semibold text-slate-900">{property.size_sqm} ตร.ม.</p>
                </div>
              )}
              {typeof property.floor !== 'undefined' && property.floor !== null && (
                <div className="space-y-2">
                  <span className="text-3xl font-bold text-blue-500">{property.floor}</span>
                  <p className="text-sm font-semibold text-slate-900">ชั้น</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-xl shadow-slate-200/60">
              <span className="inline-flex items-center rounded-full border border-slate-200/80 bg-slate-50/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
                {property.type === 'rent' ? 'for rent' : 'for sale'}
              </span>
              <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{property.title_th}</h1>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.35em] text-slate-500">
                {project?.name_th}
                {project?.name_en && ` • ${project.name_en}`}
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">เสนอราคา</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {formatter.format(property.price)}
                    {property.type === 'rent' && <span className="ml-2 text-base font-medium text-slate-500">/ เดือน</span>}
                  </p>
                </div>
                <a
                  href="tel:021234567"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-blue-600/40 transition hover:-translate-y-0.5"
                >
                  นัดชมโครงการ
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
                <p className="text-xs text-slate-500">
                  * บริการคอนเซียร์จของเราให้คำปรึกษาโดยไม่มีค่าใช้จ่าย พร้อมจัดเตรียมเอกสารและสินเชื่อหากต้องการ
                </p>
              </div>
            </div>

            <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-lg shadow-slate-200/60">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">รายละเอียดสำคัญ</h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
                    <span className="font-medium text-slate-500">เฟอร์นิเจอร์</span>
                    <span className="font-semibold text-slate-800">{property.furnished || 'N/A'}</span>
                  </li>
                  {property.bts_distance_m && (
                    <li className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
                      <span className="font-medium text-slate-500">ระยะถึง BTS</span>
                      <span className="font-semibold text-slate-800">{property.bts_distance_m} ม.</span>
                    </li>
                  )}
                  {property.mrt_distance_m && (
                    <li className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
                      <span className="font-medium text-slate-500">ระยะถึง MRT</span>
                      <span className="font-semibold text-slate-800">{property.mrt_distance_m} ม.</span>
                    </li>
                  )}
                  {property.badges && property.badges.length > 0 && (
                    <li className="space-y-2">
                      <span className="font-medium uppercase tracking-[0.3em] text-slate-500">ไฮไลต์</span>
                      <div className="flex flex-wrap gap-2">
                        {property.badges.map((badge) => (
                          <span key={badge} className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              {project && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">ข้อมูลโครงการ</h2>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    <li className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
                      <span className="font-medium text-slate-500">ผู้พัฒนา</span>
                      <span className="font-semibold text-slate-800">{project.developer || 'ไม่ระบุ'}</span>
                    </li>
                    <li className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
                      <span className="font-medium text-slate-500">สร้างเสร็จ</span>
                      <span className="font-semibold text-slate-800">{project.year_built || 'ไม่ระบุ'}</span>
                    </li>
                    <li className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
                      <span className="font-medium text-slate-500">จำนวนชั้น</span>
                      <span className="font-semibold text-slate-800">{project.floors || 'ไม่ระบุ'}</span>
                    </li>
                    <li className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
                      <span className="font-medium text-slate-500">จำนวนยูนิต</span>
                      <span className="font-semibold text-slate-800">{project.units || 'ไม่ระบุ'}</span>
                    </li>
                    {project.facilities && project.facilities.length > 0 && (
                      <li className="space-y-2">
                        <span className="font-medium uppercase tracking-[0.3em] text-slate-500">สิ่งอำนวยความสะดวก</span>
                        <div className="flex flex-wrap gap-2">
                          {project.facilities.map((facility) => (
                            <span key={facility} className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                              {facility}
                            </span>
                          ))}
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
