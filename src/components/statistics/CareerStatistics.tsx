
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Database, Loader2 } from "lucide-react";
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const CareerStatistics = () => {
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const discoverTables = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Starting database table discovery...");
        
        // List of possible table names to check
        const possibleTables = [
          'Yrke_Statistikk',
          'yrke_statistikk', 
          'career_statistics',
          'occupations',
          'yrker',
          'clean_11418',
          'Universitetsdata',
          'universitetsdata',
          'high_school_responses',
          'university_responses',
          'worker_responses'
        ];
        
        const foundTables: string[] = [];
        const tablesWithData: Record<string, any[]> = {};
        
        for (const tableName of possibleTables) {
          try {
            console.log(`Checking table: ${tableName}`);
            
            const { data, error } = await supabase
              .from(tableName)
              .select('*')
              .limit(3);
            
            if (!error && data) {
              console.log(`✓ Found table: ${tableName} with ${data.length} rows`);
              foundTables.push(tableName);
              tablesWithData[tableName] = data;
              
              if (data.length > 0) {
                console.log(`Sample data from ${tableName}:`, data[0]);
                console.log(`Columns in ${tableName}:`, Object.keys(data[0]));
              }
            } else {
              console.log(`✗ Table ${tableName} not found or error:`, error?.message);
            }
          } catch (err) {
            console.log(`✗ Error checking table ${tableName}:`, err);
          }
        }
        
        console.log("Database discovery complete. Found tables:", foundTables);
        setAvailableTables(foundTables);
        setTableData(tablesWithData);
        
        if (foundTables.length === 0) {
          setError("Ingen tabeller funnet i databasen");
        }
        
      } catch (error) {
        console.error("Error during table discovery:", error);
        setError(`Feil ved undersøkelse av database: ${error instanceof Error ? error.message : 'Ukjent feil'}`);
      } finally {
        setLoading(false);
      }
    };

    discoverTables();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Undersøker tilgjengelige tabeller i databasen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Oversikt
          </CardTitle>
          <CardDescription>
            Tilgjengelige tabeller i din Supabase database
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-600 p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold mb-2">Feil:</h3>
              <p>{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Funnet {availableTables.length} tabeller:</h3>
                {availableTables.length > 0 ? (
                  <div className="grid gap-4">
                    {availableTables.map((tableName) => (
                      <Card key={tableName} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Database className="h-4 w-4 text-green-600" />
                            <h4 className="font-medium">{tableName}</h4>
                          </div>
                          
                          {tableData[tableName] && tableData[tableName].length > 0 ? (
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">
                                Antall rader: {tableData[tableName].length}+ (viser kun første 3)
                              </p>
                              <div className="text-xs">
                                <strong>Kolonner:</strong>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {Object.keys(tableData[tableName][0]).map((column) => (
                                    <span key={column} className="bg-blue-100 px-2 py-1 rounded text-blue-800">
                                      {column}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <details className="mt-2">
                                <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                                  Vis eksempel data
                                </summary>
                                <pre className="bg-gray-100 p-2 rounded text-xs mt-2 overflow-auto">
                                  {JSON.stringify(tableData[tableName][0], null, 2)}
                                </pre>
                              </details>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Tabellen er tom</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Ingen tabeller funnet</p>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Neste steg:</h4>
                <p className="text-sm text-blue-700">
                  Basert på tabellene som finnes, kan vi konfigurere yrkesstatistikken til å bruke riktig datakilde.
                  Fortell meg hvilken tabell som inneholder yrkesdata, så oppdaterer jeg koden.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerStatistics;
