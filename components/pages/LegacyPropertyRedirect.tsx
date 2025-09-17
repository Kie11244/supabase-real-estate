import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import type { Property } from '../../types';
import Spinner from '../ui/Spinner';
import { buildPropertyPath } from '../../utils/url';

const LegacyPropertyRedirect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirect = async () => {
      if (!id) {
        setError('ไม่พบประกาศที่ต้องการ');
        return;
      }

      const { data, error: supabaseError } = await supabase
        .from('properties')
        .select(`
          *,
          projects (
            name_th,
            name_en
          )
        `)
        .eq('id', id)
        .single();

      if (supabaseError || !data) {
        setError('ไม่พบประกาศที่ต้องการ');
        return;
      }

      const property = {
        ...data,
        projects: Array.isArray(data.projects) ? data.projects[0] : data.projects,
      } as Property;

      navigate(buildPropertyPath(property), { replace: true });
    };

    redirect();
  }, [id, navigate]);

  if (error) {
    return <div className="py-16 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="py-16">
      <Spinner />
    </div>
  );
};

export default LegacyPropertyRedirect;
