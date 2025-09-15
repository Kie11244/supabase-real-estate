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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">All Properties</h1>
      
      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 w-full sm:w-auto">
          <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700">Type</label>
          <select id="typeFilter" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option value="all">All</option>
            <option value="rent">Rent</option>
            <option value="buy">Buy</option>
          </select>
        </div>
        <div className="flex-1 w-full sm:w-auto">
          <label htmlFor="bedroomFilter" className="block text-sm font-medium text-gray-700">Bedrooms</label>
          <select id="bedroomFilter" value={bedroomFilter} onChange={(e) => setBedroomFilter(e.target.value as any)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option value="all">Any</option>
            <option value="0">Studio</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3+">3+</option>
          </select>
        </div>
        <div className="flex-1 w-full sm:w-auto">
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">Sort By</label>
          <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option value="created_at_desc">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-16">
          <h2 className="text-2xl font-semibold">No Properties Found</h2>
          <p className="mt-2">Try adjusting your filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;