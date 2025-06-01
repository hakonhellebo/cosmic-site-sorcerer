
import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/supabase';
import { toast } from "sonner";

export interface UserData {
  education: {
    degree: string;
    fieldOfStudy: string;
    institution: string;
    graduationYear: string;
  };
  career: {
    interests: string[];
    workEnvironment: string;
    salaryRange: number[];
  };
  skills: {
    keySkills: string;
    certifications: string;
    workExperience: string;
  };
}

export const useUserProfile = () => {
  const [userData, setUserData] = useState<UserData>({
    education: {
      degree: '',
      fieldOfStudy: '',
      institution: '',
      graduationYear: '',
    },
    career: {
      interests: [],
      workEnvironment: '',
      salaryRange: [500000],
    },
    skills: {
      keySkills: '',
      certifications: '',
      workExperience: '',
    }
  });

  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        const savedProfile = localStorage.getItem(`userProfile_${user.id}`);
        if (savedProfile) {
          const profileData = JSON.parse(savedProfile);
          setUserData(profileData);
          setIsProfileComplete(true);
        }
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
    }
  };

  const saveUserProfile = async (profileData: UserData) => {
    try {
      const user = await getCurrentUser();
      if (user) {
        localStorage.setItem(`userProfile_${user.id}`, JSON.stringify(profileData));
        console.log('Profile saved for user:', user.id);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const updateEducation = async (educationData: UserData['education']) => {
    const updatedUserData = {
      ...userData,
      education: educationData
    };
    setUserData(updatedUserData);
    await saveUserProfile(updatedUserData);
    toast.success("Utdanningsinformasjon lagret!");
  };

  const updateCareer = async (careerData: UserData['career']) => {
    const updatedUserData = {
      ...userData,
      career: careerData
    };
    setUserData(updatedUserData);
    await saveUserProfile(updatedUserData);
    toast.success("Karrierepreferanser lagret!");
  };

  const updateSkills = async (skillsData: UserData['skills']) => {
    const updatedUserData = {
      ...userData,
      skills: skillsData
    };
    setUserData(updatedUserData);
    await saveUserProfile(updatedUserData);
    setIsProfileComplete(true);
    toast.success("Profil fullført!");
  };

  const resetProfile = () => {
    setUserData({
      education: {
        degree: '',
        fieldOfStudy: '',
        institution: '',
        graduationYear: '',
      },
      career: {
        interests: [],
        workEnvironment: '',
        salaryRange: [500000],
      },
      skills: {
        keySkills: '',
        certifications: '',
        workExperience: '',
      }
    });
    setIsProfileComplete(false);
  };

  return {
    userData,
    isProfileComplete,
    updateEducation,
    updateCareer,
    updateSkills,
    resetProfile,
    setUserData
  };
};
