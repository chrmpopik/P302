export type YearlyTrend = {
  year: string;
  ridership: number;
  recovery: number;
};

export type BoroughData = {
  name: string;
  ridership: number;
  share: number;
  color: string;
};

export type StationRanking = {
  station: string;
  riders: number;
  borough: string;
  change: number | null;
};

export type PaymentMethod = {
  name: string;
  value: number;
  color: string;
};

export type PaymentTrend = {
  year: string;
  omny: number;
  metrocard: number;
};

export type HourlyPattern = {
  hour: string;
  weekday: number;
  weekend: number;
};

export type YearlyHourlyPattern = {
  year: string;
  pattern: HourlyPattern[];
};

export type YearlyStationRankings = {
  year: string;
  rankings: StationRanking[];
};

export type InsightCard = {
  title: string;
  copy: string;
  stat: string;
};

export type MtaDataset = {
  headline: {
    totalRidership: number;
    avgDailyRidership: number;
    rebound: number;
    omnyShare: number;
  };
  yearlyTrend: YearlyTrend[];
  boroughs: BoroughData[];
  stationRankings: StationRanking[];
  stationRankingsByYear: YearlyStationRankings[];
  paymentBreakdown: PaymentMethod[];
  paymentTrend: PaymentTrend[];
  hourlyPattern: HourlyPattern[];
  hourlyPatternByYear: YearlyHourlyPattern[];
  facts: InsightCard[];
};

type RidershipAggregate = {
  ridership?: string | number | null;
};

type YearAggregate = RidershipAggregate & {
  year?: string | number;
};

type BoroughAggregate = RidershipAggregate & {
  borough?: string;
};

type StationAggregate = RidershipAggregate & {
  station_complex?: string;
  borough?: string;
};

type StationYearAggregate = YearAggregate & {
  station_complex?: string;
  borough?: string;
};

type PaymentAggregate = YearAggregate & {
  payment_method?: string;
};

type HourlyAggregate = YearAggregate & {
  hour?: string | number;
  dow?: string | number;
};

const dataYears = ['2020', '2021', '2022', '2023', '2024'];
const hourLabels = ['6a', '8a', '10a', '12p', '3p', '5p', '7p', '9p'];

const boroughColors: Record<string, string> = {
  Manhattan: '#7c3aed',
  Brooklyn: '#22d3ee',
  Queens: '#fbbf24',
  Bronx: '#34d399',
  'Staten Island': '#f97316',
};

const paymentColors: Record<string, string> = {
  omny: '#6ee7b7',
  metrocard: '#8b5cf6',
  'omny tap': '#6ee7b7',
};

function normalizePaymentName(value?: string): string {
  return (value ?? '').trim().toLowerCase();
}

