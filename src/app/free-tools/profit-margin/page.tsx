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

export default function ProfitMarginCalculatorPage() {
  const [currency, setCurrency] = useState("TZS");
  const [salesAmount, setSalesAmount] = useState("");
  const [costAmount, setCostAmount] = useState("");
  const [includesVat, setIncludesVat] = useState(false);
  const [vatRate, setVatRate] = useState("18");

  const salesValue = Number(salesAmount);
  const costValue = Number(costAmount);
  const vatValue = Number(vatRate);

  const hasValidSales =
    salesAmount !== "" &&
    Number.isFinite(salesValue) &&
    salesValue > 0;

  const hasValidCost =
    costAmount !== "" &&
    Number.isFinite(costValue) &&
    costValue >= 0;

  const hasValidVat =
    vatRate !== "" &&
    Number.isFinite(vatValue) &&
    vatValue >= 0 &&
    vatValue < 100;

  const hasValidInputs =
    hasValidSales &&
    hasValidCost &&
    (!includesVat || hasValidVat);

  const salesBeforeVat =
    hasValidInputs && includesVat
      ? salesValue / (1 + vatValue / 100)
      : hasValidInputs
        ? salesValue
        : null;

  const vatAmount =
    hasValidInputs && includesVat && salesBeforeVat !== null
      ? salesValue - salesBeforeVat
      : null;

  const grossProfit =
    hasValidInputs && salesBeforeVat !== null
      ? salesBeforeVat - costValue
      : null;

  const profitMargin =
    hasValidInputs && salesBeforeVat !== null && salesBeforeVat > 0
      ? (grossProfit! / salesBeforeVat) * 100
      : null;

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(value);

  const formatMoney = (value: number) =>
    `${currency} ${formatNumber(value)}`;

  return (
    <>
      <header className="bg-[#0b2347] py-20">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#d4af37]">
            Free Business Tool
          </p>

          <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            Profit Margin Calculator
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-gray-200">
            Find out how much profit you make from your sales and understand
            your profit margin in simple terms.
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
                Tell Us About Your Sale
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                You do not need accounting knowledge. Just enter the amounts
                you know.
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
                    htmlFor="salesAmount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    How much did you sell the goods or services for?
                  </label>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Enter the amount the customer pays, or the selling amount
                    before VAT if VAT has not been included.
                  </p>

                  <input
                    id="salesAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={salesAmount}
                    onChange={(event) => setSalesAmount(event.target.value)}
                    placeholder="e.g. 1200000"
                    className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#1e5aa8] focus:ring-2 focus:ring-[#1e5aa8]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="costAmount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    How much did you pay to buy or produce what you sold?
                  </label>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Enter the direct amount you paid to purchase or produce the
                    goods or services that generated this sale.
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

                <div className="rounded-lg border border-gray-200 bg-[#f8fafc] p-5">
                  <p className="text-sm font-medium text-[#0b2347]">
                    Does your selling amount include VAT?
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setIncludesVat(false)}
                      className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
                        !includesVat
                          ? "bg-[#1e5aa8] text-white"
                          : "border border-gray-300 bg-white text-gray-700 hover:border-[#1e5aa8]"
                      }`}
                    >
                      No
                    </button>

                    <button
                      type="button"
                      onClick={() => setIncludesVat(true)}
                      className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
                        includesVat
                          ? "bg-[#1e5aa8] text-white"
                          : "border border-gray-300 bg-white text-gray-700 hover:border-[#1e5aa8]"
                      }`}
                    >
                      Yes
                    </button>
                  </div>

                  {includesVat && (
                    <div className="mt-5">
                      <label
                        htmlFor="vatRate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        VAT rate (%)
                      </label>

                      <input
                        id="vatRate"
                        type="number"
                        min="0"
                        max="99.99"
                        step="0.01"
                        value={vatRate}
                        onChange={(event) => setVatRate(event.target.value)}
                        placeholder="e.g. 18"
                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#1e5aa8] focus:ring-2 focus:ring-[#1e5aa8]/20"
                      />

                      <p className="mt-2 text-xs leading-5 text-gray-500">
                        The calculator uses this rate to separate VAT from the
                        VAT-inclusive selling amount. It does not determine
                        whether VAT applies to your transaction.
                      </p>
                    </div>
                  )}

                  {includesVat && (
                    <div className="mt-5 rounded-lg border border-[#d4af37]/40 bg-[#fffdf5] p-5">
                      <p className="font-semibold text-[#0b2347]">
                        Good to Know: VAT on Your Purchases
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        If you are VAT-registered, eligible VAT paid on
                        business purchases may generally be claimed as input
                        VAT, subject to applicable rules and proper
                        documentation. When you sell goods and charge VAT, that
                        VAT is generally output VAT.
                      </p>

                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        If you purchase goods without VAT, there may be no input
                        VAT from that purchase to offset against the VAT charged
                        on your sale. This can affect your VAT payable even
                        though it does <strong>not</strong> change the gross
                        profit calculated above.
                      </p>

                      <p className="mt-3 text-xs leading-5 text-gray-500">
                        VAT recovery depends on your circumstances and
                        applicable tax rules. This tool does not determine VAT
                        eligibility or tax liability.
                      </p>
                    </div>
                  )}
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
                    Enter your sales and direct cost above.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Your profit and margin will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="mt-8 space-y-5">
                  <div className="rounded-lg bg-[#f8fafc] p-5">
                    <p className="text-sm text-gray-500">
                      Sales Before VAT
                    </p>

                    <p className="mt-2 text-2xl font-bold text-[#0b2347]">
                      {formatMoney(salesBeforeVat ?? 0)}
                    </p>

                    {vatAmount !== null && (
                      <p className="mt-2 text-sm text-gray-500">
                        VAT included in your selling amount:{" "}
                        {formatMoney(vatAmount)}
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg bg-[#f8fafc] p-5">
                    <p className="text-sm text-gray-500">
                      What You Paid for the Goods / Services
                    </p>

                    <p className="mt-2 text-2xl font-bold text-[#0b2347]">
                      {formatMoney(costValue)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#f8fafc] p-5">
                    <p className="text-sm text-gray-500">Gross Profit</p>

                    <p
                      className={`mt-2 text-3xl font-bold ${
                        grossProfit !== null && grossProfit < 0
                          ? "text-red-600"
                          : "text-[#1e5aa8]"
                      }`}
                    >
                      {formatMoney(grossProfit ?? 0)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#d4af37]/40 bg-[#fffdf5] p-5">
                    <p className="text-sm text-gray-500">
                      Gross Profit Margin
                    </p>

                    <p
                      className={`mt-2 text-4xl font-bold ${
                        profitMargin !== null && profitMargin < 0
                          ? "text-red-600"
                          : "text-[#0b2347]"
                      }`}
                    >
                      {formatNumber(profitMargin ?? 0)}%
                    </p>
                  </div>

                  {grossProfit !== null && grossProfit < 0 && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-5">
                      <p className="font-medium text-red-800">
                        Your direct cost is higher than your sales before VAT.
                      </p>

                      <p className="mt-1 text-sm leading-6 text-red-700">
                        This means the sale produces a gross loss rather than a
                        gross profit.
                      </p>
                    </div>
                  )}

                  {grossProfit !== null && grossProfit >= 0 && (
                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                      <p className="font-medium text-[#0b2347]">
                        What does your margin mean?
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        For every {currency} 100 of sales before VAT,
                        approximately {currency}{" "}
                        {formatNumber(profitMargin ?? 0)} remains after
                        covering the direct cost of the goods or services.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          <section className="mt-12 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#8b6508]">
              Step 3
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-[#0b2347]">
              Understand the Calculation
            </h2>

            <div className="mt-6 space-y-5 text-gray-600">
              <div>
                <p className="font-semibold text-[#0b2347]">Your Sales</p>

                <p className="mt-1 text-sm leading-6">
                  This is the value of the goods or services you sold. If your
                  selling amount includes VAT, the calculator separates the VAT
                  before calculating your gross profit.
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#0b2347]">
                  Your Direct Cost
                </p>

                <p className="mt-1 text-sm leading-6">
                  This is what you paid to buy or produce the goods or services
                  that you sold. It is not the same as all the expenses of
                  running your business.
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#0b2347]">Gross Profit</p>

                <p className="mt-1 text-sm leading-6">
                  Your sales before VAT minus the direct cost of the goods or
                  services sold.
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#0b2347]">
                  Gross Profit Margin
                </p>

                <p className="mt-1 text-sm leading-6">
                  Your gross profit expressed as a percentage of your sales
                  before VAT.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-12 rounded-xl border border-[#1e5aa8]/20 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#0b2347]">
              Example
            </h2>

            <p className="mt-4 text-gray-600">
              Imagine you buy goods for <strong>380,000 TZS</strong> and sell
              them for <strong>1,200,000 TZS before VAT</strong>.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-[#f8fafc] p-5">
                <p className="text-sm text-gray-500">Sales</p>

                <p className="mt-2 font-semibold text-[#0b2347]">
                  TZS 1,200,000
                </p>
              </div>

              <div className="rounded-lg bg-[#f8fafc] p-5">
                <p className="text-sm text-gray-500">Direct Cost</p>

                <p className="mt-2 font-semibold text-[#0b2347]">
                  TZS 380,000
                </p>
              </div>

              <div className="rounded-lg bg-[#f8fafc] p-5">
                <p className="text-sm text-gray-500">Gross Profit</p>

                <p className="mt-2 font-semibold text-[#1e5aa8]">
                  TZS 820,000
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-gray-500">
              The resulting gross profit margin is approximately{" "}
              <strong>68.33%</strong>.
            </p>
          </section>

          <section className="mt-12 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-[#0b2347]">
              Important Information
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500">
              This calculator provides an estimate based on the information you
              enter. Gross profit and gross margin are different from net
              profit because they do not account for all operating expenses
              such as salaries, rent, utilities, financing costs and other
              business expenses. VAT treatment can also vary depending on the
              transaction and applicable rules. This tool is provided for
              informational purposes and is not professional accounting, tax,
              legal or financial advice.
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

