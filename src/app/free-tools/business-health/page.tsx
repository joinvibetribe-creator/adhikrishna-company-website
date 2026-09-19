"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import MoneyInput from "@/components/free-tools/MoneyInput";

type Status =
| "Healthy"
| "Watch"
| "Needs Attention"
| "Insufficient Data";

type Currency = {
code: string;
name: string;
};

const currencies: Currency[] = [
{ code: "TZS", name: "Tanzanian Shilling" },
{ code: "USD", name: "US Dollar" },
{ code: "EUR", name: "Euro" },
{ code: "GBP", name: "British Pound" },
{ code: "KES", name: "Kenyan Shilling" },
{ code: "UGX", name: "Ugandan Shilling" },
{ code: "ZMW", name: "Zambian Kwacha" },
{ code: "ZAR", name: "South African Rand" },
{ code: "INR", name: "Indian Rupee" },
];

function parseNumber(value: string): number {
const parsed = Number(value.replace(/,/g, ""));
return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(
value: number,
currency: string,
decimals = 2
): string {
const locale = currency === "INR" ? "en-IN" : "en-US";

return new Intl.NumberFormat(locale, {
useGrouping: true,
minimumFractionDigits: decimals,
maximumFractionDigits: decimals,
}).format(value);
}

function formatCurrency(
value: number,
currency: string,
decimals = 0
): string {
return `${currency} ${formatNumber(value, currency, decimals)}`;
}

function getStatusClasses(status: Status): string {
switch (status) {
case "Healthy":
return "bg-emerald-50 text-emerald-700 border-emerald-200";


case "Watch":
  return "bg-amber-50 text-amber-700 border-amber-200";

case "Needs Attention":
  return "bg-red-50 text-red-700 border-red-200";

case "Insufficient Data":
  return "bg-slate-100 text-slate-600 border-slate-200";


}
}

function getStatusDescription(
status: Status,
metric: string
): string {
if (status === "Insufficient Data") {
return `More information is required to assess ${metric.toLowerCase()}.`;
}

return "";
}

export default function BusinessHealthCheckPage() {
const [currency, setCurrency] = useState("TZS");

const [currentRevenue, setCurrentRevenue] = useState("");
const [previousRevenue, setPreviousRevenue] = useState("");
const [grossMargin, setGrossMargin] = useState("");

const [availableCash, setAvailableCash] = useState("");
const [monthlyOperatingCosts, setMonthlyOperatingCosts] =
useState("");

const [receivables, setReceivables] = useState("");
const [monthlySales, setMonthlySales] = useState("");

const [inventoryValue, setInventoryValue] = useState("");
const [monthlyCogs, setMonthlyCogs] = useState("");

const results = useMemo(() => {
const currentRevenueNumber = parseNumber(currentRevenue);
const previousRevenueNumber = parseNumber(previousRevenue);
const grossMarginNumber = parseNumber(grossMargin);


const availableCashNumber = parseNumber(availableCash);
const monthlyOperatingCostsNumber = parseNumber(
  monthlyOperatingCosts
);

const receivablesNumber = parseNumber(receivables);
const monthlySalesNumber = parseNumber(monthlySales);

const inventoryValueNumber = parseNumber(inventoryValue);
const monthlyCogsNumber = parseNumber(monthlyCogs);

let revenueStatus: Status = "Insufficient Data";
let revenueGrowth = 0;

if (
  currentRevenue.trim() !== "" &&
  previousRevenue.trim() !== "" &&
  previousRevenueNumber > 0
) {
  revenueGrowth =
    ((currentRevenueNumber - previousRevenueNumber) /
      previousRevenueNumber) *
    100;

  if (revenueGrowth >= 5) {
    revenueStatus = "Healthy";
  } else if (revenueGrowth >= 0) {
    revenueStatus = "Watch";
  } else {
    revenueStatus = "Needs Attention";
  }
}

let marginStatus: Status = "Insufficient Data";

if (grossMargin.trim() !== "") {
  if (grossMarginNumber >= 30) {
    marginStatus = "Healthy";
  } else if (grossMarginNumber >= 15) {
    marginStatus = "Watch";
  } else {
    marginStatus = "Needs Attention";
  }
}

let cashStatus: Status = "Insufficient Data";
let cashCoverage = 0;

if (
  availableCash.trim() !== "" &&
  monthlyOperatingCosts.trim() !== "" &&
  monthlyOperatingCostsNumber > 0
) {
  cashCoverage =
    availableCashNumber / monthlyOperatingCostsNumber;

  if (cashCoverage >= 3) {
    cashStatus = "Healthy";
  } else if (cashCoverage >= 1) {
    cashStatus = "Watch";
  } else {
    cashStatus = "Needs Attention";
  }
}

let receivablesStatus: Status = "Insufficient Data";
let receivablesRatio = 0;

if (
  receivables.trim() !== "" &&
  monthlySales.trim() !== "" &&
  monthlySalesNumber > 0
) {
  receivablesRatio =
    (receivablesNumber / monthlySalesNumber) * 100;

  if (receivablesRatio <= 30) {
    receivablesStatus = "Healthy";
  } else if (receivablesRatio <= 60) {
    receivablesStatus = "Watch";
  } else {
    receivablesStatus = "Needs Attention";
  }
}

let inventoryStatus: Status = "Insufficient Data";
let inventoryCoverage = 0;

if (
  inventoryValue.trim() !== "" &&
  monthlyCogs.trim() !== "" &&
  monthlyCogsNumber > 0
) {
  inventoryCoverage =
    inventoryValueNumber / monthlyCogsNumber;

  if (inventoryCoverage <= 3) {
    inventoryStatus = "Healthy";
  } else if (inventoryCoverage <= 6) {
    inventoryStatus = "Watch";
  } else {
    inventoryStatus = "Needs Attention";
  }
}

return {
  revenueGrowth,
  revenueStatus,
  grossMarginNumber,
  marginStatus,
  cashCoverage,
  cashStatus,
  receivablesRatio,
  receivablesStatus,
  inventoryCoverage,
  inventoryStatus,
  currentRevenueNumber,
};


}, [
currentRevenue,
previousRevenue,
grossMargin,
availableCash,
monthlyOperatingCosts,
receivables,
monthlySales,
inventoryValue,
monthlyCogs,
]);

const metricCards = [
{
name: "Revenue Trend",
value:
currentRevenue.trim() !== "" &&
previousRevenue.trim() !== "" &&
parseNumber(previousRevenue) > 0
? `${formatNumber(
              results.revenueGrowth,
              currency,
              2
            )}%`
: "—",
status: results.revenueStatus,
description:
results.revenueStatus === "Insufficient Data"
? "Enter both current and previous revenue to assess the trend."
: `Revenue is ${
              results.revenueGrowth >= 0 ? "up" : "down"
            } ${formatNumber(
              Math.abs(results.revenueGrowth),
              currency,
              2
            )}%.`,
},
{
name: "Gross Profit Margin",
value:
grossMargin.trim() !== ""
? `${formatNumber(
              results.grossMarginNumber,
              currency,
              2
            )}%`
: "—",
status: results.marginStatus,
description:
results.marginStatus === "Insufficient Data"
? "Enter your gross profit margin to assess profitability."
: `Your gross profit margin is ${formatNumber(
              results.grossMarginNumber,
              currency,
              2
            )}%.`,
},
{
name: "Cash Coverage",
value:
availableCash.trim() !== "" &&
monthlyOperatingCosts.trim() !== "" &&
parseNumber(monthlyOperatingCosts) > 0
? `${formatNumber(
              results.cashCoverage,
              currency,
              1
            )} months`
: "—",
status: results.cashStatus,
description:
results.cashStatus === "Insufficient Data"
? "Enter both available cash and monthly operating costs."
: `Your available cash covers approximately ${formatNumber(
              results.cashCoverage,
              currency,
              1
            )} months of operating costs.`,
},
{
name: "Receivables",
value:
receivables.trim() !== "" &&
monthlySales.trim() !== "" &&
parseNumber(monthlySales) > 0
? `${formatNumber(
              results.receivablesRatio,
              currency,
              1
            )}%`
: "—",
status: results.receivablesStatus,
description:
results.receivablesStatus === "Insufficient Data"
? "Enter both customer receivables and monthly sales."
: `Receivables represent approximately ${formatNumber(
              results.receivablesRatio,
              currency,
              1
            )}% of monthly sales.`,
},
{
name: "Inventory Coverage",
value:
inventoryValue.trim() !== "" &&
monthlyCogs.trim() !== "" &&
parseNumber(monthlyCogs) > 0
? `${formatNumber(
              results.inventoryCoverage,
              currency,
              1
            )} months`
: "—",
status: results.inventoryStatus,
description:
results.inventoryStatus === "Insufficient Data"
? "Enter both inventory value and monthly cost of goods sold."
: `Current inventory represents approximately ${formatNumber(
              results.inventoryCoverage,
              currency,
              1
            )} months of COGS.`,
},
];

return ( <main className="min-h-screen bg-[#F8FAFC]"> <section className="border-b border-slate-200 bg-white"> <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8"> <div className="max-w-3xl"> <div className="mb-6"> <Link
             href="/free-tools"
             className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#0B2347] transition hover:border-[#1E5AA8] hover:text-[#1E5AA8]"
           >
← Back to Free Tools </Link> </div>


        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#1E5AA8]">
          AdhiKrishna Free Tools
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-[#0B2347] sm:text-5xl">
          Business Health Check
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-600">
          Review key financial and operational indicators to
          identify areas that may deserve attention in your
          business.
        </p>
      </div>
    </div>
  </section>

  <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0B2347]">
            Enter Your Business Information
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            You can enter as much information as you currently
            have. Indicators without enough information will be
            marked as Insufficient Data.
          </p>
        </div>

        <div className="mb-8">
          <label
            htmlFor="currency"
            className="mb-2 block text-sm font-semibold text-[#0B2347]"
          >
            Currency
          </label>

          <select
            id="currency"
            value={currency}
            onChange={(event) =>
              setCurrency(event.target.value)
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-[#1E5AA8] focus:ring-2 focus:ring-[#1E5AA8]/20"
          >
            {currencies.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code} — {item.name}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs text-slate-500">
            Monetary amounts automatically use the grouping
            style of the selected currency. Decimals are
            supported.
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#0B2347]">
              1. Revenue &amp; Profitability
            </h3>

            <div className="space-y-5">
              <MoneyInput
                id="current-revenue"
                label="Current Revenue"
                value={currentRevenue}
                currency={currency}
                onChange={setCurrentRevenue}
                placeholder="0"
                helpText="Revenue for the period you want to assess."
              />

              <MoneyInput
                id="previous-revenue"
                label="Previous Period Revenue"
                value={previousRevenue}
                currency={currency}
                onChange={setPreviousRevenue}
                placeholder="0"
                helpText="Revenue from the comparable previous period."
              />

              <div>
                <label
                  htmlFor="gross-margin"
                  className="mb-2 block text-sm font-semibold text-[#0B2347]"
                >
                  Gross Profit Margin (%)
                </label>

                <input
                  id="gross-margin"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={grossMargin}
                  onChange={(event) =>
                    setGrossMargin(event.target.value)
                  }
                  placeholder="e.g. 33.33"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-[#1E5AA8] focus:ring-2 focus:ring-[#1E5AA8]/20"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Your gross profit as a percentage of revenue.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-[#0B2347]">
              2. Cash Position
            </h3>

            <div className="space-y-5">
              <MoneyInput
                id="available-cash"
                label="Available Cash"
                value={availableCash}
                currency={currency}
                onChange={setAvailableCash}
                placeholder="0"
              />

              <MoneyInput
                id="monthly-operating-costs"
                label="Monthly Operating Costs"
                value={monthlyOperatingCosts}
                currency={currency}
                onChange={setMonthlyOperatingCosts}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-[#0B2347]">
              3. Customer Receivables
            </h3>

            <div className="space-y-5">
              <MoneyInput
                id="receivables"
                label="Customer Receivables"
                value={receivables}
                currency={currency}
                onChange={setReceivables}
                placeholder="0"
              />

              <MoneyInput
                id="monthly-sales"
                label="Monthly Sales"
                value={monthlySales}
                currency={currency}
                onChange={setMonthlySales}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-[#0B2347]">
              4. Inventory
            </h3>

            <div className="space-y-5">
              <MoneyInput
                id="inventory-value"
                label="Inventory Value"
                value={inventoryValue}
                currency={currency}
                onChange={setInventoryValue}
                placeholder="0"
              />

              <MoneyInput
                id="monthly-cogs"
                label="Monthly Cost of Goods Sold"
                value={monthlyCogs}
                currency={currency}
                onChange={setMonthlyCogs}
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-[#0B2347]">
            Your Business Health Indicators
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            These indicators are diagnostic guidelines, not
            universal accounting standards or a formal business
            rating.
          </p>

          <div className="mt-6 space-y-4">
            {metricCards.map((metric) => (
              <div
                key={metric.name}
                className="rounded-xl border border-slate-200 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-[#0B2347]">
                      {metric.name}
                    </h3>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {metric.value}
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                      metric.status
                    )}`}
                  >
                    {metric.status}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {metric.description}
                </p>

                {metric.status === "Insufficient Data" && (
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    {getStatusDescription(
                      metric.status,
                      metric.name
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-[#0B2347]">
            Key Figures
          </h2>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <span className="text-sm text-slate-600">
                Current Revenue
              </span>

              <span className="text-sm font-semibold text-slate-900">
                {currentRevenue.trim() !== ""
                  ? formatCurrency(
                      results.currentRevenueNumber,
                      currency
                    )
                  : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <span className="text-sm text-slate-600">
                Gross Profit Margin
              </span>

              <span className="text-sm font-semibold text-slate-900">
                {grossMargin.trim() !== ""
                  ? `${formatNumber(
                      results.grossMarginNumber,
                      currency,
                      2
                    )}%`
                  : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <span className="text-sm text-slate-600">
                Cash Coverage
              </span>

              <span className="text-sm font-semibold text-slate-900">
                {results.cashStatus !== "Insufficient Data"
                  ? `${formatNumber(
                      results.cashCoverage,
                      currency,
                      1
                    )} months`
                  : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-600">
                Receivables / Monthly Sales
              </span>

              <span className="text-sm font-semibold text-slate-900">
                {results.receivablesStatus !==
                "Insufficient Data"
                  ? `${formatNumber(
                      results.receivablesRatio,
                      currency,
                      1
                    )}%`
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-10 rounded-2xl border border-[#1E5AA8]/20 bg-[#1E5AA8]/5 p-6 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#1E5AA8]">
        Connected to the bigger picture
      </p>

      <h2 className="mt-3 text-2xl font-bold text-[#0B2347]">
        From business numbers to business intelligence
      </h2>

      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
        This free tool demonstrates a simple principle:
        business data becomes more useful when it is converted
        into understandable signals. For larger and more
        complex datasets, AdhiKrishna Solutions LLP is developing
        Katya_AI to help businesses turn operational data into
        intelligent decisions.
      </p>

      <Link
        href="/products/katya-ai"
        className="mt-5 inline-flex rounded-xl bg-[#0B2347] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1E5AA8]"
      >
        Explore Katya_AI
      </Link>
    </div>

    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-[#0B2347]">
        How to interpret the results
      </h2>

      <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
        <p>
          <strong className="text-slate-900">
            Healthy
          </strong>{" "}
          means the indicator is currently within the range
          used by this tool for a relatively positive signal.
        </p>

        <p>
          <strong className="text-slate-900">
            Watch
          </strong>{" "}
          means the indicator falls into a range that may
          deserve closer monitoring.
        </p>

        <p>
          <strong className="text-slate-900">
            Needs Attention
          </strong>{" "}
          means the indicator falls outside the range used by
          this tool and may deserve further investigation.
        </p>

        <p>
          <strong className="text-slate-900">
            Insufficient Data
          </strong>{" "}
          means there is not enough information to calculate or
          assess that indicator reliably.
        </p>

        <p>
          The thresholds used here are general diagnostic
          guidelines intended for educational and planning
          purposes. They are not a substitute for professional
          accounting, financial, tax or business advice.
        </p>
      </div>
    </div>
  </section>
</main>

);
}
