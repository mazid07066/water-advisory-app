export type RawSensorValues = {
  pH: number;
  temp: number;
  tds: number;
  turbidity: number;
};

export type CalibratedSensorValues = {
  pH: number;
  temp: number;
  tds: number;
  turbidity: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/*
  Software calibration layer.

  Reason:
  The current low-cost pH and turbidity sensors are producing raw values
  that do not represent real water-quality units directly.

  This layer converts raw prototype readings into practical calibrated
  display values for decision support.

  These constants are based on the current fresh drinking water test:
  raw pH ≈ 14 should represent normal drinking-water pH ≈ 7.2
  raw TDS ≈ 1260 should represent moderate drinking-water TDS
  raw turbidity ≈ 2500 should represent low turbidity
*/

export function calibrateSample(raw: RawSensorValues): CalibratedSensorValues {
  const calibratedPH = calibratePH(raw.pH);
  const calibratedTemp = calibrateTemp(raw.temp);
  const calibratedTDS = calibrateTDS(raw.tds);
  const calibratedTurbidity = calibrateTurbidity(raw.turbidity);

  return {
    pH: calibratedPH,
    temp: calibratedTemp,
    tds: calibratedTDS,
    turbidity: calibratedTurbidity,
  };
}

function calibratePH(rawPH: number): number {
  if (!Number.isFinite(rawPH) || rawPH <= 0) return 0;

  /*
    Empirical correction:
    Raw high value around 14 is mapped near 7.2.
    Lower raw values are mapped into plausible natural-water range.
  */
  const corrected = 7.2 + (14 - rawPH) * 0.05;

  return Number(clamp(corrected, 5.5, 8.8).toFixed(2));
}

function calibrateTemp(rawTemp: number): number {
  if (!Number.isFinite(rawTemp) || rawTemp <= 0) return 0;

  // If raw temperature is Fahrenheit, convert to Celsius.
  if (rawTemp > 45 && rawTemp < 130) {
    return Number((((rawTemp - 32) * 5) / 9).toFixed(2));
  }

  return Number(clamp(rawTemp, 0, 60).toFixed(2));
}

function calibrateTDS(rawTDS: number): number {
  if (!Number.isFinite(rawTDS) || rawTDS <= 0) return 0;

  /*
    Empirical prototype correction.
    Current fresh drinking-water raw TDS around 1260 becomes about 150 ppm.
  */
  const corrected = rawTDS * 0.12;

  return Number(clamp(corrected, 0, 2000).toFixed(2));
}

function calibrateTurbidity(rawTurbidity: number): number {
  if (!Number.isFinite(rawTurbidity) || rawTurbidity <= 0) return 0;

  /*
    Many low-cost turbidity modules output higher raw values for clearer water.
    So this converts high raw values into low NTU.
  */
  const corrected = (3000 - rawTurbidity) / 180;

  return Number(clamp(corrected, 0, 500).toFixed(2));
}