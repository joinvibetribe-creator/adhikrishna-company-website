"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const currencies = [
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

function formatNumber(value: number) {
return new Intl.NumberFormat("en-US", {
maximumFractionDigits: 2,
}).format(value);
}

function formatCurrency(value: number, currency: string) {
return `${currency} ${formatNumber(value)}`;
}

export default function BreakEvenCalculatorPage() {
const [currency, setCurrency] = useState("TZS");
const [sellingPrice, setSellingPrice] = useState("");
const [directCost, setDirectCost] = useState("");
const [fixedCosts, setFixedCosts] = useState("");

const results = useMemo(() => {
const sellingPriceValue = Number(sellingPrice) || 0;
const directCostValue = Number(directCost) || 0;
const fixedCostsValue = Number(fixedCosts) || 0;


const contributionPerUnit = sellingPriceValue - directCostValue;

const hasPositiveContribution = contributionPerUnit > 0;
const contributionMargin =
  sellingPriceValue > 0 && hasPositiveContribution
    ? contributionPerUnit / sellingPriceValue
    : 0;

const exactBreakEvenUnits =
  hasPositiveContribution && fixedCostsValue > 0
    ? fixedCostsValue / contributionPerUnit
    : 0;

const minimumWholeUnits =
  hasPositiveContribution && fixedCostsValue > 0
    ? Math.ceil(exactBreakEvenUnits)
    : 0;

const exactBreakEvenRevenue =
  hasPositiveContribution && fixedCostsValue > 0
    ? fixedCostsValue / contributionMargin
    : 0;

const salesRevenueAtWholeUnits =
  hasPositiveContribution && minimumWholeUnits > 0
    ? minimumWholeUnits * sellingPriceValue
    : 0;

return {
  sellingPriceValue,
  directCostValue,
  fixedCostsValue,
  contributionPerUnit,
  contributionMargin,
  exactBreakEvenUnits,
  minimumWholeUnits,
  exactBreakEvenRevenue,
  salesRevenueAtWholeUnits,
  hasPositiveContribution,
};


}, [sellingPrice, directCost, fixedCosts]);

return ( <main className="min-h-screen bg-[#f8fafc] text-[#0b2347]"> <header className="bg-[#0b2347] py-20 text-white"> <div className="mx-auto max-w-5xl px-6"> <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
Free Business Tool </p>


      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Break-Even Calculator
      </h1>

      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
        Find out how many units you need to sell to cover your fixed
        business costs.
      </p>
    </div>
  </header>

  <section className="mx-auto max-w-5xl px-6 py-12">
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d4af37]">
          Step 1
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Tell Us About Your Business
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Enter the selling price, direct cost and fixed costs for the
          period you want to analyse.
        </p>
      </div>

      <div className="grid gap-6">
        <div>
          <label
            htmlFor="currency"
            className="mb-2 block text-sm font-semibold"
          >
            Currency
          </label>

          <select
            id="currency"
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[#1e5aa8] focus:ring-2 focus:ring-[#1e5aa8]/20"
          >
            {currencies.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code} — {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="selling-price"
            className="mb-2 block text-sm font-semibold"
          >
            How much do you sell one unit for?
          </label>

          <p className="mb-2 text-sm text-slate-500">
            Enter the selling price for one unit, item, service or other
            unit of sale.
          </p>

          <input
            id="selling-price"
            type="number"
            min="0"
            step="any"
            value={sellingPrice}
            onChange={(event) => setSellingPrice(event.target.value)}
            placeholder="e.g. 570000"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#1e5aa8] focus:ring-2 focus:ring-[#1e5aa8]/20"
          />
        </div>

        <div>
          <label
            htmlFor="direct-cost"
            className="mb-2 block text-sm font-semibold"
          >
            How much does one unit cost you?
          </label>

          <p className="mb-2 text-sm text-slate-500">
            Enter the direct or variable cost of one unit.
          </p>

          <input
            id="direct-cost"
            type="number"
            min="0"
            step="any"
            value={directCost}
            onChange={(event) => setDirectCost(event.target.value)}
            placeholder="e.g. 380000"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#1e5aa8] focus:ring-2 focus:ring-[#1e5aa8]/20"
          />
        </div>

        <div>
          <label
            htmlFor="fixed-costs"
            className="mb-2 block text-sm font-semibold"
          >
            What are your fixed business costs?
          </label>

          <p className="mb-2 text-sm text-slate-500">
            Enter costs that generally remain the same regardless of how
            many units you sell, such as rent or fixed salaries. Use the
            same period for all fixed costs.
          </p>

          <input
            id="fixed-costs"
            type="number"
            min="0"
            step="any"
            value={fixedCosts}
            onChange={(event) => setFixedCosts(event.target.value)}
            placeholder="e.g. 5000000"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#1e5aa8] focus:ring-2 focus:ring-[#1e5aa8]/20"
          />
        </div>
      </div>

      <div className="my-12 h-px bg-slate-200" />

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d4af37]">
          Step 2
        </p>

        <h2 className="mt-2 text-2xl font-bold">Your Results</h2>
      </div>

      {!results.hasPositiveContribution &&
      results.sellingPriceValue > 0 &&
      results.directCostValue > 0 ? (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="text-lg font-bold text-amber-900">
            No Positive Contribution
          </h3>

          <p className="mt-2 leading-7 text-amber-800">
            Your selling price must be greater than your direct cost per
            unit to calculate a positive break-even point.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-6">
            <p className="text-sm font-medium text-slate-500">
              Contribution Per Unit
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(
                results.contributionPerUnit,
                currency,
              )}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Amount from each sale available to cover fixed costs
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6">
            <p className="text-sm font-medium text-slate-500">
              Contribution Margin
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formatNumber(results.contributionMargin * 100)}%
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6">
            <p className="text-sm font-medium text-slate-500">
              Exact Break-Even Units
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formatNumber(results.exactBreakEvenUnits)}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              The mathematical break-even point before rounding to a whole
              unit
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6">
            <p className="text-sm font-medium text-slate-500">
              Minimum Whole Units
            </p>

            <p className="mt-2 text-2xl font-bold">
              {results.minimumWholeUnits}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              The minimum number of complete units needed to reach or exceed
              break-even
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6">
            <p className="text-sm font-medium text-slate-500">
              Break-Even Sales Revenue
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(
                results.exactBreakEvenRevenue,
                currency,
              )}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              The mathematical sales revenue required to cover the fixed
              costs
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6">
            <p className="text-sm font-medium text-slate-500">
              Sales Revenue at {results.minimumWholeUnits || 0} Units
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(
                results.salesRevenueAtWholeUnits,
                currency,
              )}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Revenue generated when selling the required whole number of
              units
            </p>
          </div>
        </div>
      )}

      {results.hasPositiveContribution &&
        results.minimumWholeUnits > 0 && (
          <div className="mt-6 rounded-2xl border border-[#1e5aa8]/20 bg-[#1e5aa8]/5 p-6">
            <h3 className="text-lg font-bold">What does this mean?</h3>

            <p className="mt-2 leading-7 text-slate-700">
              Your mathematical break-even point is approximately{" "}
              <strong>
                {formatNumber(results.exactBreakEvenUnits)} units
              </strong>
              . Because you normally cannot sell a fraction of a unit,
              you need to sell at least{" "}
              <strong>{results.minimumWholeUnits} whole units</strong> to
              reach or exceed the break-even point.
            </p>
          </div>
        )}
    </div>
  </section>

  <section className="mx-auto max-w-5xl px-6 pb-12">
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d4af37]">
        Step 3
      </p>

      <h2 className="mt-2 text-2xl font-bold">Understand Break-Even</h2>

      <p className="mt-4 max-w-3xl leading-7 text-slate-600">
        Your break-even point is where your sales are enough to cover your
        fixed costs after accounting for the direct cost of each unit
        sold.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="font-bold">Selling Price</h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            The amount you receive from selling one unit.
          </p>
        </div>

        <div>
          <h3 className="font-bold">Direct Cost</h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            The cost that is directly associated with producing or
            purchasing one unit.
          </p>
        </div>

        <div>
          <h3 className="font-bold">Fixed Costs</h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Costs that generally remain unchanged within the relevant
            activity range, such as rent or fixed salaries.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl bg-slate-50 p-6">
        <h3 className="font-bold">Good to Know</h3>

        <p className="mt-2 leading-7 text-slate-600">
          The calculator assumes that the selling price and direct cost per
          unit remain constant and that the fixed costs you enter relate to
          the same period. Real businesses can have changing prices,
          discounts, product mixes and costs, so the actual break-even
          point can differ.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold">Example</h2>

        <p className="mt-3 leading-7 text-slate-600">
          Imagine you sell a product for{" "}
          <strong>570,000 TZS</strong>, the direct cost is{" "}
          <strong>380,000 TZS</strong> per unit, and your fixed costs are{" "}
          <strong>5,000,000 TZS</strong>.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Selling Price</p>
            <p className="mt-2 font-bold">TZS 570,000</p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Direct Cost</p>
            <p className="mt-2 font-bold">TZS 380,000</p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Fixed Costs</p>
            <p className="mt-2 font-bold">TZS 5,000,000</p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Contribution</p>
            <p className="mt-2 font-bold">TZS 190,000</p>
          </div>
        </div>

        <p className="mt-6 leading-7 text-slate-600">
          The exact break-even point is approximately{" "}
          <strong>26.32 units</strong>. Since whole units are required,
          you would need to sell <strong>27 units</strong> to reach or
          exceed the break-even point. The mathematical break-even sales
          revenue is <strong>TZS 15,000,000</strong>, while sales revenue
          at 27 whole units would be <strong>TZS 15,390,000</strong>.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold">Important Information</h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          This calculator provides an estimate based on the information you
          enter. It assumes a consistent selling price and direct cost per
          unit and does not account for changes in product mix, discounts,
          taxes, financing costs or other factors that may affect actual
          business performance. This tool is provided for informational
          purposes and is not professional accounting, tax, legal or
          financial advice.
        </p>
      </div>

      <div className="mt-10">
        <Link
          href="/free-tools"
          className="inline-flex items-center rounded-xl bg-[#0b2347] px-5 py-3 font-semibold text-white transition hover:bg-[#1e5aa8]"
        >
          Back to Free Tools
        </Link>
      </div>
    </div>
  </section>
</main>

);
}
