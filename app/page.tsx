import Link from "next/link";

import DynamicSourceBadge from "@/components/DynamicSourceBadge";
import LocationSourceCard from "@/components/LocationSourceCard";
import ParameterCard from "@/components/ParameterCard";

import { evaluateWater } from "@/lib/advisory";
import {
  formatBanglaDateTime,
  getDeviceStatusInfo,
} from "@/lib/deviceStatus";
import { getLanguage } from "@/lib/getLanguage";
import {
  getDictionary,
  type Language,
} from "@/lib/i18n";
import { fetchLatestSample } from "@/lib/thingspeak";

import type {
  AdvisoryResult,
  DeviceStatusInfo,
  WaterSample,
} from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function statusStyles(
  status: AdvisoryResult["overallStatus"]
): string {
  if (status === "Safe") {
    return "border-emerald-300 bg-emerald-50 text-emerald-950";
  }

  if (status === "Caution") {
    return "border-amber-300 bg-amber-50 text-amber-950";
  }

  if (status === "Sensor Error") {
    return "border-slate-300 bg-slate-100 text-slate-950";
  }

  return "border-rose-300 bg-rose-50 text-rose-950";
}

function statusLabel(
  status: AdvisoryResult["overallStatus"],
  language: Language
): string {
  const dictionary =
    getDictionary(language);

  if (status === "Safe") {
    return dictionary.status.safe;
  }

  if (status === "Caution") {
    return dictionary.status.caution;
  }

  if (status === "Sensor Error") {
    return dictionary.status.sensorError;
  }

  return dictionary.status.unsafe;
}

function deviceStyles(
  device: DeviceStatusInfo
): string {
  if (device.status === "online") {
    return "border-emerald-200 bg-emerald-500/20 text-white";
  }

  if (device.status === "offline") {
    return "border-rose-200 bg-rose-500/25 text-white";
  }

  return "border-amber-200 bg-amber-500/20 text-white";
}

function deviceLabel(
  device: DeviceStatusInfo,
  language: Language
): string {
  const dictionary =
    getDictionary(language);

  if (device.status === "online") {
    return dictionary.status.online;
  }

  if (device.status === "offline") {
    return dictionary.status.offline;
  }

  return dictionary.status.unknown;
}

function formatDateTime(
  value: string,
  language: Language
): string {
  if (language === "bn") {
    return formatBanglaDateTime(value);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone: "Asia/Dhaka",
      dateStyle: "medium",
      timeStyle: "medium",
    }
  ).format(date);
}

async function getPageData(
  language: Language
): Promise<{
  sample: WaterSample | null;
  advisory: AdvisoryResult;
  device: DeviceStatusInfo;
  errorMessage: string | null;
}> {
  try {
    const sample =
      await fetchLatestSample();

    return {
      sample,
      advisory: evaluateWater(
        sample,
        language
      ),
      device: getDeviceStatusInfo(
        sample.createdAt
      ),
      errorMessage: null,
    };
  } catch (error) {
    const fallback: WaterSample = {
      entryId: 0,
      createdAt: "",
      ph: null,
      tds: null,
      temperature: null,
      statusCode: 4,
    };

    return {
      sample: null,

      advisory: evaluateWater(
        fallback,
        language
      ),

      device:
        getDeviceStatusInfo(null),

      errorMessage:
        error instanceof Error
          ? error.message
          : "ThingSpeak data could not be loaded.",
    };
  }
}

