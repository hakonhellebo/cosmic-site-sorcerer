
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversityQuestionnaire from '@/components/UniversityQuestionnaire';
import Layout from '@/components/Layout';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';

const UniversityQuestionnairePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [page, setPage] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const form = useForm({
    defaultValues: {
      university: {
        studyField: "",
        institution: "",
        otherInstitution: "",
        level: "",
        changedField: "",
        certaintylevel: "",
        // ... other fields will be filled as the user progresses
      }
    }
  });
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleNextPage = () => {
    // Simple validation could be added here if needed
    setPage(current => Math.min(current + 1, 7)); // 7 is the max page
  };

  const handlePreviousPage = () => {
    setPage(current => Math.max(current - 1, 1)); // 1 is the min page
  };

  const handleSubmitQuestionnaire = async () => {
    try {
      setIsSubmitting(true);
      
      // Get the form data
      const formData = form.getValues();
      
      // Create user data object
      const userData = {
        firstName: currentUser?.firstName || "Anonymous",
        lastName: currentUser?.lastName || "User",
        email: currentUser?.email || "",
        questionnaire: {
          university: formData.university,
        }
      };

      // Save the full user data including questionnaire responses
      localStorage.setItem('userFullData', JSON.stringify(userData));
      
      // If user is logged in, save this data to their profile
      if (currentUser) {
        localStorage.setItem(`userFullData_${currentUser.id}`, JSON.stringify(userData));
      }
      
      toast.success("Spørreskjema fullført!", {
        description: "Takk for dine svar. Du vil nå bli sendt til resultatsiden."
      });
      
      // Navigate to results
      setTimeout(() => {
        navigate('/results/university');
      }, 1000);
      
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      toast.error("Noe gikk galt", {
        description: "Vi kunne ikke lagre svarene dine. Vennligst prøv igjen."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Spørreskjema for studenter</h1>
        <p className="mb-8 text-gray-600">Side {page} av 7</p>
        
        <Form {...form}>
          <form>
            <UniversityQuestionnaire 
              form={form}
              page={page}
              onPrevious={handlePreviousPage}
              onSubmit={page === 7 ? handleSubmitQuestionnaire : handleNextPage}
              isSubmitting={isSubmitting}
            />
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default UniversityQuestionnairePage;
