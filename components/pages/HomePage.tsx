import React, { useState, useEffect } from 'react';
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
    <div className="bg-gray-50">
      {/* Hero Section */}
      <HeroSlider />

      {/* Featured Properties Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Recent Listings
        </h2>
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;