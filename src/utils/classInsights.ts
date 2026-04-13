// Rule-based insight generator for class survey responses

interface InsightRecommendation {
  icon: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
}

export function generateInsightRecommendations(responses: any[]): InsightRecommendation[] {
  const recommendations: InsightRecommendation[] = [];
  if (responses.length === 0) return recommendations;

  const completed = responses.filter(r => r.completion_status === 'completed');
  if (completed.length === 0) return recommendations;

  // Analyze responses for uncertainty
  const uncertaintyRate = calculateUncertaintyRate(completed);
  if (uncertaintyRate > 60) {
    recommendations.push({
      icon: '🎯',
      text: `${uncertaintyRate} % av elevene er helt eller delvis usikre på veien videre. Anbefaler å bruke tid på å normalisere usikkerhet i samtaler.`,
      priority: 'high',
    });
  } else if (uncertaintyRate > 30) {
    recommendations.push({
      icon: '💬',
      text: `${uncertaintyRate} % er usikre på veien videre. Gruppeveiledning om valgmuligheter kan være nyttig.`,
      priority: 'medium',
    });
  }

  // Career knowledge
  const careerKnowledgeGap = calculateCareerKnowledgeGap(completed);
  if (careerKnowledgeGap > 40) {
    recommendations.push({
      icon: '🔍',
      text: 'Mange elever har lite kunnskap om konkrete yrker. Anbefaler mer yrkesinformasjon og yrkesbesøk.',
      priority: 'high',
    });
  }

  // Study interest
  const studyInterestGap = calculateStudyInterestGap(completed);
  if (studyInterestGap > 40) {
    recommendations.push({
      icon: '📚',
      text: 'Flere elever ønsker å lære mer om hvilke studier som passer dem. Veiledning rundt utdanningsvalg anbefales.',
      priority: 'medium',
    });
  }

  // Completion rate
  const completionRate = Math.round((completed.length / responses.length) * 100);
  if (completionRate < 50) {
    recommendations.push({
      icon: '⚠️',
      text: `Bare ${completionRate} % har fullført undersøkelsen. Vurder å sette av mer tid i timen.`,
      priority: 'high',
    });
  }

  // Default recommendation
  if (recommendations.length === 0) {
    recommendations.push({
      icon: '✅',
      text: 'Elevene ser ut til å ha en god grunnforståelse. Individuelle samtaler kan likevel avdekke behov.',
      priority: 'low',
    });
  }

  return recommendations.sort((a, b) => {
    const p = { high: 0, medium: 1, low: 2 };
    return p[a.priority] - p[b.priority];
  });
}

