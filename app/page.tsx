import Link from "next/link";
import LocationSourceCard from "@/components/LocationSourceCard";
import ParameterCard from "@/components/ParameterCard";
import { evaluateWater } from "@/lib/advisory";
import {
  formatBanglaDateTime,
  getDeviceStatusInfo,
} from "@/lib/deviceStatus";
import { fetchLatestSample } from "@/lib/thingspeak";
import type {
  AdvisoryResult,
  DeviceStatusInfo,
  WaterSample,
} from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SOURCE_NAME =
  process.env.NEXT_PUBLIC_SOURCE_NAME || "ব্রহ্মপুত্র অঞ্চল";

function statusStyles(status: AdvisoryResult["overallStatus"]): string {
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

function statusLabel(status: AdvisoryResult["overallStatus"]): string {
  if (status === "Safe") return "তুলনামূলকভাবে গ্রহণযোগ্য";
  if (status === "Caution") return "সতর্কতা প্রয়োজন";
  if (status === "Sensor Error") return "সেন্সর ত্রুটি";
  return "অনিরাপদ";
}

function deviceStyles(device: DeviceStatusInfo): string {
  if (device.status === "online") {
    return "border-emerald-200 bg-emerald-500/20 text-white";
  }

  if (device.status === "offline") {
    return "border-rose-200 bg-rose-500/25 text-white";
  }

  return "border-amber-200 bg-amber-500/20 text-white";
}

async function getPageData(): Promise<{
  sample: WaterSample | null;
  advisory: AdvisoryResult;
  device: DeviceStatusInfo;
  errorMessage: string | null;
}> {
  try {
    const sample = await fetchLatestSample();
    const advisory = evaluateWater(sample);
    const device = getDeviceStatusInfo(sample.createdAt);

    return {
      sample,
      advisory,
      device,
      errorMessage: null,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "ThingSpeak data could not be loaded.";

    const sample: WaterSample = {
  entryId: 0,
  createdAt: "",
  ph: null,
  tds: null,
  temperature: null,
  statusCode: 4,
};

    return {
      sample: null,
      advisory: evaluateWater(sample),
      device: getDeviceStatusInfo(null),
      errorMessage: message,
    };
  }
}

export default async function HomePage() {
  const { sample, advisory, device, errorMessage } =
    await getPageData();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-emerald-50">
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 p-6 text-white shadow-xl md:p-9">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-100">
                Pani Bondhu · Water Advisor
              </p>

              <h1 className="mt-2 text-4xl font-black md:text-6xl">
                পানিবন্ধু
              </h1>

              <p className="mt-3 max-w-3xl text-lg font-medium leading-8 text-blue-50 md:text-xl">
                pH, আনুমানিক TDS ও তাপমাত্রার ভিত্তিতে সহজ ভাষায়
                পানি ব্যবহারের প্রাথমিক পরামর্শ
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-base font-bold backdrop-blur">
                  📍 উৎস: {SOURCE_NAME}
                </span>

                <span
                  className={`rounded-full border px-4 py-2 text-base font-bold backdrop-blur ${deviceStyles(
                    device
                  )}`}
                >
                  সেন্সর: {device.labelBn}
                </span>
              </div>

              <p className="mt-4 text-base font-semibold text-blue-50">
                সর্বশেষ আপডেট:{" "}
                {sample
                  ? formatBanglaDateTime(sample.createdAt)
                  : "সময় পাওয়া যায়নি"}
              </p>

              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-blue-100">
                {device.descriptionBn}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#drinking"
                  className="rounded-2xl bg-emerald-500 px-5 py-3 text-base font-extrabold text-white shadow-lg transition hover:bg-emerald-600"
                >
                  🥤 পান করা যাবে?
                </a>

                <a
                  href="#irrigation"
                  className="rounded-2xl bg-amber-500 px-5 py-3 text-base font-extrabold text-white shadow-lg transition hover:bg-amber-600"
                >
                  🌾 সেচে ব্যবহার?
                </a>

                <Link
                  href="/api/export"
                  className="rounded-2xl bg-white/15 px-5 py-3 text-base font-extrabold text-white shadow-lg backdrop-blur transition hover:bg-white/25"
                >
                  📥 ডেটা ডাউনলোড
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/25 bg-white/15 p-6 text-center backdrop-blur">
              <p className="text-base font-bold text-blue-50">
                বর্তমান নিরাপত্তা স্কোর
              </p>

              <p className="mt-2 text-5xl font-black">
                {advisory.score}/100
              </p>

              <p className="mt-2 text-base font-bold">
                {statusLabel(advisory.overallStatus)}
              </p>
            </div>
          </div>
        </section>

        {errorMessage ? (
          <section className="rounded-3xl border border-amber-300 bg-amber-50 p-5 text-amber-950 shadow-md">
            <h2 className="text-xl font-black">
              সর্বশেষ ডেটা আনা যায়নি
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
                সামগ্রিক অবস্থা: {statusLabel(advisory.overallStatus)}
              </p>

              <h2 className="mt-4 text-3xl font-black md:text-4xl">
                পানির মানের সিদ্ধান্ত
              </h2>

              <p className="mt-3 max-w-4xl text-base font-semibold leading-7 md:text-lg">
                {advisory.summaryBn}
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 px-6 py-4 text-center shadow-sm">
              <p className="text-base font-bold">নিরাপত্তা স্কোর</p>
              <p className="text-4xl font-black">{advisory.score}/100</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <ParameterCard
            title="pH"
            value={sample?.ph ?? null}
            icon="🧪"
            decimals={2}
            note={advisory.phAssessment.messageBn}
          />

          <ParameterCard
            title="আনুমানিক TDS"
            value={sample?.tds ?? null}
            unit="ppm"
            icon="💧"
            decimals={1}
            note="DFRobot সমীকরণ ও অস্থায়ী সংশোধন ফ্যাক্টরভিত্তিক মান"
          />

          <ParameterCard
            title="তাপমাত্রা"
            value={sample?.temperature ?? null}
            unit="°C"
            icon="🌡️"
            decimals={1}
            note={advisory.temperatureAssessment.messageBn}
          />
        </section>
        <LocationSourceCard />

        <section className="grid gap-4 md:grid-cols-2">
          <article
            id="drinking"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
          >
            <h3 className="text-2xl font-black text-slate-950">
              🥤 পান করা
            </h3>

            <p className="mt-3 text-lg font-medium leading-8 text-slate-800">
              {advisory.drinking}
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="text-2xl font-black text-slate-950">
              🍲 রান্না
            </h3>

            <p className="mt-3 text-lg font-medium leading-8 text-slate-800">
              {advisory.cooking}
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="text-2xl font-black text-slate-950">
              🧼 গোসল ও গৃহস্থালি
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
              🌾 কৃষি ও সেচ
            </h3>

            <p className="mt-3 text-lg font-medium leading-8 text-slate-800">
              {advisory.irrigation}
            </p>
          </article>
        </section>

        <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-md">
          <h3 className="text-xl font-black text-blue-950">
            পরিমাপের সীমাবদ্ধতা
          </h3>

          <p className="mt-3 text-base font-semibold leading-7 text-blue-950">
            {advisory.measurementNoticeBn}
          </p>

          <p className="mt-2 text-base font-semibold leading-7 text-blue-950">
            টার্বিডিটি সেন্সর বর্তমান হার্ডওয়্যার সংস্করণ থেকে সরানো হয়েছে।
            ফলে কোনো NTU বা turbidity ফলাফল প্রদর্শন করা হচ্ছে না।
          </p>
        </section>
      </div>
    </main>
  );
}