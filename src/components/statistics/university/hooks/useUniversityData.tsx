
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const UNIVERSITY_ORDER = [
  "Norges teknisk-naturvitenskapelige universitet",
  "Universitetet i Oslo",
  "Universitetet i Bergen",
  "Norges Handelshøyskole",
  "OsloMet - storbyuniversitetet",
  "UiT Norges arktiske universitet",
  "Universitetet i Innlandet",
  "Høgskulen på Vestlandet",
  "Universitetet i Sørøst-Norge",
  "Universitetet i Stavanger",
  "Universitetet i Agder",
  "Norges miljø- og biovitenskapelige universitet",
  "NLA Høgskolen",
  "Nord universitet",
  "Høgskulen i Østfold",
  "Høgskulen i Molde, Vitenskaplig høgskole i logistikk",
  "VID vitenskapelige høgskole",
  "Norges idrettshøgskole",
  "Høgskulen i Volda",
  "Politihøgskolen",
  "Arkitektur- og designhøgskolen i Oslo",
  "Ansgar høyskole",
  "MF vitenskapelig høyskole",
  "Fjellhaug Internasjonale Høgskole"
];

export const useUniversityData = () => {
  const [allStudentData, setAllStudentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState<string[]>([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      console.log("Fetching ALL data from Student_data_ny (NEW TABLE)...");
      
      try {
        // First, get the total count
        const { count, error: countError } = await supabase
          .from('Student_data_ny')
          .select('*', { count: 'exact', head: true });
        
        if (countError) {
          console.error("Error getting count:", countError);
        } else {
          console.log("Total records in Student_data_ny:", count);
        }
        
        // Fetch all data in larger batches with better logic
        let allData: any[] = [];
        let from = 0;
        const batchSize = 1000;
        let hasMore = true;
        let attemptCount = 0;
        const maxAttempts = Math.ceil((count || 15000) / batchSize) + 5;
        
        while (hasMore && attemptCount < maxAttempts) {
          attemptCount++;
          console.log(`Fetching batch ${attemptCount}: records ${from} to ${from + batchSize - 1}`);
          
          const { data: batchData, error } = await supabase
            .from('Student_data_ny')
            .select('*')
            .range(from, from + batchSize - 1)
            .order('Lærestednavn', { ascending: true });
          
          if (error) {
            console.error("Supabase error:", error);
            break;
          }
          
          if (batchData && batchData.length > 0) {
            allData = [...allData, ...batchData];
            console.log(`Batch ${attemptCount}: Added ${batchData.length} records. Total so far: ${allData.length}`);
            
            from += batchSize;
            
            if (batchData.length < batchSize) {
              console.log("Reached end of data - batch returned fewer records than requested");
              hasMore = false;
            }
          } else {
            console.log("No more data returned");
            hasMore = false;
          }
          
          if (count && allData.length >= count) {
            console.log("Reached total count, stopping");
            hasMore = false;
          }
          
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log("Final data count:", allData.length);
        console.log("Expected count:", count);
        console.log("Sample data:", allData.slice(0, 3));
        
        if (count && allData.length < count) {
          console.warn(`Warning: Only fetched ${allData.length} out of ${count} records`);
        }
        
        setAllStudentData(allData);
        
        // Extract unique universities and sort according to custom order
        const uniqueUniversitiesSet = new Set(
          allData.map(item => item.Lærestednavn).filter(Boolean)
        );
        
        const sortedUniversities = Array.from(uniqueUniversitiesSet).sort((a, b) => {
          const indexA = UNIVERSITY_ORDER.indexOf(a);
          const indexB = UNIVERSITY_ORDER.indexOf(b);
          
          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          } else if (indexA !== -1) {
            return -1;
          } else if (indexB !== -1) {
            return 1;
          } else {
            return a.localeCompare(b);
          }
        });
        
        setUniversities(sortedUniversities);
        console.log("Found universities (in custom order):", sortedUniversities);
        
      } catch (err) {
        console.error("Error:", err);
      }
      setLoading(false);
    };

    fetchStudentData();
  }, []);

  return { allStudentData, loading, universities };
};