function numberFromRow(value: string | number | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getHourLabel(hours: number): string {
  const meridiem = hours >= 12 ? 'p' : 'a';
  const display = ((hours + 11) % 12) + 1;
  return `${display}${meridiem}`;
}

function buildHourlyPatternFromMaps(weekdayMap: Map<string, number>, weekendMap: Map<string, number>): HourlyPattern[] {
  const maxWeekday = Math.max(...hourLabels.map((hour) => weekdayMap.get(hour) ?? 0), 1);
  const maxWeekend = Math.max(...hourLabels.map((hour) => weekendMap.get(hour) ?? 0), 1);

  return hourLabels.map((hour) => ({
    hour,
    weekday: Number((((weekdayMap.get(hour) ?? 0) / maxWeekday) * 100).toFixed(0)) || 0,
    weekend: Number((((weekendMap.get(hour) ?? 0) / maxWeekend) * 100).toFixed(0)) || 0,
  }));
}

function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

function paymentDisplayName(name: string): string {
  return name === 'omny' ? 'OMNY tap' : 'MetroCard';
}

async function fetchGroupedRows<T>(params: Record<string, string>, signal: AbortSignal): Promise<T[]> {
  const url = new URL('https://data.ny.gov/resource/wujg-7c2s.json');

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url.toString(), {
        signal,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`NY API request failed: ${response.status}`);
      }

      const json = (await response.json()) as T[] | { data?: T[] };
      return Array.isArray(json) ? json : json.data ?? [];
    } catch (error) {
      lastError = error;
      if (signal.aborted) {
        throw error;
      }
      if (attempt < 3) {
        continue;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('NY API request failed.');
}

function buildDatasetFromAggregates({
  annualRows,
  boroughRows,
  stationRows,
  stationChangeRows,
  stationRankingsByYear,
  paymentRows,
  hourlyRows,
}: {
  annualRows: YearAggregate[];
  boroughRows: BoroughAggregate[];
  stationRows: StationAggregate[];
  stationChangeRows: StationYearAggregate[];
  stationRankingsByYear: YearlyStationRankings[];
  paymentRows: PaymentAggregate[];
  hourlyRows: HourlyAggregate[];
}): MtaDataset {
  const annualTotals = new Map(annualRows.map((row) => [String(row.year), numberFromRow(row.ridership)]));
  const maxAnnual = Math.max(...dataYears.map((year) => annualTotals.get(year) ?? 0), 1);
  const latestYear = dataYears[dataYears.length - 1];
  const latestRidership = annualTotals.get(latestYear) ?? 0;

  const yearlyTrend = dataYears.map((year) => {
    const ridership = annualTotals.get(year) ?? 0;

    return {
      year,
      ridership,
      recovery: Math.round((ridership / maxAnnual) * 100),
    };
  });

  const boroughs = boroughRows
    .map((row) => ({
      name: row.borough?.trim() || 'Unknown',
      ridership: numberFromRow(row.ridership),
      share: 0,
      color: boroughColors[row.borough?.trim() || ''] ?? '#94a3b8',
    }))
    .sort((a, b) => b.ridership - a.ridership);

  const totalBoroughRidership = boroughs.reduce((sum, item) => sum + item.ridership, 0) || 1;
  boroughs.forEach((entry) => {
    // Keep full precision here; the UI rounds/formats for display so a tiny real share isn't truncated to 0.
    entry.share = (entry.ridership / totalBoroughRidership) * 100;
  });

  const stationYearTotals = new Map<string, number>();
  stationChangeRows.forEach((row) => {
    const year = String(row.year);
    const station = row.station_complex?.trim() || 'Unknown';
    const key = `${year}::${station}`;
    stationYearTotals.set(key, (stationYearTotals.get(key) ?? 0) + numberFromRow(row.ridership));
  });

  const previousYear = dataYears[dataYears.length - 2];

  const stationRankings = stationRows.map((row) => {
    const station = row.station_complex?.trim() || 'Unknown';
    const latestYearRiders = stationYearTotals.get(`${latestYear}::${station}`);
    const previousYearRiders = previousYear ? stationYearTotals.get(`${previousYear}::${station}`) : undefined;
    const change =
      latestYearRiders != null && previousYearRiders
        ? Number((((latestYearRiders - previousYearRiders) / previousYearRiders) * 100).toFixed(1))
        : null;

    return {
      station,
      riders: numberFromRow(row.ridership),
      borough: row.borough?.trim() || 'Unknown',
      change,
    };
  });

  const paymentTotalsByYear = new Map<string, Map<string, number>>();
  paymentRows.forEach((row) => {
    const year = String(row.year);
    const paymentName = normalizePaymentName(row.payment_method);
    const yearPayments = paymentTotalsByYear.get(year) ?? new Map<string, number>();
    yearPayments.set(paymentName, (yearPayments.get(paymentName) ?? 0) + numberFromRow(row.ridership));
    paymentTotalsByYear.set(year, yearPayments);
  });

  const paymentTrend = dataYears.map((year) => {
    const yearPaymentTotals = paymentTotalsByYear.get(year) ?? new Map<string, number>();
    const omny = yearPaymentTotals.get('omny') ?? yearPaymentTotals.get('omny tap') ?? 0;
    const metrocard = yearPaymentTotals.get('metrocard') ?? 0;
    const total = omny + metrocard || 1;

    return {
      year,
      omny: Number(((omny / total) * 100).toFixed(0)),
      metrocard: Number(((metrocard / total) * 100).toFixed(0)),
    };
  });

  const latestPaymentTotals = paymentTotalsByYear.get(latestYear) ?? new Map<string, number>();
  const latestPaymentTotal = [...latestPaymentTotals.values()].reduce((sum, value) => sum + value, 0) || 1;
  const paymentBreakdown = [...latestPaymentTotals.entries()]
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name: paymentDisplayName(name),
      value: Number(((value / latestPaymentTotal) * 100).toFixed(0)),
      color: paymentColors[name] ?? '#94a3b8',
    }))
    .sort((a, b) => b.value - a.value);

  const hourlyWeekday = new Map<string, number>();
  const hourlyWeekend = new Map<string, number>();
  const hourlyWeekdayByYear = new Map<string, Map<string, number>>();
  const hourlyWeekendByYear = new Map<string, Map<string, number>>();

  hourlyRows.forEach((row) => {
    const year = String(row.year);
    const hour = getHourLabel(Number(row.hour ?? 0));
    const dayOfWeek = Number(row.dow ?? 0);
    const ridership = numberFromRow(row.ridership);
    const isWeekend = [0, 6].includes(dayOfWeek);
    const totalMap = isWeekend ? hourlyWeekend : hourlyWeekday;
    const yearlyMap = isWeekend ? hourlyWeekendByYear : hourlyWeekdayByYear;

    totalMap.set(hour, (totalMap.get(hour) ?? 0) + ridership);
    const yearHourlyTotals = yearlyMap.get(year) ?? new Map<string, number>();
    yearHourlyTotals.set(hour, (yearHourlyTotals.get(hour) ?? 0) + ridership);
    yearlyMap.set(year, yearHourlyTotals);
  });

  const latestPayment = paymentTrend[paymentTrend.length - 1];
  const topBorough = boroughs[0]?.name ?? 'Manhattan';

  return {
    headline: {
      totalRidership: Math.round(latestRidership),
      avgDailyRidership: Math.round(latestRidership / 366),
      rebound: yearlyTrend[yearlyTrend.length - 1]?.recovery ?? 100,
      omnyShare: latestPayment?.omny ?? 0,
    },
    yearlyTrend,
    boroughs,
    stationRankings,
    stationRankingsByYear,
    paymentBreakdown,
    paymentTrend,
    hourlyPattern: buildHourlyPatternFromMaps(hourlyWeekday, hourlyWeekend),
    hourlyPatternByYear: dataYears.map((year) => ({
      year,
      pattern: buildHourlyPatternFromMaps(hourlyWeekdayByYear.get(year) ?? new Map<string, number>(), hourlyWeekendByYear.get(year) ?? new Map<string, number>()),
    })),
    facts: [
      {
        title: 'The comeback was real',
        stat: latestYear,
        copy: `The latest year reached ${yearlyTrend[yearlyTrend.length - 1]?.recovery ?? 100}% of the strongest measured year in this dataset.`,
      },
      {
        title: 'Top entry borough',
        stat: topBorough,
        copy: `${topBorough} stations generated the largest measured share of subway entries.`,
      },
      {
        title: 'OMNY changed the rhythm',
        stat: `${latestPayment?.omny ?? 0}%`,
        copy: `This is the share of measured ${latestYear} subway entries paid with OMNY.`,
      },
      {
        title: 'Daily movement',
        stat: formatCompact(Math.round(latestRidership / 366)),
        copy: `Average daily entries are calculated from total measured ${latestYear} ridership.`,
      },
    ],
  };
}

