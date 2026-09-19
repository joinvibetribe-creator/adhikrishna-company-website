"use client";

import { useRef, useState } from "react";
import {
  readInventoryFile,
  type RawInventoryData,
} from "@/lib/free-tools/inventory-health/fileReader";
import { normalizeInventoryRows } from "@/lib/free-tools/inventory-health/dataNormalizer";
import { detectInventoryColumns } from "@/lib/free-tools/inventory-health/columnDetector";
import { validateInventoryRows } from "@/lib/free-tools/inventory-health/dataValidator";
import { analyzeInventoryRows } from "@/lib/free-tools/inventory-health/inventoryEngine";
import { analyzeInventoryAttention } from "@/lib/free-tools/inventory-health/attentionEngine";
import InventoryColumnMapper from "@/components/free-tools/inventory-health/InventoryColumnMapper";
import type {
  ColumnDetectionResult,
  InventoryColumnMapping,
  InventoryValidationResult,
  InventoryAttentionItem,
} from "@/types/inventory-health";


const COLUMN_LABELS: Record<keyof InventoryColumnMapping, string> = {
  productCode: "Product Code",
  productDescription: "Product Description",
  quantity: "Quantity",
  unitCost: "Unit Cost",
  lastMovementDate: "Last Outbound Movement Date",
};

const REQUIRED_COLUMNS = new Set([
  "productDescription",
  "quantity",
  "lastMovementDate",
]);

const CURRENCIES = [
  "TZS",
  "USD",
  "EUR",
  "GBP",
  "KES",
  "UGX",
  "ZMW",
  "ZAR",
  "INR",
];

function getTodayAsIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

function formatStockValue(value: number | null): string {
  if (value === null) {
    return "Unavailable";
  }

  return formatNumber(value);
}

function getPublicStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: "Active Stock",
    "slow-moving": "Slow-Moving Stock",
    "potential-dead": "Potential Dead Stock",
    "no-stock": "No Stock",
    "insufficient-data": "Insufficient Data",
    "data-quality-issue": "Data Quality Issue",
  };

  return labels[status] ?? status;
}

function getPublicAttentionFlagLabel(flag: string): string {
  const labels: Record<string, string> = {
    "high-value-slow-moving": "High-Value Slow-Moving Inventory",
    "high-value-potential-dead": "High-Value Potential Dead Stock",
    "large-quantity-limited-movement":
      "Large Quantity With Limited Movement",
    "missing-movement-date": "Missing Movement Information",
    "missing-unit-cost": "Missing Unit Cost",
  };

  return labels[flag] ?? flag;
}


