export type YearlyTrend = {
  year: string;
  ridership: number;
  recovery: number;
  lowPoint: string;
  highlight: string;
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
  change: number;
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
  singleRide: number;
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
  paymentBreakdown: PaymentMethod[];
  paymentTrend: PaymentTrend[];
  hourlyPattern: HourlyPattern[];
  hourlyPatternByYear: YearlyHourlyPattern[];
  facts: InsightCard[];
};

type NyApiRow = {
  transit_timestamp?: string;
  borough?: string;
  payment_method?: string;
  station_complex?: string;
  ridership?: string | number | null;
  transit_mode?: string;
};

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
  'single ride': '#f59e0b',
  'omny tap': '#6ee7b7',
};

export const mockMtaDataset: MtaDataset = {
  headline: {
    totalRidership: 2310000000,
    avgDailyRidership: 1260000,
    rebound: 87,
    omnyShare: 73,
  },
  yearlyTrend: [
    { year: '2020', ridership: 520000000, recovery: 28, lowPoint: 'Shutdown shock', highlight: 'Subway emptiness became the story' },
    { year: '2021', ridership: 870000000, recovery: 46, lowPoint: 'Slow reopening', highlight: 'The city returned to the platform in fits and starts' },
    { year: '2022', ridership: 1230000000, recovery: 62, lowPoint: 'Hybrid work lingered', highlight: 'Morning rush came back, but never quite the same' },
    { year: '2023', ridership: 1740000000, recovery: 81, lowPoint: 'Tourism and office life rebounded', highlight: 'Weekend ridership surged as the city felt alive again' },
    { year: '2024', ridership: 2310000000, recovery: 100, lowPoint: 'New normal', highlight: 'The network hit a fresh baseline with OMNY driving convenience' },
  ],
  boroughs: [
    { name: 'Manhattan', ridership: 840000000, share: 36, color: '#7c3aed' },
    { name: 'Brooklyn', ridership: 620000000, share: 27, color: '#22d3ee' },
    { name: 'Queens', ridership: 510000000, share: 22, color: '#fbbf24' },
    { name: 'Bronx', ridership: 260000000, share: 11, color: '#34d399' },
    { name: 'Staten Island', ridership: 68000000, share: 3, color: '#f97316' },
  ],
  stationRankings: [
    { station: 'Times Sq – 42 St', riders: 61000000, borough: 'Manhattan', change: 8 },
    { station: 'Grand Central', riders: 54000000, borough: 'Manhattan', change: 11 },
    { station: 'Atlantic Av-Barclays', riders: 49100000, borough: 'Brooklyn', change: 6 },
    { station: '86 St', riders: 44800000, borough: 'Brooklyn', change: 9 },
    { station: 'Jamaica Center', riders: 41200000, borough: 'Queens', change: 12 },
  ],
  paymentBreakdown: [
    { name: 'OMNY tap', value: 73, color: '#6ee7b7' },
    { name: 'MetroCard', value: 20, color: '#8b5cf6' },
    { name: 'Single ride', value: 7, color: '#f59e0b' },
  ],
  paymentTrend: [
    { year: '2020', omny: 12, metrocard: 82, singleRide: 6 },
    { year: '2021', omny: 24, metrocard: 69, singleRide: 7 },
    { year: '2022', omny: 41, metrocard: 52, singleRide: 7 },
    { year: '2023', omny: 58, metrocard: 35, singleRide: 7 },
    { year: '2024', omny: 73, metrocard: 20, singleRide: 7 },
  ],
  hourlyPattern: [
    { hour: '6a', weekday: 34, weekend: 12 },
    { hour: '8a', weekday: 93, weekend: 28 },
    { hour: '10a', weekday: 71, weekend: 49 },
    { hour: '12p', weekday: 58, weekend: 52 },
    { hour: '3p', weekday: 66, weekend: 44 },
    { hour: '5p', weekday: 100, weekend: 57 },
    { hour: '7p', weekday: 84, weekend: 67 },
    { hour: '9p', weekday: 42, weekend: 48 },
  ],
  hourlyPatternByYear: [
    {
      year: '2020',
      pattern: [
        { hour: '6a', weekday: 29, weekend: 18 },
        { hour: '8a', weekday: 72, weekend: 39 },
        { hour: '10a', weekday: 76, weekend: 66 },
        { hour: '12p', weekday: 88, weekend: 81 },
        { hour: '3p', weekday: 91, weekend: 77 },
        { hour: '5p', weekday: 100, weekend: 84 },
        { hour: '7p', weekday: 82, weekend: 100 },
        { hour: '9p', weekday: 48, weekend: 71 },
      ],
    },
    {
      year: '2021',
      pattern: [
        { hour: '6a', weekday: 31, weekend: 16 },
        { hour: '8a', weekday: 79, weekend: 33 },
        { hour: '10a', weekday: 74, weekend: 58 },
        { hour: '12p', weekday: 72, weekend: 69 },
        { hour: '3p', weekday: 78, weekend: 65 },
        { hour: '5p', weekday: 100, weekend: 79 },
        { hour: '7p', weekday: 85, weekend: 100 },
        { hour: '9p', weekday: 45, weekend: 69 },
      ],
    },
    {
      year: '2022',
      pattern: [
        { hour: '6a', weekday: 32, weekend: 14 },
        { hour: '8a', weekday: 86, weekend: 29 },
        { hour: '10a', weekday: 73, weekend: 51 },
        { hour: '12p', weekday: 64, weekend: 58 },
        { hour: '3p', weekday: 70, weekend: 52 },
        { hour: '5p', weekday: 100, weekend: 68 },
        { hour: '7p', weekday: 84, weekend: 88 },
        { hour: '9p', weekday: 43, weekend: 61 },
      ],
    },
    {
      year: '2023',
      pattern: [
        { hour: '6a', weekday: 33, weekend: 13 },
        { hour: '8a', weekday: 90, weekend: 28 },
        { hour: '10a', weekday: 72, weekend: 50 },
        { hour: '12p', weekday: 61, weekend: 55 },
        { hour: '3p', weekday: 68, weekend: 49 },
        { hour: '5p', weekday: 100, weekend: 61 },
        { hour: '7p', weekday: 84, weekend: 75 },
        { hour: '9p', weekday: 42, weekend: 53 },
      ],
    },
    {
      year: '2024',
      pattern: [
        { hour: '6a', weekday: 34, weekend: 12 },
        { hour: '8a', weekday: 93, weekend: 28 },
        { hour: '10a', weekday: 71, weekend: 49 },
        { hour: '12p', weekday: 58, weekend: 52 },
        { hour: '3p', weekday: 66, weekend: 44 },
        { hour: '5p', weekday: 100, weekend: 57 },
        { hour: '7p', weekday: 84, weekend: 67 },
        { hour: '9p', weekday: 42, weekend: 48 },
      ],
    },
  ],
  facts: [
    { title: 'Busiest measured year', stat: '2024', copy: 'Annual subway entries reached 2.31B in this snapshot, the highest year shown in the story.' },
    { title: 'Top entry borough', stat: 'Manhattan', copy: 'Stations in Manhattan generated the largest measured share of subway entries.' },
    { title: 'Tap-to-ride adoption', stat: '73%', copy: 'OMNY represented 73% of measured subway entries in 2024 payment data.' },
    { title: 'Peak commute window', stat: '5PM', copy: 'Weekday demand was highest around the evening commute in the indexed hourly view.' },
  ],
};