export default async function HomePage() {
  const language =
    await getLanguage();

  const dictionary =
    getDictionary(language);

  const {
    sample,
    advisory,
    device,
    errorMessage,
  } = await getPageData(language);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-emerald-50">
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 p-6 text-white shadow-xl md:p-9">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-100">
                {dictionary.home.eyebrow}
              </p>

              <h1 className="mt-2 text-4xl font-black md:text-6xl">
                {dictionary.home.title}
              </h1>

              <p className="mt-3 max-w-3xl text-lg font-medium leading-8 text-blue-50 md:text-xl">
                {dictionary.home.subtitle}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <DynamicSourceBadge
                  language={language}
                />

                <span
                  className={`rounded-full border px-4 py-2 text-base font-bold backdrop-blur ${deviceStyles(
                    device
                  )}`}
                >
                  {dictionary.home.sensor}:{" "}
                  {deviceLabel(
                    device,
                    language
                  )}
                </span>
              </div>

              <p className="mt-4 text-base font-semibold text-blue-50">
                {dictionary.home.lastUpdated}:{" "}
                {sample
                  ? formatDateTime(
                      sample.createdAt,
                      language
                    )
                  : dictionary.home
                      .unknownTime}
              </p>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-blue-100">
                {language === "bn"
                  ? device.descriptionBn
                  : device.status ===
                      "online"
                    ? "Recent data is being received from the sensor."
                    : device.status ===
                        "offline"
                      ? "No new sensor data is being received; the most recently stored values are displayed."
                      : "The current sensor connection is uncertain."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#drinking"
                  className="rounded-2xl bg-emerald-500 px-5 py-3 text-base font-extrabold text-white shadow-lg transition hover:bg-emerald-600"
                >
                  🥤{" "}
                  {
                    dictionary.home
                      .drinkingButton
                  }
                </a>

                <a
                  href="#irrigation"
                  className="rounded-2xl bg-amber-500 px-5 py-3 text-base font-extrabold text-white shadow-lg transition hover:bg-amber-600"
                >
                  🌾{" "}
                  {
                    dictionary.home
                      .irrigationButton
                  }
                </a>

                <Link
                  href="/api/export"
                  className="rounded-2xl bg-white/15 px-5 py-3 text-base font-extrabold text-white shadow-lg backdrop-blur transition hover:bg-white/25"
                >
                  📥{" "}
                  {
                    dictionary.home
                      .downloadButton
                  }
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/25 bg-white/15 p-6 text-center backdrop-blur">
              <p className="text-base font-bold text-blue-50">
                {
                  dictionary.home
                    .currentScore
                }
              </p>

              <p className="mt-2 text-5xl font-black">
                {advisory.score}/100
              </p>

              <p className="mt-2 text-base font-bold">
                {statusLabel(
                  advisory.overallStatus,
                  language
                )}
              </p>
            </div>
          </div>
        </section>

        {errorMessage ? (
          <section className="rounded-3xl border border-amber-300 bg-amber-50 p-5 text-amber-950 shadow-md">
            <h2 className="text-xl font-black">
              {
                dictionary.home
                  .loadErrorTitle
              }
            </h2>

            <p className="mt-2 text-base font-medium">
              {errorMessage}
            </p>
          </section>
        ) : null}

        <section
          className={`rounded-3xl border p-6 shadow-lg md:p-8 ${statusStyles(
            advisory.overallStatus
          )}`}
        >
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="inline-flex rounded-full bg-white/70 px-4 py-2 text-base font-extrabold shadow-sm">
                {
                  dictionary.home
                    .overallStatus
                }
                :{" "}
                {statusLabel(
                  advisory.overallStatus,
                  language
                )}
              </p>

              <h2 className="mt-4 text-3xl font-black md:text-4xl">
                {
                  dictionary.home
                    .decisionTitle
                }
              </h2>

              <p className="mt-3 max-w-4xl text-base font-semibold leading-7 md:text-lg">
                {advisory.summaryBn}
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 px-6 py-4 text-center shadow-sm">
              <p className="text-base font-bold">
                {
                  dictionary.home
                    .safetyScore
                }
              </p>

              <p className="text-4xl font-black">
                {advisory.score}/100
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <ParameterCard
            title={
              dictionary.home.ph
            }
            value={
              sample?.ph ?? null
            }
            icon="🧪"
            decimals={2}
            note={
              advisory.phAssessment
                .messageBn
            }
          />

          <ParameterCard
            title={
              dictionary.home.tds
            }
            value={
              sample?.tds ?? null
            }
            unit="ppm"
            icon="💧"
            decimals={1}
            note={
              dictionary.home.tdsNote
            }
          />

          <ParameterCard
            title={
              dictionary.home
                .temperature
            }
            value={
              sample?.temperature ??
              null
            }
            unit="°C"
            icon="🌡️"
            decimals={1}
            note={
              advisory
                .temperatureAssessment
                .messageBn
            }
          />
        </section>

        <LocationSourceCard
          language={language}
        />

        <section className="grid gap-4 md:grid-cols-2">
          <article
            id="drinking"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
          >
            <h3 className="text-2xl font-black text-slate-950">
              🥤{" "}
              {
                dictionary.home
                  .drinking
              }
            </h3>

            <p className="mt-3 text-lg font-medium leading-8 text-slate-800">
              {advisory.drinking}
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="text-2xl font-black text-slate-950">
              🍲{" "}
              {
                dictionary.home
                  .cooking
              }
            </h3>

            <p className="mt-3 text-lg font-medium leading-8 text-slate-800">
              {advisory.cooking}
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="text-2xl font-black text-slate-950">
              🧼{" "}
              {
                dictionary.home
                  .household
              }
            </h3>

            <p className="mt-3 text-lg font-medium leading-8 text-slate-800">
              {advisory.bathing}
            </p>
          </article>

          <article
            id="irrigation"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
          >
            <h3 className="text-2xl font-black text-slate-950">
              🌾{" "}
              {
                dictionary.home
                  .irrigation
              }
            </h3>

            <p className="mt-3 text-lg font-medium leading-8 text-slate-800">
              {advisory.irrigation}
            </p>
          </article>
        </section>

        <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-md">
          <h3 className="text-xl font-black text-blue-950">
            {
              dictionary.home
                .limitations
            }
          </h3>

          <p className="mt-3 text-base font-semibold leading-7 text-blue-950">
            {
              advisory
                .measurementNoticeBn
            }
          </p>

          <p className="mt-2 text-base font-semibold leading-7 text-blue-950">
            {
              dictionary.home
                .turbidityRemoved
            }
          </p>
        </section>
      </div>
    </main>
  );
}