export default function InventoryHealthPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [result, setResult] = useState<RawInventoryData | null>(null);
    const [detection, setDetection] =
    useState<ColumnDetectionResult | null>(null);
  const [mapping, setMapping] =
    useState<InventoryColumnMapping | null>(null);
  const [validation, setValidation] =
    useState<InventoryValidationResult | null>(null);
  const [engineResult, setEngineResult] = useState<ReturnType<
    typeof analyzeInventoryRows
  > | null>(null);
  const [attentionItems, setAttentionItems] = useState<
    InventoryAttentionItem[]
  >([]);
  const [analysisDate, setAnalysisDate] = useState(
    getTodayAsIsoDate(),
  );
  const [currency, setCurrency] = useState("TZS");
  const [error, setError] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setResult(null);
    setDetection(null);
    setMapping(null);
    setValidation(null);
    setEngineResult(null);
    setAttentionItems([]);
    setError("");
    setIsReading(true);

    try {
      const data = await readInventoryFile(file);
      const detectedColumns = detectInventoryColumns(data.headers);

      setResult(data);
      setDetection(detectedColumns);
      setMapping(detectedColumns.mapping);
    } catch (readError) {
      setError(
        readError instanceof Error
          ? readError.message
          : "An unexpected error occurred.",
      );
    } finally {
      setIsReading(false);
    }

    event.target.value = "";
  }

  function validateMapping(
    selectedMapping: InventoryColumnMapping,
  ): string | null {
    const missingRequired = Array.from(REQUIRED_COLUMNS).filter(
      (key) => !selectedMapping[key as keyof InventoryColumnMapping],
    );

    if (missingRequired.length > 0) {
      return `Please map all required columns: ${missingRequired
        .map(
          (key) =>
            COLUMN_LABELS[key as keyof InventoryColumnMapping],
        )
        .join(", ")}.`;
    }

    const mappedEntries = Object.entries(selectedMapping).filter(
      ([, value]) => value !== null,
    );

    const mappedHeaders = mappedEntries.map(([, value]) => value);
    const duplicateHeaders = mappedHeaders.filter(
      (header, index) =>
        mappedHeaders.indexOf(header) !== index,
    );

    if (duplicateHeaders.length > 0) {
      const uniqueDuplicateHeaders = Array.from(
        new Set(duplicateHeaders),
      );

      return `The same spreadsheet column cannot be mapped to multiple fields: ${uniqueDuplicateHeaders.join(
        ", ",
      )}.`;
    }

    return null;
  }

  function handleAnalyze() {
    if (!result || !mapping) {
      return;
    }

    setError("");
    setIsAnalyzing(true);
    setValidation(null);
    setEngineResult(null);
    setAttentionItems([]);

    try {
      if (!analysisDate) {
        throw new Error("Please select an analysis date.");
      }

      const mappingError = validateMapping(mapping);

      if (mappingError) {
        throw new Error(mappingError);
      }

      const normalized = normalizeInventoryRows(
        result.headers,
        result.rows,
        mapping,
      );

      const validationResult = validateInventoryRows(
        normalized,
        analysisDate,
      );

      const inventoryAnalysis = analyzeInventoryRows(
        normalized,
        analysisDate,
      );

      const inventoryAttention = analyzeInventoryAttention(
        inventoryAnalysis.records,
      );

      setValidation(validationResult);
      setEngineResult(inventoryAnalysis);
      setAttentionItems(inventoryAttention);
    } catch (analysisError) {
      setError(
        analysisError instanceof Error
          ? analysisError.message
          : "An unexpected error occurred during analysis.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function getAttentionLabel(
    item: InventoryAttentionItem,
  ): string {
    return item.title;
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#1E5AA8]">
            Free Tool
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#0B2347]">
            Inventory Health Checker
          </h1>

          <p className="mt-3 max-w-3xl text-slate-600">
            Analyze your inventory data to identify active, slow-moving and
            potentially dead stock. Upload an Excel or CSV file to get a
            structured view of inventory movement, stock value and areas that
            may deserve further review.
          </p>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-[#0B2347]">
              How It Works
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Review your inventory in three simple steps. The tool uses the
              information in your file to assess stock movement and identify
              records that may require further review.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-[#1E5AA8]">
                  1. Upload
                </p>
                <h3 className="mt-2 font-semibold text-[#0B2347]">
                  Provide your inventory file
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Upload an Excel or CSV file containing your inventory
                  information.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-[#1E5AA8]">
                  2. Confirm
                </p>
                <h3 className="mt-2 font-semibold text-[#0B2347]">
                  Review your columns
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Review the columns detected from your file and confirm
                  which fields should be used for the analysis.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-[#1E5AA8]">
                  3. Analyze
                </p>
                <h3 className="mt-2 font-semibold text-[#0B2347]">
                  Understand inventory movement
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  See active, slow-moving and potentially dead stock, along
                  with stock values and areas that may deserve attention.
                </p>
              </div>
            </div>
          </section>
          <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-[#0B2347]">
              Upload Your Inventory File
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Supported formats: .xlsx and .csv
            </p>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Required: Product Description, Current Quantity and Last Outbound
              Movement Date. Product Code or SKU and Unit Cost are recommended
              for a more complete analysis.
            </p>

            <input
              ref={fileInputRef}
              id="inventory-file"
              type="file"
              accept=".xlsx,.csv"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={openFilePicker}
              className="mt-5 rounded-xl bg-[#1E5AA8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B2347]"
            >
              Choose Inventory File
            </button>
          </div>

          {isReading && (
            <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              Reading your inventory file and detecting columns...
            </div>
          )}

          {result && detection && mapping && (
            <div className="mt-8 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-[#0B2347]">
                  Uploaded File
                </h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      File Name
                    </p>

                    <p className="mt-1 break-all font-medium text-slate-900">
                      {result.fileName}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      File Type
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {result.fileType}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      {result.fileType === "csv" ? "Source" : "Worksheet"}
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {result.fileType === "csv"
                        ? "CSV file"
                        : (result.sheetName ?? "None")}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Records
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {result.rowCount}
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#0B2347]">
                  Review Detected Columns
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  We automatically matched columns from your file to the
                  information needed for inventory analysis. Review the
                  matches below before continuing.
                </p>
                

                <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                          What We Need
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                          Detected Column
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                          Requirement
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {(
                        Object.keys(
                          COLUMN_LABELS,
                        ) as Array<keyof InventoryColumnMapping>
                      ).map((key) => {
                        const detectedColumn = detection.mapping[key];
                        const isRequired = REQUIRED_COLUMNS.has(key);

                        return (
                          <tr
                            key={key}
                            className="border-t border-slate-200"
                          >
                            <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                              {COLUMN_LABELS[key]}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                              {detectedColumn ?? "Not detected"}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                              {isRequired
                                ? "Required"
                                : "Recommended"}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3">
                              {detectedColumn ? (
                                <span className="font-semibold text-green-700">
                                  Detected
                                </span>
                              ) : isRequired ? (
                                <span className="font-semibold text-red-700">
                                  Missing
                                </span>
                              ) : (
                                <span className="font-semibold text-amber-700">
                                  Not detected
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              <InventoryColumnMapper
                headers={result.headers}
                mapping={mapping}
                onMappingChange={setMapping}
              />

              <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
                <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Confirmed Column Mapping
                  </p>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {(
                      Object.keys(
                        mapping,
                      ) as Array<keyof InventoryColumnMapping>
                    ).map((key) => (
                      <div
                        key={key}
                        className="rounded-lg bg-slate-50 px-3 py-2 text-sm"
                      >
                        <span className="font-semibold text-[#0B2347]">
                          {COLUMN_LABELS[key]}:
                        </span>{" "}
                        <span className="text-slate-700">
                          {mapping[key] ?? "Not mapped"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                  Step 3
                </p>

                <h2 className="mt-1 text-xl font-bold text-blue-950">
                  Run Inventory Analysis
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-blue-800">
                  Once the column mapping is confirmed, set the analysis
                  date and currency, then run the inventory analysis.
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="inventory-analysis-date"
                      className="block text-sm font-semibold text-[#0B2347]"
                    >
                      Analysis Date
                    </label>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Movement age will be calculated relative to this
                      date. It defaults to today, and you can change it to review inventory movement over a different period.
                    </p>

                    <input
                      id="inventory-analysis-date"
                      type="date"
                      value={analysisDate}
                      onChange={(event) =>
                        setAnalysisDate(event.target.value)
                      }
                      className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1E5AA8] focus:ring-2 focus:ring-[#1E5AA8]/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="inventory-currency"
                      className="block text-sm font-semibold text-[#0B2347]"
                    >
                      Currency
                    </label>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Used only to label monetary values. No currency
                      conversion is performed.
                    </p>

                    <select
                      id="inventory-currency"
                      value={currency}
                      onChange={(event) =>
                        setCurrency(event.target.value)
                      }
                      className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1E5AA8] focus:ring-2 focus:ring-[#1E5AA8]/20"
                    >
                      {CURRENCIES.map((currencyOption) => (
                        <option
                          key={currencyOption}
                          value={currencyOption}
                        >
                          {currencyOption}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-blue-200 bg-white p-4">
                  <p className="text-sm font-semibold text-[#0B2347]">
                    Selected Analysis Settings
                  </p>

                  <p className="mt-2 text-sm text-slate-700">
                    Analysis Date:{" "}
                    <span className="font-semibold">
                      {analysisDate || "Not selected"}
                    </span>
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    Currency:{" "}
                    <span className="font-semibold">
                      {currency}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="mt-5 rounded-xl bg-[#1E5AA8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B2347] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAnalyzing
                    ? "Analyzing Inventory..."
                    : "Analyze Inventory"}
                </button>
              </section>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-semibold text-red-800">
                Analysis failed
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>
          )}

          {validation && engineResult && (
            <div className="mt-8 space-y-10">
              <section>
                <h2 className="text-xl font-bold text-[#0B2347]">
                  Data Validation
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  Validation checks whether each row contains usable
                  inventory information before classification.
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Total Rows
                    </p>

                    <p className="mt-1 text-2xl font-bold text-[#0B2347]">
                      {validation.totalRows}
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-50 p-4">
                    <p className="text-xs font-semibold uppercase text-green-700">
                      Valid Rows
                    </p>

                    <p className="mt-1 text-2xl font-bold text-green-800">
                      {validation.validRows}
                    </p>
                  </div>

                  <div className="rounded-xl bg-amber-50 p-4">
                    <p className="text-xs font-semibold uppercase text-amber-700">
                      Insufficient Data
                    </p>

                    <p className="mt-1 text-2xl font-bold text-amber-800">
                      {validation.insufficientDataRows}
                    </p>
                  </div>

                  <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-xs font-semibold uppercase text-red-700">
                      Data Quality Issues
                    </p>

                    <p className="mt-1 text-2xl font-bold text-red-800">
                      {validation.dataQualityIssueRows}
                    </p>
                  </div>
                </div>

                {validation.issues.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-[#0B2347]">
                      Validation Issues
                    </h3>

                    <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
                      <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                              Row
                            </th>

                            <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                              Issue
                            </th>

                            <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                              Message
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {validation.issues.map((issue, index) => (
                            <tr
                              key={`${issue.rowNumber}-${issue.type === "missing-movement-date" ? "Missing Movement Information" : issue.type === "negative-quantity" ? "Invalid Quantity" : issue.type}-${index}`}
                              className="border-t border-slate-200"
                            >
                              <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                                {issue.rowNumber}
                              </td>

                              <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                {issue.type === "missing-movement-date" ? "Missing Movement Information" : issue.type === "negative-quantity" ? "Invalid Quantity" : issue.type}
                              </td>

                              <td className="px-4 py-3 text-slate-700">
                                {issue.message}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {validation.issues.length === 0 && (
                  <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
                    <p className="font-semibold text-green-800">
                      No validation issues found.
                    </p>

                    <p className="mt-1 text-sm text-green-700">
                      All uploaded rows contain the information required
                      for validation.
                    </p>
                  </div>
                )}
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#0B2347]">
                  Inventory Analysis
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  Analysis date:{" "}
                  <span className="font-semibold text-slate-900">
                    {engineResult.records[0]?.analysisDate ??
                      "Unavailable"}
                  </span>
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  Currency:{" "}
                  <span className="font-semibold text-slate-900">
                    {currency}
                  </span>
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  Classification uses general 90-day and 180-day movement guidelines. Actual inventory movement patterns may vary by business, product and season.
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl bg-green-50 p-4">
                    <p className="text-xs font-semibold uppercase text-green-700">
                      Active Stock
                    </p>

                    <p className="mt-1 text-2xl font-bold text-green-800">
                      {engineResult.summary.active.count}
                    </p>

                    <p className="mt-1 text-sm text-green-700">
                      Quantity:{" "}
                      {formatNumber(
                        engineResult.summary.active.quantity,
                      )}
                    </p>

                    <p className="mt-1 text-sm text-green-700">
                      Value:{" "}
                      {formatStockValue(
                        engineResult.summary.active.stockValue,
                      )}{" "}
                      {engineResult.summary.active.stockValue !== null
                        ? currency
                        : ""}
                    </p>
                  </div>

                  <div className="rounded-xl bg-amber-50 p-4">
                    <p className="text-xs font-semibold uppercase text-amber-700">
                      Slow-Moving Stock
                    </p>

                    <p className="mt-1 text-2xl font-bold text-amber-800">
                      {engineResult.summary.slowMoving.count}
                    </p>

                    <p className="mt-1 text-sm text-amber-700">
                      Quantity:{" "}
                      {formatNumber(
                        engineResult.summary.slowMoving.quantity,
                      )}
                    </p>

                    <p className="mt-1 text-sm text-amber-700">
                      Value:{" "}
                      {formatStockValue(
                        engineResult.summary.slowMoving.stockValue,
                      )}{" "}
                      {engineResult.summary.slowMoving.stockValue !== null
                        ? currency
                        : ""}
                    </p>
                  </div>

                  <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-xs font-semibold uppercase text-red-700">
                      Potential Dead Stock
                    </p>

                    <p className="mt-1 text-2xl font-bold text-red-800">
                      {engineResult.summary.potentialDead.count}
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      Quantity:{" "}
                      {formatNumber(
                        engineResult.summary.potentialDead.quantity,
                      )}
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      Value:{" "}
                      {formatStockValue(
                        engineResult.summary.potentialDead.stockValue,
                      )}{" "}
                      {engineResult.summary.potentialDead.stockValue !== null
                        ? currency
                        : ""}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-100 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-600">
                      No Stock
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-800">
                      {engineResult.summary.noStock.count}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Quantity:{" "}
                      {formatNumber(
                        engineResult.summary.noStock.quantity,
                      )}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Value:{" "}
                      {formatStockValue(
                        engineResult.summary.noStock.stockValue,
                      )}{" "}
                      {engineResult.summary.noStock.stockValue !== null
                        ? currency
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-amber-50 p-4">
                    <p className="text-xs font-semibold uppercase text-amber-700">
                      Insufficient Data
                    </p>

                    <p className="mt-1 text-2xl font-bold text-amber-800">
                      {engineResult.summary.insufficientData.count}
                    </p>

                    <p className="mt-1 text-sm text-amber-700">
                      Quantity:{" "}
                      {formatNumber(
                        engineResult.summary.insufficientData.quantity,
                      )}
                    </p>

                    <p className="mt-1 text-sm text-amber-700">
                      Value:{" "}
                      {formatStockValue(
                        engineResult.summary.insufficientData.stockValue,
                      )}{" "}
                      {engineResult.summary.insufficientData.stockValue !== null
                        ? currency
                        : ""}
                    </p>
                  </div>

                  <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-xs font-semibold uppercase text-red-700">
                      Data Quality Issues
                    </p>

                    <p className="mt-1 text-2xl font-bold text-red-800">
                      {engineResult.summary.dataQualityIssue.count}
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      Quantity:{" "}
                      {formatNumber(
                        engineResult.summary.dataQualityIssue.quantity,
                      )}
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      Value:{" "}
                      {formatStockValue(
                        engineResult.summary.dataQualityIssue.stockValue,
                      )}{" "}
                      {engineResult.summary.dataQualityIssue.stockValue !== null
                        ? currency
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                          Product
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                          Quantity
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                          Unit Cost
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                          Stock Value
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                          Last Outbound Movement
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                          Days Since Outbound Movement
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                          Status
                        </th>

                        <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                          Attention Flags
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {engineResult.records.map((record) => (
                        <tr
                          key={record.rowNumber}
                          className="border-t border-slate-200"
                        >
                          <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                            {record.productDescription || "—"}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                            {formatNumber(record.quantity)}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                            {record.unitCost === null
                              ? "—"
                              : formatNumber(record.unitCost)}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                            {formatStockValue(record.stockValue)}
                            {record.stockValue !== null
                              ? ` ${currency}`
                              : ""}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                            {record.lastMovementDate ?? "—"}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                            {record.daysSinceMovement ?? "—"}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 font-semibold">
                            {getPublicStatusLabel(record.status)}
                          </td>

                          <td className="px-4 py-3">
                            {record.attentionFlags.length === 0 ? (
                              <span className="text-slate-400">
                                —
                              </span>
                            ) : (
                              <div className="space-y-1">
                                {record.attentionFlags.map((flag) => (
                                  <div
                                    key={getPublicAttentionFlagLabel(flag)}
                                    className="text-xs font-semibold text-amber-700"
                                  >
                                    {getPublicAttentionFlagLabel(flag)}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <p className="font-semibold text-blue-900">
                    Analysis Summary
                  </p>

                  <p className="mt-1 text-sm text-blue-800">
                    Total records:{" "}
                    {formatNumber(engineResult.summary.totalRecords)}
                  </p>

                  <p className="mt-1 text-sm text-blue-800">
                    Total quantity:{" "}
                    {formatNumber(engineResult.summary.totalQuantity)}
                  </p>

                  <p className="mt-1 text-sm text-blue-800">
                    Total stock value:{" "}
                    {formatStockValue(
                      engineResult.summary.totalStockValue,
                    )}{" "}
                    {engineResult.summary.totalStockValue !== null
                      ? currency
                      : ""}
                  </p>

                  <p className="mt-1 text-sm text-blue-800">
                    Records needing review:{" "}
                    {formatNumber(
                      engineResult.summary.recordsNeedingReview,
                    )}
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#0B2347]">
                  Attention Areas
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  These flags identify records that may warrant further
                  review. They are not automatic business recommendations.
                </p>

                {attentionItems.length === 0 ? (
                  <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-5">
                    <p className="font-semibold text-green-800">
                      No attention flags identified.
                    </p>

                    <p className="mt-1 text-sm text-green-700">
                      The current dataset does not contain records meeting
                      the attention conditions used by this engine.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    {attentionItems.map((item) => (
                      <div
                        key={item.flag}
                        className="rounded-xl border border-amber-200 bg-amber-50 p-5"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="font-semibold text-amber-900">
                            {getAttentionLabel(item)}
                          </h3>

                          <span className="w-fit rounded-full border border-amber-300 px-3 py-1 text-xs font-semibold text-amber-800">
                            {item.recordCount} record
                            {item.recordCount === 1 ? "" : "s"}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-amber-800">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                            </section>

              <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-xl font-bold text-[#0B2347]">
                  Important Information
                </h2>

                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
  <li>
    The 90-day and 180-day movement thresholds are general
    guidelines, not universal rules.
  </li>

  <li>
    Seasonal, project-based, specialist or slow-cycle
    products may naturally remain in inventory for longer
    periods.
  </li>

  <li>
    “Potential Dead Stock” means the item has not shown
    recent outbound movement according to the tool&apos;s
    guidelines. It does not mean the inventory has no future
    value.
  </li>

  <li>
    Results depend on the accuracy and completeness of the
    information provided in your inventory file.
  </li>
</ul>
              </section>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}


















