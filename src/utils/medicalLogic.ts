import { LabMetric, MetricStatus } from '../types';

export interface BenchmarkResult {
  status: MetricStatus;
  percentageVariance: number; // Positive is above optimal, negative is below
  gaugePositionPercent: number; // 0% to 100% position on visual gauge
  isHealthy: boolean;
  statusBadge: string;
  badgeColor: 'emerald' | 'amber' | 'rose' | 'red';
  humanComparisonSummary: string;
}

/**
 * Compares an individual lab metric against normal healthy human baselines
 * E.g. Normal healthy human RBC benchmark is 4.8 million/mcL (or normalized 100 benchmark),
 * patient value 3.2 is ~33% below healthy baseline.
 */
export function evaluateLabMetric(
  patientValue: number,
  healthyMin: number,
  healthyMax: number,
  healthyBaseline: number,
  metricName: string,
  unit: string
): BenchmarkResult {
  const isHealthy = patientValue >= healthyMin && patientValue <= healthyMax;
  
  // Percentage relative to the ideal healthy benchmark
  const variance = Math.round(((patientValue - healthyBaseline) / healthyBaseline) * 100);

  let status: MetricStatus = 'normal';
  let badgeColor: 'emerald' | 'amber' | 'rose' | 'red' = 'emerald';
  let statusBadge = 'Optimal / Healthy';

  const criticalLowThreshold = healthyMin * 0.75;
  const criticalHighThreshold = healthyMax * 1.35;

  if (patientValue < criticalLowThreshold) {
    status = 'critical-low';
    badgeColor = 'red';
    statusBadge = 'Critically Low';
  } else if (patientValue < healthyMin) {
    status = 'low';
    badgeColor = 'amber';
    statusBadge = 'Below Normal';
  } else if (patientValue > criticalHighThreshold) {
    status = 'critical-high';
    badgeColor = 'red';
    statusBadge = 'Critically High';
  } else if (patientValue > healthyMax) {
    status = 'high';
    badgeColor = 'rose';
    statusBadge = 'Above Normal';
  } else {
    status = 'normal';
    badgeColor = 'emerald';
    statusBadge = 'Normal / Healthy';
  }

  // Calculate gauge position from 0 to 100
  // Range is centered around healthyMin to healthyMax
  const rangeSpan = healthyMax - healthyMin;
  const extendedMin = Math.max(0, healthyMin - rangeSpan * 0.8);
  const extendedMax = healthyMax + rangeSpan * 0.8;
  const rawPosition = ((patientValue - extendedMin) / (extendedMax - extendedMin)) * 100;
  const gaugePositionPercent = Math.min(100, Math.max(0, Math.round(rawPosition)));

  let humanComparisonSummary = '';
  if (isHealthy) {
    humanComparisonSummary = `Your ${metricName} (${patientValue} ${unit}) matches a healthy person's optimal range (${healthyMin} - ${healthyMax} ${unit}).`;
  } else if (status === 'low' || status === 'critical-low') {
    humanComparisonSummary = `A healthy person typically maintains ${healthyBaseline} ${unit}. Your level is ${patientValue} ${unit} (${Math.abs(variance)}% lower than healthy baseline).`;
  } else {
    humanComparisonSummary = `A healthy person maintains ${healthyBaseline} ${unit} or below. Your level is ${patientValue} ${unit} (${variance}% higher than healthy baseline).`;
  }

  return {
    status,
    percentageVariance: variance,
    gaugePositionPercent,
    isHealthy,
    statusBadge,
    badgeColor,
    humanComparisonSummary,
  };
}

/**
 * Formats medicine shelf-life and critical post-opening safety rule.
 * Specifically checks for eye drops, antibiotic syrups, and regular tablets.
 */