async function fetchRidershipSnapshotFromApi(): Promise<MtaDataset> {
  const where = "transit_mode='subway' AND transit_timestamp >= '2020-01-01T00:00:00' AND transit_timestamp < '2025-01-01T00:00:00'";

  const controller = new AbortController();
  const timeoutMs = 45000;
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const [annualRows, boroughRows, stationRows, paymentRows, hourlyRows] = await Promise.all([
      fetchGroupedRows<YearAggregate>({
        '$select': 'date_extract_y(transit_timestamp) as year, sum(ridership) as ridership',
        '$where': where,
        '$group': 'date_extract_y(transit_timestamp)',
        '$order': 'year',
      }, controller.signal),
      fetchGroupedRows<BoroughAggregate>({
        '$select': 'borough, sum(ridership) as ridership',
        '$where': where,
        '$group': 'borough',
        '$order': 'ridership DESC',
      }, controller.signal),
      fetchGroupedRows<StationAggregate>({
        '$limit': '5',
        '$select': 'station_complex, borough, sum(ridership) as ridership',
        '$where': where,
        '$group': 'station_complex, borough',
        '$order': 'ridership DESC',
      }, controller.signal),
      fetchGroupedRows<PaymentAggregate>({
        '$select': 'date_extract_y(transit_timestamp) as year, payment_method, sum(ridership) as ridership',
        '$where': where,
        '$group': 'date_extract_y(transit_timestamp), payment_method',
        '$order': 'year, payment_method',
      }, controller.signal),
      fetchGroupedRows<HourlyAggregate>({
        '$select': 'date_extract_y(transit_timestamp) as year, date_extract_hh(transit_timestamp) as hour, date_extract_dow(transit_timestamp) as dow, sum(ridership) as ridership',
        '$where': where,
        '$group': 'date_extract_y(transit_timestamp), date_extract_hh(transit_timestamp), date_extract_dow(transit_timestamp)',
        '$order': 'year, hour, dow',
      }, controller.signal),
    ]);

    if (!annualRows.length) {
      throw new Error('NY Open Data returned no ridership rows for the requested range.');
    }

    const previousYear = dataYears[dataYears.length - 2];
    const topStationNames = stationRows.map((row) => (row.station_complex ?? '').trim()).filter(Boolean);
    const stationChangeRows = topStationNames.length
      ? await fetchGroupedRows<StationYearAggregate>({
          '$select': 'date_extract_y(transit_timestamp) as year, station_complex, sum(ridership) as ridership',
          '$where': `transit_mode='subway' AND transit_timestamp >= '${previousYear}-01-01T00:00:00' AND transit_timestamp < '${
            Number(dataYears[dataYears.length - 1]) + 1
          }-01-01T00:00:00' AND station_complex in (${topStationNames.map((name) => `'${name.replace(/'/g, "''")}'`).join(', ')})`,
          '$group': 'date_extract_y(transit_timestamp), station_complex',
          '$order': 'year',
        }, controller.signal)
      : [];

    window.clearTimeout(timeout);

    const stationRankingsByYear: YearlyStationRankings[] = dataYears.map((year) => ({ year, rankings: [] }));

    return buildDatasetFromAggregates({
      annualRows,
      boroughRows,
      stationRows,
      stationChangeRows,
      stationRankingsByYear,
      paymentRows,
      hourlyRows,
    });
  } catch (error) {
    window.clearTimeout(timeout);
    throw error instanceof Error ? error : new Error('Failed to load ridership data from the NY Open Data API.');
  }
}

export async function loadRidershipSnapshot(): Promise<MtaDataset> {
  return fetchRidershipSnapshotFromApi();
}

export const rankingYears = dataYears;

export async function fetchStationRankingsForYear(year: string, signal?: AbortSignal): Promise<StationRanking[]> {
  const rows = await fetchGroupedRows<StationAggregate>({
    '$limit': '5',
    '$select': 'station_complex, borough, sum(ridership) as ridership',
    '$where': `transit_mode='subway' AND transit_timestamp >= '${year}-01-01T00:00:00' AND transit_timestamp < '${Number(year) + 1}-01-01T00:00:00'`,
    '$group': 'station_complex, borough',
    '$order': 'ridership DESC',
  }, signal ?? new AbortController().signal);

  return rows.map((row) => ({
    station: row.station_complex?.trim() || 'Unknown',
    riders: numberFromRow(row.ridership),
    borough: row.borough?.trim() || 'Unknown',
    change: null,
  }));
}
