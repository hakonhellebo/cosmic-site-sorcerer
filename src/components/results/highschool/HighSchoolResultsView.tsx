
import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { calculateHighSchoolDimensions } from '@/utils/dimensions/dimensionCalculator';
import { formatInterests, formatLearningStyle, formatWorkPreference } from '@/utils/highschoolDataFormatters';
import { Dimension } from '@/utils/dimensions/types';
import AuthControls from './AuthControls';
import HighSchoolIntro from './HighSchoolIntro';
import DimensionsCard from './DimensionsCard';
import RecommendedEducation from './RecommendedEducation';
import CareerOpportunities from './CareerOpportunities';

interface HighSchoolResultsViewProps {
  userData: any;
}

export const HighSchoolResultsView: React.FC<HighSchoolResultsViewProps> = ({ userData }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Get the current user from Supabase
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        console.error("Error getting user:", error);
      } else {
        setUser(data.user);
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Extract high school data from userData with fallback
  const highSchoolData = userData?.questionnaire?.highSchool || {};
  
  // Calculate dimensions based on high school data
  const dimensions: Dimension[] = Object.keys(highSchoolData).length > 0 
    ? calculateHighSchoolDimensions(highSchoolData) 
    : [];
  
  // Ensure dimensions is an array (never undefined)
  const safeDimensions = dimensions || [];
  
  // Format interests from object to string
  const formattedInterests = formatInterests(highSchoolData?.interests);
    
  // Format learning style - could be object or string
  const learningStyle = highSchoolData?.learningStyle 
    ? formatLearningStyle(highSchoolData.learningStyle)
    : 'Ikke spesifisert';
  
  // Format work preference
  const workPreference = formatWorkPreference(highSchoolData?.workPreference);
  
  // Sample data for education recommendations
  const recommendedEducations = [
    {
      title: "Studiespesialisering med realfag",
      institution: "Videregående skoler",
      description: "Fokus på matematikk, fysikk og naturfag, egnet for teknologi-interesserte elever."
    },
    {
      title: "Medieproduksjon",
      institution: "Videregående skoler",
      description: "Kreativ utdanning med fokus på visuell kommunikasjon og digitale medier."
    },
    {
      title: "Helse- og oppvekstfag",
      institution: "Videregående skoler",
      description: "For deg som vil jobbe med mennesker innen helsesektoren."
    }
  ];
  
  // Sample data for next steps
  const nextSteps = [
    "Snakk med rådgiver på skolen din om mulighetene innen fagene du er interessert i",
    "Undersøk aktuelle utdanningsprogrammer på utdanning.no",
    "Delta på åpen dag på videregående skoler du er interessert i",
    "Ta en praksisdag hos bedrifter du synes virker spennende"
  ];
  
  // Sample data for career opportunities
  const careerOpportunities = [
    {
      title: "Ingeniør",
      description: "Planlegger og utfører tekniske løsninger innen forskjellige felt.",
      fields: ["Bygg og anlegg", "IT", "Miljø", "Petroleum"]
    },
    {
      title: "Designer",
      description: "Skaper visuelle løsninger og brukeropplevelser for ulike medier.",
      fields: ["Grafisk design", "UX/UI design", "Produktdesign", "Spilldesign"]
    },
    {
      title: "Helsefagarbeider",
      description: "Jobber med pasientomsorg og behandling i helsevesenet.",
      fields: ["Eldreomsorg", "Sykehus", "Hjemmetjeneste", "Psykiatri"]
    }
  ];
  
  return (
    <div className="space-y-10">
      {/* Auth controls */}
      <AuthControls 
        user={user}
        userData={userData}
      />

      {/* Main content */}
      <HighSchoolIntro 
        dimensions={safeDimensions.slice(0, 3)}
        interests={formattedInterests}
        learningStyle={learningStyle}
        workPreference={workPreference}
      />
      
      {safeDimensions.length > 0 && (
        <DimensionsCard dimensions={safeDimensions} />
      )}
      
      <RecommendedEducation 
        dimensions={safeDimensions}
        recommendations={recommendedEducations}
        nextSteps={nextSteps}
      />
      
      <CareerOpportunities 
        dimensions={safeDimensions}
        careers={careerOpportunities}
      />
    </div>
  );
};

export default HighSchoolResultsView;
