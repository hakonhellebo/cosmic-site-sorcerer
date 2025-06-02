
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Favorite {
  id: string;
  favorite_type: 'career' | 'education' | 'company';
  favorite_id: string;
  favorite_name: string;
  favorite_data?: any;
  created_at: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (
    type: 'career' | 'education' | 'company',
    id: string,
    name: string,
    data?: any
  ) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        toast.error('Du må være logget inn for å legge til favoritter');
        return false;
      }

      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          favorite_type: type,
          favorite_id: id,
          favorite_name: name,
          favorite_data: data
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('Dette er allerede i favorittene dine');
        } else {
          throw error;
        }
        return false;
      }

      toast.success(`${name} lagt til i favoritter`);
      fetchFavorites();
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error('Kunne ikke legge til favoritt');
      return false;
    }
  };

  const removeFavorite = async (favoriteId: string, name: string) => {
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      toast.success(`${name} fjernet fra favoritter`);
      fetchFavorites();
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Kunne ikke fjerne favoritt');
      return false;
    }
  };

  const isFavorite = (type: string, id: string) => {
    return favorites.some(fav => fav.favorite_type === type && fav.favorite_id === id);
  };

  const getFavoriteId = (type: string, id: string) => {
    const favorite = favorites.find(fav => fav.favorite_type === type && fav.favorite_id === id);
    return favorite?.id;
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteId,
    refetch: fetchFavorites
  };
};
