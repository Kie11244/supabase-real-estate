
import React from 'react';
import type { Property } from '../../types';
import { Link } from 'react-router-dom';
import { BedIcon, BathIcon, AreaIcon } from './PropertyIcons';

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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <Link to={`/properties/${property.id}`} className="block">
        <div className="relative">
          <img 
            src={property.images && property.images.length > 0 ? property.images[0] : 'https://picsum.photos/800/600'} 
            alt={property.title_th}
            className="w-full h-56 object-cover"
          />
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">
            For {property.type}
          </span>
          {property.badges && property.badges.map((badge, index) => (
            <span key={index} className="absolute top-2 right-2 bg-yellow-400 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
              {badge}
            </span>
          ))}
        </div>
        <div className="p-4">
          <p className="text-lg font-semibold text-blue-700">
            {formatter.format(property.price)}
            {property.type === 'rent' && <span className="text-sm font-normal text-gray-500">/เดือน</span>}
          </p>
          <h3 className="text-xl font-bold text-gray-800 truncate mt-1" title={property.title_th}>
            {property.title_th}
          </h3>
          <p className="text-gray-600 mt-1 truncate">
            {property.projects?.name_th || 'Unknown Project'}
          </p>
          <div className="flex items-center text-gray-500 mt-4 space-x-4 border-t pt-3">
            {typeof property.bedrooms !== 'undefined' && (
              <div className="flex items-center">
                <BedIcon className="h-5 w-5 mr-1" /> 
                <span>{property.bedrooms > 0 ? `${property.bedrooms} Bed` : 'Studio'}</span>
              </div>
            )}
            {typeof property.bathrooms !== 'undefined' && (
              <div className="flex items-center">
                <BathIcon className="h-5 w-5 mr-1" /> 
                <span>{property.bathrooms} Bath</span>
              </div>
            )}
            {property.size_sqm && (
              <div className="flex items-center">
                <AreaIcon className="h-5 w-5 mr-1" />
                <span>{property.size_sqm} m²</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
