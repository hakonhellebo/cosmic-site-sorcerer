
import { Dimension } from './types';

// Maps dimension IDs to their human-readable names and descriptions
export const getDimensionDescription = (dimension: string): Dimension => {
  switch(dimension) {
    case 'analytisk': 
      return { name: 'Analytisk', description: 'Du har evne til å analysere informasjon, logisk tenkning og problemløsning' };
    case 'kreativitet': 
      return { name: 'Kreativitet', description: 'Du har evne til å tenke nytt, skape og uttrykke deg' };
    case 'struktur': 
      return { name: 'Struktur', description: 'Du liker orden, system og klar retning' };
    case 'sosialitet': 
      return { name: 'Sosialitet', description: 'Du trives med å jobbe sammen med andre mennesker' };
    case 'teknologi': 
      return { name: 'Teknologi', description: 'Du har interesse for og kunnskap om digitale verktøy og teknologiske løsninger' };
    case 'helseinteresse': 
      return { name: 'Helseinteresse', description: 'Du har interesse for helse, omsorg og velvære hos mennesker' };
    case 'bærekraft': 
      return { name: 'Bærekraft', description: 'Du har interesse for miljø, klima og bærekraftig utvikling' };
    case 'ambisjon': 
      return { name: 'Ambisjon', description: 'Du har ønske om å oppnå suksess, framgang og anerkjennelse' };
    case 'selvstendighet': 
      return { name: 'Selvstendighet', description: 'Du er flink til å arbeide og ta beslutninger på egenhånd' };
    case 'praktisk': 
      return { name: 'Praktisk', description: 'Du har evne til å håndtere konkrete oppgaver og praktisk arbeid' };
    default:
      return { name: dimension, description: 'En av dine fremste egenskaper' };
  }
};