export function aggregateInterests(responses: any[]): { name: string; count: number; percentage: number }[] {
  const completed = responses.filter(r => r.completion_status === 'completed');
  if (completed.length === 0) return [];

  const interestCounts: Record<string, number> = {};
  for (const r of completed) {
    const answers = r.responses || {};
    // Look for interest-related questions (common patterns)
    for (const [key, value] of Object.entries(answers)) {
      if (key.toLowerCase().includes('interesse') || key.toLowerCase().includes('interest') || key.toLowerCase().includes('sektor')) {
        if (Array.isArray(value)) {
          for (const v of value) {
            interestCounts[v] = (interestCounts[v] || 0) + 1;
          }
        } else if (typeof value === 'string' && value) {
          interestCounts[value] = (interestCounts[value] || 0) + 1;
        }
      }
    }
  }

  return Object.entries(interestCounts)
    .map(([name, count]) => ({ name, count, percentage: Math.round((count / completed.length) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export function aggregateLearningWishes(responses: any[]): { label: string; percentage: number }[] {
  const completed = responses.filter(r => r.completion_status === 'completed');
  if (completed.length === 0) return [];

  const counts: Record<string, number> = {};
  for (const r of completed) {
    const answers = r.responses || {};
    for (const [key, value] of Object.entries(answers)) {
      if (key.toLowerCase().includes('lære') || key.toLowerCase().includes('learn') || key.toLowerCase().includes('ønsk')) {
        if (Array.isArray(value)) {
          for (const v of value) counts[v] = (counts[v] || 0) + 1;
        } else if (typeof value === 'string' && value) {
          counts[value] = (counts[value] || 0) + 1;
        }
      }
    }
  }

  return Object.entries(counts)
    .map(([label, count]) => ({ label, percentage: Math.round((count / completed.length) * 100) }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 6);
}

export function aggregateCertaintyLevels(responses: any[]): { label: string; percentage: number; color: string }[] {
  const completed = responses.filter(r => r.completion_status === 'completed');
  if (completed.length === 0) return [];

  let veryUnsure = 0, somewhatUnsure = 0, sure = 0;
  for (const r of completed) {
    const answers = r.responses || {};
    for (const [key, value] of Object.entries(answers)) {
      if (key.toLowerCase().includes('sikker') || key.toLowerCase().includes('certain') || key.toLowerCase().includes('usikker')) {
        const v = typeof value === 'string' ? value.toLowerCase() : '';
        if (v.includes('veldig usikker') || v.includes('helt usikker') || v === '1' || v === '2') {
          veryUnsure++;
        } else if (v.includes('litt usikker') || v.includes('delvis') || v === '3') {
          somewhatUnsure++;
        } else {
          sure++;
        }
        break;
      }
    }
  }

  const total = veryUnsure + somewhatUnsure + sure;
  if (total === 0) return [];

  return [
    { label: 'Veldig usikre', percentage: Math.round((veryUnsure / total) * 100), color: 'bg-red-400' },
    { label: 'Litt usikre', percentage: Math.round((somewhatUnsure / total) * 100), color: 'bg-amber-400' },
    { label: 'Ganske sikre', percentage: Math.round((sure / total) * 100), color: 'bg-emerald-400' },
  ];
}

export function aggregateChallenges(responses: any[]): { label: string; percentage: number }[] {
  const completed = responses.filter(r => r.completion_status === 'completed');
  if (completed.length === 0) return [];

  const counts: Record<string, number> = {};
  for (const r of completed) {
    const answers = r.responses || {};
    for (const [key, value] of Object.entries(answers)) {
      if (key.toLowerCase().includes('vanskelig') || key.toLowerCase().includes('utfordr') || key.toLowerCase().includes('hindre') || key.toLowerCase().includes('barrier')) {
        if (Array.isArray(value)) {
          for (const v of value) counts[v] = (counts[v] || 0) + 1;
        } else if (typeof value === 'string' && value) {
          counts[value] = (counts[value] || 0) + 1;
        }
      }
    }
  }

  return Object.entries(counts)
    .map(([label, count]) => ({ label, percentage: Math.round((count / completed.length) * 100) }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);
}

function calculateUncertaintyRate(completed: any[]): number {
  let uncertain = 0;
  for (const r of completed) {
    const answers = r.responses || {};
    for (const [key, value] of Object.entries(answers)) {
      if (key.toLowerCase().includes('sikker') || key.toLowerCase().includes('certain')) {
        const v = typeof value === 'string' ? value.toLowerCase() : '';
        if (v.includes('usikker') || v === '1' || v === '2' || v === '3') {
          uncertain++;
        }
        break;
      }
    }
  }
  return completed.length > 0 ? Math.round((uncertain / completed.length) * 100) : 0;
}

function calculateCareerKnowledgeGap(completed: any[]): number {
  let gap = 0;
  for (const r of completed) {
    const answers = r.responses || {};
    for (const [key, value] of Object.entries(answers)) {
      if (key.toLowerCase().includes('yrke') || key.toLowerCase().includes('career') || key.toLowerCase().includes('jobb')) {
        const v = typeof value === 'string' ? value.toLowerCase() : '';
        if (v.includes('lite') || v.includes('vet ikke') || v.includes('usikker') || v === '1' || v === '2') {
          gap++;
        }
        break;
      }
    }
  }
  return completed.length > 0 ? Math.round((gap / completed.length) * 100) : 0;
}

function calculateStudyInterestGap(completed: any[]): number {
  let gap = 0;
  for (const r of completed) {
    const answers = r.responses || {};
    for (const [key, value] of Object.entries(answers)) {
      if (key.toLowerCase().includes('studi') || key.toLowerCase().includes('utdanning')) {
        const v = typeof value === 'string' ? value.toLowerCase() : '';
        if (v.includes('vet ikke') || v.includes('usikker') || v === '1' || v === '2') {
          gap++;
        }
        break;
      }
    }
  }
  return completed.length > 0 ? Math.round((gap / completed.length) * 100) : 0;
}
