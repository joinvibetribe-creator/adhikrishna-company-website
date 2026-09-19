"use client";

import { useState } from "react";
import Link from "next/link";

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

export default function MarkupCalculatorPage() {
const [currency, setCurrency] = useState("TZS");
const [costAmount, setCostAmount] = useState("");
const [markupRate, setMarkupRate] = useState("");

const costValue = Number(costAmount);
const markupValue = Number(markupRate);

const hasValidCost =
costAmount !== "" &&
Number.isFinite(costValue) &&
costValue > 0;

const hasValidMarkup =
markupRate !== "" &&
Number.isFinite(markupValue) &&
markupValue >= 0;

const hasValidInputs = hasValidCost && hasValidMarkup;

const markupAmount = hasValidInputs
? costValue * (markupValue / 100)
: null;

const sellingPrice =
hasValidInputs && markupAmount !== null
? costValue + markupAmount
: null;

const grossProfit = markupAmount;

const profitMargin =
hasValidInputs && sellingPrice !== null && sellingPrice > 0
? (grossProfit! / sellingPrice) * 100
: null;

const formatNumber = (value: number) =>
new Intl.NumberFormat("en-US", {
maximumFractionDigits: 2,
}).format(value);

const formatMoney = (value: number) =>
`${currency} ${formatNumber(value)}`;

return (
<> <header className="bg-[#0b2347] py-20"> <div className="mx-auto max-w-5xl px-6 text-center lg:px-8"> <p className="text-sm font-semibold uppercase tracking-widest text-[#d4af37]">
Free Business Tool </p>

      <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
        Markup Calculator
      </h1>

      <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-gray-200">
        Calculate how much to add to your cost and find the selling price
        you need for your chosen markup.
      </p>
    </div>
  </header>

  <main className="bg-[#f8fafc] py-16">
    <div className="mx-auto max-w-5xl px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#8b6508]">
            Step 1
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-[#0b2347]">
            Set Your Markup
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Enter what you paid and the percentage you want to add to that
            cost.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700"
              >
                Currency
              </label>

              <select
                id="currency"
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-[#1e5aa8] focus:ring-2 focus:ring-[#1e5aa8]/20"
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
                htmlFor="costAmount"
                className="block text-sm font-medium text-gray-700"
              >
                How much did you pay to buy or produce it?
              </label>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Enter the direct cost of the goods or services you want to
                price.
              </p>

              <input
                id="costAmount"
                type="number"
                min="0"
                step="0.01"
                value={costAmount}
                onChange={(event) => setCostAmount(event.target.value)}
                placeholder="e.g. 380000"
                className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#1e5aa8] focus:ring-2 focus:ring-[#1e5aa8]/20"
              />
            </div>

            <div>
              <label
                htmlFor="markupRate"
                className="block text-sm font-medium text-gray-700"
              >
                What markup percentage do you want?
              </label>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                For example, enter 50 for a 50% markup on your cost.
              </p>

              <div className="relative mt-3">
                <input
                  id="markupRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={markupRate}
                  onChange={(event) => setMarkupRate(event.target.value)}
                  placeholder="e.g. 50"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-gray-900 outline-none transition focus:border-[#1e5aa8] focus:ring-2 focus:ring-[#1e5aa8]/20"
                />

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  %
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#8b6508]">
            Step 2
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-[#0b2347]">
            Your Results
          </h2>

          {!hasValidInputs ? (
            <div className="mt-8 rounded-lg bg-[#f8fafc] p-6">
              <p className="font-medium text-[#0b2347]">
                Enter your cost and markup percentage above.
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Your markup amount, selling price and margin will appear
                here automatically.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-5">
              <div className="rounded-lg bg-[#f8fafc] p-5">
                <p className="text-sm text-gray-500">Your Direct Cost</p>

                <p className="mt-2 text-2xl font-bold text-[#0b2347]">
                  {formatMoney(costValue)}
                </p>
              </div>

              <div className="rounded-lg bg-[#f8fafc] p-5">
                <p className="text-sm text-gray-500">Markup</p>

                <p className="mt-2 text-2xl font-bold text-[#1e5aa8]">
                  {formatMoney(markupAmount ?? 0)}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {formatNumber(markupValue)}% added to your direct cost
                </p>
              </div>

              <div className="rounded-lg border border-[#d4af37]/40 bg-[#fffdf5] p-5">
                <p className="text-sm text-gray-500">Suggested Selling Price</p>

                <p className="mt-2 text-3xl font-bold text-[#0b2347]">
                  {formatMoney(sellingPrice ?? 0)}
                </p>
              </div>

              <div className="rounded-lg bg-[#f8fafc] p-5">
                <p className="text-sm text-gray-500">Gross Profit</p>

                <p className="mt-2 text-2xl font-bold text-[#1e5aa8]">
                  {formatMoney(grossProfit ?? 0)}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="text-sm text-gray-500">
                  Gross Profit Margin
                </p>

                <p className="mt-2 text-3xl font-bold text-[#0b2347]">
                  {formatNumber(profitMargin ?? 0)}%
                </p>
              </div>

              <div className="rounded-lg border border-[#1e5aa8]/20 bg-[#f8fafc] p-5">
                <p className="font-medium text-[#0b2347]">
                  What does this mean?
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  If you sell at {formatMoney(sellingPrice ?? 0)}, you would
                  make {formatMoney(grossProfit ?? 0)} in gross profit
                  before other business expenses.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="mt-12 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#8b6508]">
          Step 3
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-[#0b2347]">
          Markup vs. Profit Margin
        </h2>

        <p className="mt-4 text-gray-600">
          Markup and profit margin are related, but they are not the same
          percentage.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-[#f8fafc] p-6">
            <p className="font-semibold text-[#0b2347]">
              Markup
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Markup measures how much you add to your cost to determine
              your selling price.
            </p>

            <p className="mt-4 text-sm font-medium text-[#1e5aa8]">
              Markup = Markup Amount ÷ Cost × 100
            </p>
          </div>

          <div className="rounded-lg bg-[#f8fafc] p-6">
            <p className="font-semibold text-[#0b2347]">
              Profit Margin
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Profit margin measures your gross profit as a percentage of
              your selling price.
            </p>

            <p className="mt-4 text-sm font-medium text-[#1e5aa8]">
              Margin = Gross Profit ÷ Selling Price × 100
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-[#1e5aa8]/20 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#0b2347]">
          Example
        </h2>

        <p className="mt-4 text-gray-600">
          Imagine you buy goods for <strong>380,000 TZS</strong> and want
          to add a <strong>50% markup</strong>.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-[#f8fafc] p-5">
            <p className="text-sm text-gray-500">Cost</p>

            <p className="mt-2 font-semibold text-[#0b2347]">
              TZS 380,000
            </p>
          </div>

          <div className="rounded-lg bg-[#f8fafc] p-5">
            <p className="text-sm text-gray-500">50% Markup</p>

            <p className="mt-2 font-semibold text-[#1e5aa8]">
              TZS 190,000
            </p>
          </div>

          <div className="rounded-lg bg-[#f8fafc] p-5">
            <p className="text-sm text-gray-500">Selling Price</p>

            <p className="mt-2 font-semibold text-[#0b2347]">
              TZS 570,000
            </p>
          </div>

          <div className="rounded-lg bg-[#f8fafc] p-5">
            <p className="text-sm text-gray-500">Profit Margin</p>

            <p className="mt-2 font-semibold text-[#0b2347]">
              33.33%
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-gray-500">
          Notice that a <strong>50% markup</strong> results in a{" "}
          <strong>33.33% gross profit margin</strong>. The two percentages
          use different bases for their calculation.
        </p>
      </section>

      <section className="mt-12 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-[#0b2347]">
          Important Information
        </h2>

        <p className="mt-4 text-sm leading-7 text-gray-500">
          This calculator shows the selling price based on the direct cost
          and markup percentage you enter. Gross profit shown here does not
          account for operating expenses such as salaries, rent,
          utilities, financing costs, taxes or other business expenses.
          Actual pricing decisions may also need to consider market
          conditions, competition, VAT and other applicable costs. This
          tool is provided for informational purposes and is not
          professional accounting, tax, legal or financial advice.
        </p>
      </section>

      <section className="mt-12 text-center">
        <Link
          href="/free-tools"
          className="inline-flex rounded-lg border border-[#1e5aa8] px-6 py-3 font-medium text-[#1e5aa8] transition hover:bg-[#1e5aa8] hover:text-white"
        >
          Back to Free Tools
        </Link>
      </section>
    </div>
  </main>
</>
);
}