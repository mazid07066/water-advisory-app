import { fetchHistorySamples } from "@/lib/thingspeak";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function csvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value).replaceAll('"', '""');

  return `"${text}"`;
}

export async function GET() {
  try {
    const samples = await fetchHistorySamples(1000);

    const header = [
      "entry_id",
      "created_at_utc",
      "ph",
      "estimated_tds_ppm",
      "temperature_c",
      "status_code",
    ];

    const rows = samples.map((sample) =>
      [
        sample.entryId,
        sample.createdAt,
        sample.ph,
        sample.tds,
        sample.temperature,
        sample.statusCode,
      ]
        .map(csvCell)
        .join(",")
    );

    const csv = [header.join(","), ...rows].join("\n");

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="pani-bondhu-water-data.csv"',
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to export data.";

    return new Response(message, {
      status: 503,
    });
  }
}