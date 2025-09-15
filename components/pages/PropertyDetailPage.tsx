import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import type { Property } from '../../types';
import Spinner from '../ui/Spinner';
import { BedIcon, BathIcon, AreaIcon } from '../ui/PropertyIcons';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const { data, error: supabaseError } = await supabase
          .from('properties')
          .select(`
            *,
            projects (*)
          `)
          .eq('id', id)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        setProperty(data as Property);
        if (data && data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
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
  }, [id]);

  const formatter = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  });

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner /></div>;
  if (error) return <div className="text-center text-red-500 py-16">Error: {error}</div>;
  if (!property) return <div className="text-center text-gray-500 py-16">Property not found.</div>;

  const project = property.projects;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Image Gallery */}
        <div>
          <div className="h-96 bg-gray-200">
            {selectedImage && <img src={selectedImage} alt={property.title_th} className="w-full h-full object-cover"/>}
          </div>
          {property.images && property.images.length > 1 && (
            <div className="flex space-x-2 p-2 bg-gray-100">
              {property.images.map((img, index) => (
                <button key={index} onClick={() => setSelectedImage(img)} className={`w-24 h-16 rounded-md overflow-hidden border-2 ${selectedImage === img ? 'border-blue-500' : 'border-transparent'}`}>
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-6 md:p-8">
          <div className="md:flex md:justify-between md:items-start">
            <div>
              <span className="text-sm bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-full uppercase">For {property.type}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">{property.title_th}</h1>
              <p className="text-gray-600 text-lg mt-1">{project?.name_th} ({project?.name_en})</p>
            </div>
            <div className="mt-4 md:mt-0 md:text-right">
              <p className="text-4xl font-bold text-blue-600">{formatter.format(property.price)}</p>
              {property.type === 'rent' && <p className="text-gray-500">/เดือน</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center my-8 border-y py-4">
            {typeof property.bedrooms !== 'undefined' && (
              <div><BedIcon className="h-8 w-8 mx-auto text-blue-500" /><p className="mt-2 text-gray-700">{property.bedrooms > 0 ? `${property.bedrooms} Bedrooms` : 'Studio'}</p></div>
            )}
            {typeof property.bathrooms !== 'undefined' && (
              <div><BathIcon className="h-8 w-8 mx-auto text-blue-500" /><p className="mt-2 text-gray-700">{property.bathrooms} Bathrooms</p></div>
            )}
            {property.size_sqm && (
              <div><AreaIcon className="h-8 w-8 mx-auto text-blue-500" /><p className="mt-2 text-gray-700">{property.size_sqm} m²</p></div>
            )}
             {property.floor && (
              <div><p className="text-3xl font-bold text-blue-500">{property.floor}</p><p className="mt-1 text-gray-700">Floor</p></div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Details</h2>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Furnished:</strong> {property.furnished || 'N/A'}</li>
                {property.bts_distance_m && <li><strong>Distance to BTS:</strong> {property.bts_distance_m}m</li>}
                {property.mrt_distance_m && <li><strong>Distance to MRT:</strong> {property.mrt_distance_m}m</li>}
                {property.badges && <li><strong>Tags:</strong> {property.badges.join(', ')}</li>}
              </ul>
            </div>
            {project && (
               <div>
                 <h2 className="text-2xl font-bold text-gray-800 mb-4">About Project</h2>
                 <ul className="space-y-2 text-gray-700">
                   <li><strong>Developer:</strong> {project.developer}</li>
                   <li><strong>Year Built:</strong> {project.year_built}</li>
                   <li><strong>Total Floors:</strong> {project.floors}</li>
                   <li><strong>Total Units:</strong> {project.units}</li>
                   {project.facilities && <li><strong>Facilities:</strong> {project.facilities.join(', ')}</li>}
                 </ul>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;