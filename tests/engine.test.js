/**
 * NIVIS - Engine Test Suite
 * Terminalden tek komutla çalıştırma: node tests/engine.test.js
 */

const assert = require('assert');
const NivisEngine = require('../src/engine.js');

let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failedTests++;
  }
}

console.log('\n--- NIVIS SCIENTIFIC ENGINE UNIT TESTS ---\n');

// 1. BMI & Baysal (2022) Tests
test('BMI Calculation: 76 kg, 178 cm -> ~23.98', () => {
  const bmi = NivisEngine.calculateBmi(76, 178);
  assert.ok(Math.abs(bmi - 23.986) < 0.01, `Expected ~23.986, got ${bmi}`);
});

test('BMI Zero/Negative Height Protection: should return 0, no NaN or Infinity', () => {
  assert.strictEqual(NivisEngine.calculateBmi(76, 0), 0);
  assert.strictEqual(NivisEngine.calculateBmi(76, -170), 0);
});

test('Ideal BMI for 28 years -> 22.0', () => {
  const idealBmi = NivisEngine.getIdealBmi(28);
  assert.strictEqual(idealBmi, 22.0);
});

test('Adjusted Body Weight (Obese condition): Weight=110kg, Height=175cm, Age=30', () => {
  const height = 175;
  const weight = 110;
  const bmi = NivisEngine.calculateBmi(weight, height);
  assert.ok(bmi >= 30, 'Should be >= 30 BMI');
  
  const idealBmi = NivisEngine.getIdealBmi(30); // 22
  const idealWeight = NivisEngine.calculateIdealWeight(idealBmi, height); // 22 * 1.75^2 = 67.375
  const adjWeight = NivisEngine.calculateAdjustedWeight(weight, idealWeight);
  
  // adjWeight = 67.375 + 0.25*(110 - 67.375) = 78.03
  assert.ok(Math.abs(adjWeight - 78.03) < 0.1, `Expected ~78.03, got ${adjWeight}`);
});

test('Waist Circumference Risk Evaluation (Baysal 2022)', () => {
  // Male: <94 normal, 94-101.9 warning, >=102 danger
  assert.strictEqual(NivisEngine.evaluateWaist('male', 88).level, 'normal');
  assert.strictEqual(NivisEngine.evaluateWaist('male', 96).level, 'warning');
  assert.strictEqual(NivisEngine.evaluateWaist('male', 104).level, 'danger');

  // Female: <80 normal, 80-87.9 warning, >=88 danger
  assert.strictEqual(NivisEngine.evaluateWaist('female', 75).level, 'normal');
  assert.strictEqual(NivisEngine.evaluateWaist('female', 82).level, 'warning');
  assert.strictEqual(NivisEngine.evaluateWaist('female', 92).level, 'danger');
});

// 2. Mifflin-St Jeor BMR Tests
test('Mifflin-St Jeor: Male 76kg, 178cm, 28y -> 1737.5 kcal', () => {
  // 10*76 + 6.25*178 - 5*28 + 5 = 760 + 1112.5 - 140 + 5 = 1737.5
  const bmr = NivisEngine.calculateBmr('male', 76, 178, 28);
  assert.strictEqual(bmr, 1737.5);
});

test('Mifflin-St Jeor: Female 60kg, 165cm, 25y -> 1345.25 kcal', () => {
  // 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25
  const bmr = NivisEngine.calculateBmr('female', 60, 165, 25);
  assert.strictEqual(bmr, 1345.25);
});

// 3. Polar Multipliers
test('Cold Multipliers: van Ooijen & Huo tables', () => {
  assert.strictEqual(NivisEngine.getColdMultiplier(12), 1.00);
  assert.strictEqual(NivisEngine.getColdMultiplier(8), 1.03);
  assert.strictEqual(NivisEngine.getColdMultiplier(2), 1.05);
  assert.strictEqual(NivisEngine.getColdMultiplier(-5), 1.08);
  assert.strictEqual(NivisEngine.getColdMultiplier(-15), 1.12);
  assert.strictEqual(NivisEngine.getColdMultiplier(-35), 1.15);
});

test('Wind Multipliers: Haymes table', () => {
  assert.strictEqual(NivisEngine.getWindMultiplier(0.5), 1.00);
  assert.strictEqual(NivisEngine.getWindMultiplier(2.5), 1.03);
  assert.strictEqual(NivisEngine.getWindMultiplier(4.5), 1.07);
  assert.strictEqual(NivisEngine.getWindMultiplier(10.0), 1.12);
});

// 4. NOAA Wind Chill
test('NOAA Wind Chill Formula: -15°C at 4.5 m/s (16.2 km/h) -> ~ -23.4°C', () => {
  const wc = NivisEngine.calculateWindChill(-15, 4.5);
  assert.ok(Math.abs(wc - (-23.4)) < 0.5, `Expected ~ -23.4, got ${wc}`);
});

test('Frostbite Risk: -23.4°C classified as moderate (cover skin)', () => {
  const risk = NivisEngine.getFrostbiteRisk(-23.4);
  assert.strictEqual(risk.level, 'moderate');
});

test('Frostbite Risk: Extreme cold -58°C classified as critical (2-5 min hazard)', () => {
  const risk = NivisEngine.getFrostbiteRisk(-58);
  assert.strictEqual(risk.level, 'critical');
});

// 5. Full Pipeline Output Integrity & Edge Cases
test('Full Pipeline: computeAll with standard inputs', () => {
  const res = NivisEngine.computeAll({
    gender: 'male',
    age: 28,
    height: 178,
    weight: 76,
    waist: 84,
    activity: 1.55,
    temp: -15,
    wind: 4.5
  });

  assert.ok(res.biometrics.bmi > 23);
  assert.ok(res.pipeline.finalKcal > 3000);
  assert.ok(res.nutrition.macros.carb.pct === 48.5);
  assert.ok(res.nutrition.macros.protein.pct === 14.5);
  assert.ok(res.nutrition.macros.fat.pct === 37.0);
  assert.strictEqual(res.nutrition.rations.length, 4);
});

test('Full Pipeline: computeAll with empty/garbage input triggers safe sanitization fallback', () => {
  const res = NivisEngine.computeAll({});
  assert.ok(res.pipeline.finalKcal > 0, 'Should not produce NaN or 0');
  assert.ok(!isNaN(res.biometrics.bmi), 'BMI should be a valid number');
  assert.ok(res.nutrition.hydrationLiters >= 3.5, 'Hydration should be >= 3.5 L');
});

console.log(`\nResults: ${passedTests} passed, ${failedTests} failed.`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('✓ ALL ENGINE & EDGE CASE TESTS PASSED!\n');
}
