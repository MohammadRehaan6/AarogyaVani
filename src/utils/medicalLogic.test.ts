import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateLabMetric,
  getShelfLifeRules,
  explainDosageStrength,
  calculateOverallHealthScore,
} from './medicalLogic';
import { LabMetric } from '../types';

test('evaluateLabMetric classifies normal range correctly', () => {
  // Healthy RBC is typically 4.5 - 5.5, baseline 5.0
  const result = evaluateLabMetric(4.8, 4.5, 5.5, 5.0, 'Red Blood Cells (RBC)', 'million/mcL');
  assert.equal(result.isHealthy, true);
  assert.equal(result.status, 'normal');
  assert.equal(result.badgeColor, 'emerald');
});

test('evaluateLabMetric identifies low RBC count and computes variance', () => {
  // Patient RBC is 3.2, healthy baseline is 5.0
  const result = evaluateLabMetric(3.2, 4.5, 5.5, 5.0, 'Red Blood Cells (RBC)', 'million/mcL');
  assert.equal(result.isHealthy, false);
  assert.equal(result.status, 'critical-low');
  assert.equal(result.percentageVariance, -36);
  assert.ok(result.humanComparisonSummary.includes('lower than healthy baseline'));
});

test('getShelfLifeRules warns strictly for eye drops post-opening', () => {
  const eyeDropRules = getShelfLifeRules('Moxifloxacin Eye Drops', 'eye-drops');
  assert.equal(eyeDropRules.hasCrucialSealWarning, true);
  assert.ok(eyeDropRules.openedRule.includes('28 days'));
});

test('explainDosageStrength distinguishes Pantoprazole P40 vs P20', () => {
  const p40Explanation = explainDosageStrength('Pantoprazole P40', '40 mg');
  assert.ok(p40Explanation.includes('P40 (40 mg)'));
  assert.ok(p40Explanation.includes('P20'));
});

test('calculateOverallHealthScore reflects critical drops appropriately', () => {
  const mockMetrics: LabMetric[] = [
    {
      id: 'm1',
      name: 'RBC',
      category: 'Blood & Hematology',
      patientValue: 3.2,
      unit: 'million/mcL',
      healthyNormalMin: 4.5,
      healthyNormalMax: 5.5,
      healthyIdealBaseline: 5.0,
      healthyBaselineNote: 'Normal healthy baseline',
      status: 'critical-low',
      percentageVariance: -36,
      plainExplanation: 'Low RBC means less oxygen transport.',
      organAffected: 'Blood / Bone Marrow',
    },
    {
      id: 'm2',
      name: 'Hemoglobin',
      category: 'Blood & Hematology',
      patientValue: 8.4,
      unit: 'g/dL',
      healthyNormalMin: 12.0,
      healthyNormalMax: 15.5,
      healthyIdealBaseline: 14.0,
      healthyBaselineNote: 'Optimal healthy range',
      status: 'critical-low',
      percentageVariance: -40,
      plainExplanation: 'Severe anemia level.',
      organAffected: 'Red blood cells',
    },
  ];

  const score = calculateOverallHealthScore(mockMetrics);
  // Score starts at 100, drops 22 for each critical-low
  assert.equal(score, 56);
});
