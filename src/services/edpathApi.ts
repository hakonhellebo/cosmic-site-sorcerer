
export interface EdPathApiResponse {
  topp_dimensjoner: string[];
  studier: {
    navn: string;
    lærested: string;
    dimensjoner: string[];
    stillinger: string[];
    arbeidsgivere: string[];
  }[];
}

export interface EdPathApiRequest {
  svar: Record<string, number>;
}

export const getRecommendationsFromApi = async (userAnswers: Record<string, number>): Promise<EdPathApiResponse> => {
  console.log("Sending user answers to EdPath API:", userAnswers);
  
  try {
    const response = await fetch("http://127.0.0.1:8000/api/anbefaling", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ svar: userAnswers }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: EdPathApiResponse = await response.json();
    console.log("Received recommendations from EdPath API:", data);
    
    return data;
  } catch (error) {
    console.error("Error fetching recommendations from EdPath API:", error);
    throw error;
  }
};
