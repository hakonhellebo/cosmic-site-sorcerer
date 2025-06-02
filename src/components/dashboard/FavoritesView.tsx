
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Building, BookOpen, Briefcase, ExternalLink, MapPin, Users } from "lucide-react";
import { useFavorites } from '@/hooks/useFavorites';
import { useNavigate } from 'react-router-dom';

const FavoritesView = () => {
  const { favorites, loading } = useFavorites();
  const navigate = useNavigate();

  const favoritesByType = {
    company: favorites.filter(f => f.favorite_type === 'company'),
    career: favorites.filter(f => f.favorite_type === 'career'),
    education: favorites.filter(f => f.favorite_type === 'education')
  };

  const handleViewCompany = (companyName: string) => {
    const companySlug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    navigate(`/bedrift/${companySlug}`, { 
      state: { 
        company: {
          Selskap: companyName,
          ...favorites.find(f => f.favorite_name === companyName)?.favorite_data
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Henter favoritter...</span>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Mine favoritter
          </CardTitle>
          <CardDescription>
            Du har ikke lagt til noen favoritter ennå
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">
            Utforsk statistikksidene og legg til bedrifter, yrker og utdanninger du er interessert i.
          </p>
          <Button onClick={() => navigate('/statistikk')}>
            Utforsk statistikk
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Mine favoritter
          </CardTitle>
          <CardDescription>
            {favorites.length} favoritt{favorites.length !== 1 ? 'er' : ''} totalt
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Companies */}
      {favoritesByType.company.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Bedrifter ({favoritesByType.company.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {favoritesByType.company.map((favorite) => (
                <div key={favorite.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{favorite.favorite_name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewCompany(favorite.favorite_name)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  {favorite.favorite_data && (
                    <div className="space-y-1 text-sm text-gray-600">
                      {favorite.favorite_data.industry && (
                        <Badge variant="secondary">{favorite.favorite_data.industry}</Badge>
                      )}
                      {favorite.favorite_data.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {favorite.favorite_data.location}
                        </div>
                      )}
                      {favorite.favorite_data.employees && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {favorite.favorite_data.employees} ansatte
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Careers */}
      {favoritesByType.career.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Yrker ({favoritesByType.career.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {favoritesByType.career.map((favorite) => (
                <div key={favorite.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{favorite.favorite_name}</h4>
                  {favorite.favorite_data?.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {favorite.favorite_data.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {favoritesByType.education.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Utdanninger ({favoritesByType.education.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {favoritesByType.education.map((favorite) => (
                <div key={favorite.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{favorite.favorite_name}</h4>
                  {favorite.favorite_data?.institution && (
                    <p className="text-sm text-gray-600 mt-1">
                      {favorite.favorite_data.institution}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FavoritesView;
