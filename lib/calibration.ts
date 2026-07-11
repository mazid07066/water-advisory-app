export type RawSensorValues = {
  pH: number;
  temp: number;
  tds: number;
};

export type CalibratedSensorValues = {
  pH: number;
  temp: number;
  tds: number;
};

function finiteOrZero(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

/*
  Calibration is performed on the Arduino.

  The web application must not apply a second empirical
  correction to the measurements.
*/
export function calibrateSample(
  raw: RawSensorValues
): CalibratedSensorValues {
  return {
    pH: finiteOrZero(raw.pH),
    temp: finiteOrZero(raw.temp),
    tds: finiteOrZero(raw.tds),
  };
}