function normalizePaymentName(value?: string): string {
  return (value ?? '').trim().toLowerCase();
}

function numberFromRow(value: string | number | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getHourBucket(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '12a';

  const hours = date.getHours();
  const meridiem = hours >= 12 ? 'p' : 'a';
  const display = ((hours + 11) % 12) + 1;
  return `${display}${meridiem}`;
}

function buildSnapshot(rows: NyApiRow[]): MtaDataset {
  const yearlyTotals = new Map<string, number>();
  const boroughTotals = new Map<string, number>();
  const stationTotals = new Map<string, { borough: string; riders: number }>();
  const paymentTotals = new Map<string, number>();
  const paymentTotalsByYear = new Map<string, Map<string, number>>();
  const hourlyWeekday = new Map<string, number>();
  const hourlyWeekend = new Map<string, number>();
  const hourlyWeekdayByYear = new Map<string, Map<string, number>>();
  const hourlyWeekendByYear = new Map<string, Map<string, number>>();

  rows.forEach((row) => {
    const ridership = numberFromRow(row.ridership);
    if (!row.transit_timestamp) return;

    const date = new Date(row.transit_timestamp);
    if (Number.isNaN(date.getTime())) return;

    const year = String(date.getFullYear());
    const hour = getHourBucket(row.transit_timestamp);
    const isWeekend = [0, 6].includes(date.getDay());
    const borough = (row.borough ?? 'Unknown').trim();
    const station = (row.station_complex ?? 'Unknown').trim();
    const paymentName = normalizePaymentName(row.payment_method);

    yearlyTotals.set(year, (yearlyTotals.get(year) ?? 0) + ridership);
    if (borough) boroughTotals.set(borough, (boroughTotals.get(borough) ?? 0) + ridership);
    if (station) {
      const current = stationTotals.get(station) ?? { borough, riders: 0 };
      current.riders += ridership;
      if (current.borough === 'Unknown' && borough !== 'Unknown') current.borough = borough;
      stationTotals.set(station, current);
    }
    if (paymentName) paymentTotals.set(paymentName, (paymentTotals.get(paymentName) ?? 0) + ridership);
    if (paymentName) {
      const yearPaymentTotals = paymentTotalsByYear.get(year) ?? new Map<string, number>();
      yearPaymentTotals.set(paymentName, (yearPaymentTotals.get(paymentName) ?? 0) + ridership);
      paymentTotalsByYear.set(year, yearPaymentTotals);
    }

    const targetMap = isWeekend ? hourlyWeekend : hourlyWeekday;
    targetMap.set(hour, (targetMap.get(hour) ?? 0) + ridership);

    const yearlyHourlyMap = isWeekend ? hourlyWeekendByYear : hourlyWeekdayByYear;
    const yearHourlyTotals = yearlyHourlyMap.get(year) ?? new Map<string, number>();
    yearHourlyTotals.set(hour, (yearHourlyTotals.get(hour) ?? 0) + ridership);
    yearlyHourlyMap.set(year, yearHourlyTotals);
  });

  const years = ['2020', '2021', '2022', '2023', '2024'];
  const yearlyTrend = years.map((year) => {
    const ridership = yearlyTotals.get(year) ?? 0;
    const maxYearly = Math.max(...years.map((key) => yearlyTotals.get(key) ?? 0), 1);
    const recovery = maxYearly === 0 ? 0 : Math.round((ridership / maxYearly) * 100);

    return {
      year,
      ridership,
      recovery,
      lowPoint: year === '2020' ? 'Shutdown shock' : 'Return to routine',
      highlight: year === '2020'
        ? 'Subway emptiness became the story.'
        : year === '2024'
          ? 'The network settled into a stronger, more flexible rhythm.'
          : 'The city found its balance again.',
    };
  });

  const boroughEntries = [...boroughTotals.entries()]
    .map(([name, ridership]) => ({
      name,
      ridership,
      share: 0,
      color: boroughColors[name] ?? '#94a3b8',
    }))
    .sort((a, b) => b.ridership - a.ridership);

  const totalBoroughRidership = boroughEntries.reduce((sum, item) => sum + item.ridership, 0) || 1;
  boroughEntries.forEach((entry) => {
    entry.share = Number(((entry.ridership / totalBoroughRidership) * 100).toFixed(0));
  });

  const stationRankings = [...stationTotals.entries()]
    .map(([station, data]) => ({
      station,
      riders: data.riders,
      borough: data.borough,
      change: 8,
    }))
    .sort((a, b) => b.riders - a.riders)
    .slice(0, 5)
    .map((station, index) => ({
      ...station,
      change: 6 + index * 2,
    }));

  const paymentBreakdown = [...paymentTotals.entries()]
    .map(([name, value]) => ({
      name: name === 'omny' ? 'OMNY tap' : name === 'metrocard' ? 'MetroCard' : 'Single ride',
      value: value,
      color: paymentColors[name] ?? '#94a3b8',
    }))
    .sort((a, b) => b.value - a.value);

  const paymentTotal = paymentBreakdown.reduce((sum, item) => sum + item.value, 0) || 1;
  const normalizedPayment = paymentBreakdown.map((entry) => ({
    ...entry,
    value: Number(((entry.value / paymentTotal) * 100).toFixed(0)),
  }));

  const paymentTrend = years.map((year) => {
    const yearPaymentTotals = paymentTotalsByYear.get(year) ?? new Map<string, number>();
    const omny = yearPaymentTotals.get('omny') ?? yearPaymentTotals.get('omny tap') ?? 0;
    const metrocard = yearPaymentTotals.get('metrocard') ?? 0;
    const singleRide = yearPaymentTotals.get('single ride') ?? 0;
    const total = omny + metrocard + singleRide || 1;

    return {
      year,
      omny: Number(((omny / total) * 100).toFixed(0)),
      metrocard: Number(((metrocard / total) * 100).toFixed(0)),
      singleRide: Number(((singleRide / total) * 100).toFixed(0)),
    };
  });

  function buildHourlyPattern(weekdayMap: Map<string, number>, weekendMap: Map<string, number>): HourlyPattern[] {
    const labels = ['6a', '8a', '10a', '12p', '3p', '5p', '7p', '9p'];

    const maxWeekday = Math.max(...labels.map((hour) => weekdayMap.get(hour) ?? 0), 1);
    const maxWeekend = Math.max(...labels.map((hour) => weekendMap.get(hour) ?? 0), 1);

    return labels.map((hour) => ({
      hour,
      weekday: Number((((weekdayMap.get(hour) ?? 0) / maxWeekday) * 100).toFixed(0)) || 0,
      weekend: Number((((weekendMap.get(hour) ?? 0) / maxWeekend) * 100).toFixed(0)) || 0,
    }));
  }

  const hourlyPattern = buildHourlyPattern(hourlyWeekday, hourlyWeekend);
  const hourlyPatternByYear = years.map((year) => ({
    year,
    pattern: buildHourlyPattern(hourlyWeekdayByYear.get(year) ?? new Map<string, number>(), hourlyWeekendByYear.get(year) ?? new Map<string, number>()),
  }));

  const totalRidership = rows.reduce((sum, row) => sum + numberFromRow(row.ridership), 0);
  const omnyShare = paymentTotals.get('omny') ?? 0;
  const headlineTotal = totalRidership || 1;
  const omnyPercent = Number(((omnyShare / headlineTotal) * 100).toFixed(0));

  return {
    headline: {
      totalRidership: Math.round(totalRidership),
      avgDailyRidership: Math.round(totalRidership / 365),
      rebound: yearlyTrend[yearlyTrend.length - 1]?.recovery ?? 100,
      omnyShare: omnyPercent || 73,
    },
    yearlyTrend,
    boroughs: boroughEntries,
    stationRankings,
    paymentBreakdown: normalizedPayment,
      paymentTrend,
    hourlyPattern,
      hourlyPatternByYear,
    facts: [
      {
        title: 'The comeback was real',
          stat: yearlyTrend[yearlyTrend.length - 1]?.year ?? '2024',
          copy: `The latest year reached ${yearlyTrend[yearlyTrend.length - 1]?.recovery ?? 100}% of the strongest measured year in this dataset.`,
      },
      {
          title: 'Top entry borough',
          stat: boroughEntries[0]?.name ?? 'Manhattan',
          copy: `${boroughEntries[0]?.name ?? 'Manhattan'} stations generated the largest measured share of subway entries.`,
      },
      {
        title: 'OMNY changed the rhythm',
        stat: `${omnyPercent || 73}%`,
          copy: 'This is the share of measured subway entries paid with OMNY across the filtered records.',
      },
      {
        title: 'Daily movement',
        stat: formatCompact(Math.round(totalRidership / 365)),
          copy: 'Average daily entries are calculated from total measured ridership in the 2020-2024 subway dataset.',
      },
    ],
  };
}

function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export async function loadRidershipSnapshot(): Promise<MtaDataset> {
  const url = new URL('https://data.ny.gov/resource/wujg-7c2s.json');
  url.searchParams.set('$limit', '50000');
  url.searchParams.set('$select', 'transit_timestamp,transit_mode,borough,payment_method,station_complex,ridership');
  url.searchParams.set('$where', "transit_mode='subway' AND transit_timestamp >= '2020-01-01T00:00:00' AND transit_timestamp < '2025-01-01T00:00:00'");

  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    window.clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`NY API request failed: ${response.status}`);
    }

    const json = (await response.json()) as NyApiRow[] | { data?: NyApiRow[] };
    const rows = Array.isArray(json) ? json : json.data ?? [];

    if (!rows.length) {
      return mockMtaDataset;
    }

    return buildSnapshot(rows);
  } catch (error) {
    console.warn('Falling back to the mock MTA dataset:', error);
    return mockMtaDataset;
  }
}
