
import React from 'react';
import { Button } from './button';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  type: 'career' | 'education' | 'company';
  id: string;
  name: string;
  data?: any;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  type,
  id,
  name,
  data,
  size = 'sm',
  variant = 'ghost',
  className
}) => {
  const { isFavorite, getFavoriteId, addFavorite, removeFavorite } = useFavorites();
  
  const favorite = isFavorite(type, id);
  const favoriteId = getFavoriteId(type, id);

  const handleToggle = async () => {
    if (favorite && favoriteId) {
      await removeFavorite(favoriteId, name);
    } else {
      await addFavorite(type, id, name, data);
    }
  };

  return (
    <Button
      onClick={handleToggle}
      size={size}
      variant={variant}
      className={cn(
        "flex items-center gap-1",
        favorite && "text-red-500 hover:text-red-600",
        className
      )}
    >
      <Heart 
        className={cn(
          "h-4 w-4",
          favorite && "fill-current"
        )} 
      />
      {size !== 'sm' && (favorite ? 'Fjern favoritt' : 'Legg til favoritt')}
    </Button>
  );
};
