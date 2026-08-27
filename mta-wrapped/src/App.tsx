import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { loadRidershipSnapshot, type MtaDataset } from './data';

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

const formatFull = (value: number) =>
  new Intl.NumberFormat('en-US').format(value);

function Callout({ text }: { text: string }) {
  return (
    <p className="insight-callout">
      <span className="info-tip callout-icon" aria-hidden="true">
        i
      </span>
      <span>{text}</span>
    </p>
  );
}

function App() {
  const [data, setData] = useState<MtaDataset | null>(null);
  const [selectedCommuteYear, setSelectedCommuteYear] = useState('2024');

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      const snapshot = await loadRidershipSnapshot();
      if (!cancelled) setData(snapshot);
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return (
      <div className="app-shell">
        <main className="story">
          <section className="panel hero-panel">
            <div className="hero-copy">
              <p className="eyebrow">Loading NYC ridership data</p>
              <h1>Crunching the latest subway story…</h1>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const commuteYears = data.hourlyPatternByYear.map((entry) => entry.year);
  const selectedHourlyPattern =
    data.hourlyPatternByYear.find((entry) => entry.year === selectedCommuteYear)?.pattern ?? data.hourlyPattern;
  const latestPaymentYear = data.paymentTrend[data.paymentTrend.length - 1];

  const firstYearPattern = data.hourlyPatternByYear[0];
  const lastYearPattern = data.hourlyPatternByYear[data.hourlyPatternByYear.length - 1];
  const findHourValue = (pattern: typeof data.hourlyPattern, hour: string, key: 'weekday' | 'weekend') =>
    pattern.find((entry) => entry.hour === hour)?.[key] ?? 0;
  const morningRushEarly = findHourValue(firstYearPattern.pattern, '8a', 'weekday');
  const morningRushLate = findHourValue(lastYearPattern.pattern, '8a', 'weekday');
  const weekendEveningEarly = findHourValue(firstYearPattern.pattern, '7p', 'weekend');
  const weekendEveningLate = findHourValue(lastYearPattern.pattern, '7p', 'weekend');
  const commuteTakeaway = `In ${firstYearPattern.year}, the 8am weekday rush was muted (index ${morningRushEarly}) while weekend evenings ran nearly as busy as weekdays (index ${weekendEveningEarly} at 7pm). By ${lastYearPattern.year}, the 8am commute rush is back near its old strength (index ${morningRushLate}), and weekend evening demand has cooled to ${weekendEveningLate}, showing the day is less flat and rush hour has reasserted itself.`;

  const worstYear = data.yearlyTrend.reduce((min, year) => (year.ridership < min.ridership ? year : min), data.yearlyTrend[0]);
  const latestYearlyTrend = data.yearlyTrend[data.yearlyTrend.length - 1];
  const pandemicTakeaway = `${worstYear.year} was the low point at just ${worstYear.recovery}% of the five-year peak. By ${latestYearlyTrend.year}, ridership climbed back to ${latestYearlyTrend.recovery}% of that peak, a ${latestYearlyTrend.recovery - worstYear.recovery}-point recovery.`;

  const firstPaymentYear = data.paymentTrend[0];
  const paymentTakeaway = `OMNY grew from ${firstPaymentYear.omny}% of entries in ${firstPaymentYear.year} to ${latestPaymentYear.omny}% in ${latestPaymentYear.year}, while MetroCard fell from ${firstPaymentYear.metrocard}% to ${latestPaymentYear.metrocard}%, a clear swipe-to-tap shift.`;

  const topBorough = data.boroughs.reduce((max, borough) => (borough.share > max.share ? borough : max), data.boroughs[0]);
  const smallestBorough = data.boroughs.reduce((min, borough) => (borough.share < min.share ? borough : min), data.boroughs[0]);
  const boroughTakeaway = `${topBorough.name} led with ${topBorough.share}% of measured entries, ${Math.round(
    topBorough.share / smallestBorough.share,
  )}x ${smallestBorough.name}'s ${smallestBorough.share}% share, showing entries stay concentrated near the busiest station clusters.`;

  const topStation = data.stationRankings[0];
  const fastestGrowingStation = data.stationRankings.reduce(
    (max, station) => (station.change > max.change ? station : max),
    data.stationRankings[0],
  );
  const rankingTakeaway = `${topStation.station} logged the most measured entries at ${formatFull(topStation.riders)}, while ${
    fastestGrowingStation.station
  } grew the fastest year over year at +${fastestGrowingStation.change}%.`;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark">NYC</span>
          <span>in Motion</span>
        </div>
        <div className="topbar-meta">
          <span>2020–2024</span>
          <span className="chip">MTA ride story</span>
        </div>
      </header>

      <main className="story">
        <section className="hero-panel panel">
          <div className="hero-copy">
            <p className="eyebrow">NYC subway ridership, explained</p>
            <h1>From empty platforms to packed rush hour, New York kept moving.</h1>
            <p className="lede">
              From 2020 through 2024, this subway entry dataset tracks annual ridership, where trips were recorded,
              when demand peaked, and how riders paid.
            </p>
            <div className="hero-metrics">
              <div>
                <strong>{formatNumber(data.headline.avgDailyRidership)}</strong>
                <span>2024 avg daily subway entries</span>
              </div>
              <div>
                <strong>{data.headline.rebound}%</strong>
                <span>2024 ridership vs. five-year peak</span>
              </div>
              <div>
                <strong>{data.headline.omnyShare}%</strong>
                <span>2024 entries paid with OMNY</span>
              </div>
            </div>
            <p className="metric-note">
              Percent metrics are shares of measured subway entries. The recovery figure compares 2024 ridership with
              the highest annual ridership in the 2020-2024 dataset.
            </p>
            <Callout text="These percentages are shares of measured subway entries, not unique riders, and 'recovery' compares 2024 totals with the highest annual total in the 2020-2024 dataset." />
          </div>

          <div className="hero-visual">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="map-card">
              <span className="tiny-label">Ridership pulse</span>
              <div className="pulse-line">
                {[...Array(32)].map((_, index) => (
                  <span key={index} style={{ height: `${22 + ((index * 17) % 55)}%` }} />
                ))}
              </div>
              <div className="map-stats">
                <div>
                  <span>Peak hour</span>
                  <strong>5PM</strong>
                </div>
                <div>
                  <span>Top borough</span>
                  <strong>Manhattan</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="panel story-panel">
          <div className="section-head">
            <p className="eyebrow">The pandemic impact</p>
            <h2>2020 hit hard, then the city found its rhythm again.</h2>
            <p>{pandemicTakeaway}</p>
            <Callout text="Annual rider counts are shown as total subway entries. The percentage cards compare each year with the highest annual total in this five-year view." />
          </div>

          <div className="chart-card large">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={data.yearlyTrend}>
                <defs>
                  <linearGradient id="ridershipGlow" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.12} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(value) => formatNumber(Number(value))} />
                <Tooltip
                  formatter={(value) => [formatFull(Number(value ?? 0)), 'Subway entries']}
                  contentStyle={{
                    background: '#0d1322',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '12px',
                  }}
                />
                <Area type="monotone" dataKey="ridership" stroke="#8b5cf6" fill="url(#ridershipGlow)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pandemic-timeline">
            {data.yearlyTrend.map((year) => (
              <article className="timeline-node" key={year.year}>
                <span className="timeline-dot" />
                <span className="timeline-year">{year.year}</span>
                <strong>{formatNumber(year.ridership)}</strong>
                <p>{year.recovery}% of five-year peak. {year.highlight}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel story-panel">
          <div className="section-head">
            <p className="eyebrow">How commuting habits changed</p>
            <h2>Rush hour still rules, but the city is less rigid and more flexible.</h2>
            <p>{commuteTakeaway}</p>
            <Callout text="Select a year to compare weekday and weekend demand by hour. Each series is indexed so its own busiest hour equals 100." />
          </div>

          <div className="year-toggle" aria-label="Select commute pattern year">
            {commuteYears.map((year) => (
              <button
                className={year === selectedCommuteYear ? 'active' : ''}
                key={year}
                type="button"
                onClick={() => setSelectedCommuteYear(year)}
              >
                {year}
              </button>
            ))}
          </div>

          <div className="chart-card">
            <ResponsiveContainer width="100%" height={310}>
              <BarChart data={selectedHourlyPattern}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="hour" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                <Tooltip
                  formatter={(value, name) => [`${value ?? 0} demand index`, name === 'weekday' ? 'Weekday' : 'Weekend']}
                  contentStyle={{
                    background: '#0d1322',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="weekday" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                <Bar dataKey="weekend" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel story-panel split-panel">
          <div>
            <div className="section-head">
              <p className="eyebrow">Borough comparisons</p>
              <h2>Entries are grouped by the borough where the station is located.</h2>
              <p>{boroughTakeaway}</p>
              <Callout text="This is not rider home borough or destination. It is each borough's share of measured subway entries by station location." />
            </div>
            <div className="stat-list">
              {data.boroughs.map((borough) => (
                <div className="stat-row" key={borough.name}>
                  <div className="label-group">
                    <span className="dot" style={{ background: borough.color }} />
                    <span>{borough.name}</span>
                  </div>
                  <div className="bar-wrap">
                    <span style={{ width: `${borough.share}%`, background: borough.color }} />
                  </div>
                  <strong>{borough.share}%</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card pie-card">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data.boroughs} dataKey="share" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {data.boroughs.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value ?? 0}% of entries`, name]}
                  contentStyle={{
                    background: '#0d1322',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel story-panel">
          <div className="section-head">
            <p className="eyebrow">Top station rankings</p>
            <h2>The busiest station complexes are ranked by total measured subway entries.</h2>
            <p>{rankingTakeaway}</p>
            <Callout text="Rankings use total measured boardings/entries in the dataset for each station complex, not unique riders." />
          </div>

          <div className="ranking-list">
            {data.stationRankings.map((station, index) => (
              <article className="rank-card" key={station.station}>
                <span className="rank-badge">#{index + 1}</span>
                <div>
                  <h3>{station.station}</h3>
                  <p>{station.borough}</p>
                </div>
                <div className="rank-metrics">
                  <strong>{formatFull(station.riders)}</strong>
                  <span>measured entries</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel story-panel split-panel">
          <div>
            <div className="section-head">
              <p className="eyebrow">MetroCard vs OMNY</p>
              <h2>Payment habits shifted from swipes to taps over time.</h2>
              <p>{paymentTakeaway}</p>
              <Callout text="Shares are based on measured subway entries by payment method, not the number of unique riders." />
            </div>
            <div className="payment-list">
              {data.paymentBreakdown.map((entry) => (
                <div key={entry.name} className="payment-row">
                  <div className="label-group">
                    <span className="dot" style={{ background: entry.color }} />
                    <span>{entry.name}</span>
                  </div>
                  <strong>{entry.value}%</strong>
                </div>
              ))}
            </div>
            {latestPaymentYear && <p className="metric-note">Latest measured mix: {latestPaymentYear.year}.</p>}
          </div>

          <div className="chart-card trend-card">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.paymentTrend}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  formatter={(value, name) => [
                    `${value ?? 0}% of entries`,
                    name === 'omny' ? 'OMNY tap' : name === 'metrocard' ? 'MetroCard' : 'Single ride',
                  ]}
                  contentStyle={{
                    background: '#0d1322',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="omny" name="OMNY tap" stroke="#6ee7b7" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="metrocard" name="MetroCard" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="singleRide" name="Single ride" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel facts-panel">
          <div className="section-head">
            <p className="eyebrow">Notable takeaways</p>
            <h2>Four plain-language signals from the data.</h2>
            <p>
              These cards avoid hidden denominators: each metric names the year, place, or behavior it summarizes.
            </p>
            <Callout text="These cards avoid hidden denominators: each metric names the exact year, place, or behavior it summarizes." />
          </div>

          <div className="facts-grid">
            {data.facts.map((fact) => (
              <article className="fact-card" key={fact.title}>
                <p className="fact-stat">{fact.stat}</p>
                <h3>{fact.title}</h3>
                <p>{fact.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel recap-panel">
          <p className="eyebrow">Bottom line</p>
          <h2>Ridership recovered, entries stayed concentrated in Manhattan, and OMNY became the dominant payment method.</h2>
          <div className="recap-box">
            <div>
              <span>Highest annual entries</span>
              <strong>2024</strong>
            </div>
            <div>
              <span>Primary entry borough</span>
              <strong>{data.boroughs[0]?.name ?? 'Manhattan'}</strong>
            </div>
            <div>
              <span>Leading payment method</span>
              <strong>OMNY tap</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
