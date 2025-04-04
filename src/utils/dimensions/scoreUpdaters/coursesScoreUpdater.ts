
import { DimensionScores } from '../types';

// Updates scores based on favorite courses
export const updateScoresFromFavoriteCourses = (scores: DimensionScores, favoriteCourses: Record<string, boolean> | undefined): void => {
  if (!favoriteCourses) return;
  
  // English format
  if (favoriteCourses.mathematics === true) {
    scores.analytisk += 3;
    console.log("Added 3 to analytisk from favoriteCourses.mathematics");
  }
  if (favoriteCourses.science === true) {
    scores.analytisk += 2;
    scores.teknologi += 1;
    console.log("Added 2 to analytisk and 1 to teknologi from favoriteCourses.science");
  }
  if (favoriteCourses.languages === true) {
    scores.kreativitet += 2;
    scores.sosialitet += 1;
    console.log("Added 2 to kreativitet and 1 to sosialitet from favoriteCourses.languages");
  }
  if (favoriteCourses.socialStudies === true) {
    scores.sosialitet += 2;
    scores.analytisk += 1;
    console.log("Added 2 to sosialitet and 1 to analytisk from favoriteCourses.socialStudies");
  }
  if (favoriteCourses.arts === true) {
    scores.kreativitet += 3;
    console.log("Added 3 to kreativitet from favoriteCourses.arts");
  }
  if (favoriteCourses.physicalEd === true) {
    scores.praktisk += 3;
    console.log("Added 3 to praktisk from favoriteCourses.physicalEd");
  }
  if (favoriteCourses.technology === true) {
    scores.teknologi += 3;
    console.log("Added 3 to teknologi from favoriteCourses.technology");
  }
  
  // Norwegian format - older version
  if (favoriteCourses.matematikk === true) {
    scores.analytisk += 3;
    console.log("Added 3 to analytisk from favoriteCourses.matematikk");
  }
  if (favoriteCourses.naturfag === true) {
    scores.analytisk += 2;
    scores.teknologi += 1;
    console.log("Added 2 to analytisk and 1 to teknologi from favoriteCourses.naturfag");
  }
  if (favoriteCourses.samfunnsfag === true) {
    scores.sosialitet += 2;
    scores.analytisk += 1;
    console.log("Added 2 to sosialitet and 1 to analytisk from favoriteCourses.samfunnsfag");
  }
};

// Updates scores based on older format with favoriteSubjects
export const updateScoresFromFavoriteSubjects = (scores: DimensionScores, favoriteSubjects: Record<string, boolean> | undefined): void => {
  if (!favoriteSubjects) return;
  
  if (favoriteSubjects.matematikk === true) {
    scores.analytisk += 3;
    console.log("Added 3 to analytisk from favoriteSubjects.matematikk");
  }
  if (favoriteSubjects.naturfag === true) {
    scores.analytisk += 2;
    scores.teknologi += 1;
    console.log("Added 2 to analytisk and 1 to teknologi from favoriteSubjects.naturfag");
  }
  if (favoriteSubjects.samfunnsfag === true) {
    scores.sosialitet += 2;
    scores.analytisk += 1;
    console.log("Added 2 to sosialitet and 1 to analytisk from favoriteSubjects.samfunnsfag");
  }
};
