
import React from 'react';
import type { Property } from '../../types';
import { Link } from 'react-router-dom';
import { BedIcon, BathIcon, AreaIcon } from './PropertyIcons';
import { buildPropertyPath } from '../../utils/url';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formatter = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  });

  return (
    <div className="group relative h-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-lg shadow-slate-200/70 transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl">
      <Link to={buildPropertyPath(property)} className="flex h-full flex-col">
        <div className="relative h-60 overflow-hidden">
          <img
            src={property.images && property.images.length > 0 ? property.images[0] : 'https://picsum.photos/800/600'}
            alt={property.title_th}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent opacity-90 transition group-hover:opacity-100" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-700 shadow-sm shadow-white/60">
            for {property.type}
          </span>
          {property.badges && property.badges.length > 0 && (
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              {property.badges.map((badge, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-700 shadow-sm shadow-slate-200/60"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                {property.projects?.name_th || 'Unknown Project'}
              </p>
              <h3 className="mt-2 line-clamp-2 text-xl font-semibold text-slate-900" title={property.title_th}>
                {property.title_th}
              </h3>
            </div>
            <span className="inline-flex items-center rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/30">
              {formatter.format(property.price)}
              {property.type === 'rent' && <span className="ml-1 text-xs font-medium text-white/70">/เดือน</span>}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-5 py-3 text-sm text-slate-600">
            {typeof property.bedrooms !== 'undefined' && (
              <div className="flex items-center gap-2">
                <BedIcon className="h-5 w-5 text-blue-500" />
                <span>{property.bedrooms > 0 ? `${property.bedrooms} ห้องนอน` : 'สตูดิโอ'}</span>
              </div>
            )}
            {typeof property.bathrooms !== 'undefined' && (
              <div className="flex items-center gap-2">
                <BathIcon className="h-5 w-5 text-blue-500" />
                <span>{property.bathrooms} ห้องน้ำ</span>
              </div>
            )}
            {property.size_sqm && (
              <div className="flex items-center gap-2">
                <AreaIcon className="h-5 w-5 text-blue-500" />
                <span>{property.size_sqm} ตร.ม.</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