export function getShelfLifeRules(
  medicineName: string,
  routeType: string
): {
  unopenedRule: string;
  openedRule: string;
  hasCrucialSealWarning: boolean;
  cautionText: string;
} {
  const lowerName = medicineName.toLowerCase();
  
  if (lowerName.includes('drop') || routeType === 'eye-drops') {
    return {
      unopenedRule: '24 to 36 months from manufacturing date when seal is intact.',
      openedRule: 'STRICT LIMIT: Discard 28 days (4 weeks) after opening the seal. Some post-op drops must be discarded after 7 days.',
      hasCrucialSealWarning: true,
      cautionText: 'Never use eye drops beyond 28 days of breaking the seal. Airborne bacterial contamination can cause severe eye infection.',
    };
  }

  if (lowerName.includes('syrup') || lowerName.includes('suspension') || routeType === 'tonic-shake') {
    return {
      unopenedRule: '24 months from manufacturing date if stored cool.',
      openedRule: 'Reconstituted dry syrups must be consumed within 7 to 10 days and stored in the refrigerator (2-8°C). Liquid tonics within 30 days.',
      hasCrucialSealWarning: true,
      cautionText: 'Always shake the bottle well before pouring the dose. Do not freeze.',
    };
  }

  if (lowerName.includes('chew') || routeType === 'chew-tablet') {
    return {
      unopenedRule: '18 to 24 months from manufacturing date.',
      openedRule: 'Keep blister strips sealed until moment of consumption; protect from moisture.',
      hasCrucialSealWarning: false,
      cautionText: 'Chew thoroughly before swallowing with saliva; do not swallow whole.',
    };
  }

  if (lowerName.includes('dispersible') || routeType === 'dissolve-water') {
    return {
      unopenedRule: '24 months from manufacturing date in sealed foil.',
      openedRule: 'Do not expose strips to humid air.',
      hasCrucialSealWarning: false,
      cautionText: 'Dissolve tablet in 1/2 glass of boiled & cooled water. Stir and drink the entire liquid immediately.',
    };
  }

  // Default solid tablets / capsules (e.g. Pantoprazole P40, Metformin)
  return {
    unopenedRule: '24 to 36 months from manufacturing date stamped on blister foil.',
    openedRule: 'Discard any tablet that shows discoloration, chipping, or if foil packet was punctured.',
    hasCrucialSealWarning: false,
    cautionText: 'Store in a dry place away from direct sunlight and heat. Keep out of reach of children.',
  };
}

/**
 * Explains difference in medicine dosages (e.g., P40 vs P20 vs P60)
 */
export function explainDosageStrength(medicineName: string, dosageStrength: string): string {
  const lower = medicineName.toLowerCase();
  if (lower.includes('pantoprazole') || lower.includes('p40') || lower.includes('p20')) {
    if (dosageStrength.includes('40')) {
      return 'P40 (40 mg) is the standard therapeutic dose for active GERD, erosive gastritis, or healing mucosal lining. P20 is milder for maintenance, while 60mg-80mg is reserved for acute hypersecretory conditions.';
    } else if (dosageStrength.includes('20')) {
      return 'P20 (20 mg) is a low maintenance dose for mild heartburn or acidity prevention.';
    }
  }

  if (lower.includes('paracetamol') || lower.includes('dolo') || lower.includes('crocin')) {
    if (dosageStrength.includes('650')) {
      return '650 mg provides stronger relief for higher fever (>100.5°F) and moderate pain, whereas 500 mg is standard for mild aches.';
    }
  }

  if (lower.includes('metformin')) {
    return `${dosageStrength} is calibrated according to blood sugar and HbA1c elevation to balance glycemic control without causing sudden hypoglycemia.`;
  }

  return `${dosageStrength} has been specifically selected by the physician to match your condition severity and body weight. Do not alter without clinical advice.`;
}

/**
 * Calculates overall patient health indicator score (0 to 100) based on abnormal metrics
 */
export function calculateOverallHealthScore(metrics: LabMetric[]): number {
  if (!metrics || metrics.length === 0) return 100;
  
  let score = 100;
  for (const m of metrics) {
    if (m.status === 'critical-low' || m.status === 'critical-high') {
      score -= 22;
    } else if (m.status === 'low' || m.status === 'high') {
      score -= 10;
    }
  }
  return Math.max(15, Math.min(100, Math.round(score)));
}
