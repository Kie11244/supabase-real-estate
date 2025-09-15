import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import type { Property } from '../../types';
import PropertyCard from '../ui/PropertyCard';
import Spinner from '../ui/Spinner';
import { Link } from 'react-router-dom';

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
    <div>
      {/* Hero Section */}
      <div className="relative bg-gray-800 text-white py-20 sm:py-32">
        <div className="absolute inset-0">
          <img src="https://picsum.photos/seed/hero/1920/1080" alt="Hero background" className="w-full h-full object-cover opacity-40"/>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Find Your Perfect Home
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-300">
            Discover the best properties for sale and rent in prime locations.
          </p>
          <div className="mt-8">
            <Link 
              to="/properties"
              className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition duration-300"
            >
              Explore Properties
            </Link>
          </div>
        </div>
      </div>

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