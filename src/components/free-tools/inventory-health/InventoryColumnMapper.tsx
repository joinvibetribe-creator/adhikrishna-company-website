"use client";

import type {
  InventoryColumnKey,
  InventoryColumnMapping,
} from "@/types/inventory-health";

type InventoryColumnMapperProps = {
  headers: string[];
  mapping: InventoryColumnMapping;
  onMappingChange: (mapping: InventoryColumnMapping) => void;
};

const COLUMN_LABELS: Record<InventoryColumnKey, string> = {
  productCode: "Product Code",
  productDescription: "Product Description",
  quantity: "Quantity",
  unitCost: "Unit Cost",
  lastMovementDate: "Last Movement Date",
};

const COLUMN_DESCRIPTIONS: Record<InventoryColumnKey, string> = {
  productCode: "Optional identifier such as SKU, item code or part number.",
  productDescription: "The name or description of the inventory item.",
  quantity: "The current quantity of inventory available.",
  unitCost: "Optional cost per unit used to calculate inventory value.",
  lastMovementDate:
    "The most recent outbound movement date, such as a sale, dispatch or issue.",
};

const REQUIRED_COLUMNS = new Set<InventoryColumnKey>([
  "productDescription",
  "quantity",
  "lastMovementDate",
]);

const COLUMN_ORDER: InventoryColumnKey[] = [
  "productCode",
  "productDescription",
  "quantity",
  "unitCost",
  "lastMovementDate",
];

export default function InventoryColumnMapper({
  headers,
  mapping,
  onMappingChange,
}: InventoryColumnMapperProps) {
  function updateMapping(
    columnKey: InventoryColumnKey,
    selectedHeader: string,
  ) {
    onMappingChange({
      ...mapping,
      [columnKey]: selectedHeader === "" ? null : selectedHeader,
    });
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-[#1E5AA8]">
          Step 2
        </p>

        <h2 className="mt-1 text-xl font-bold text-[#0B2347]">
          Confirm Your Columns
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          We detected some columns automatically. Please confirm that each
          column is mapped to the correct inventory information before
          continuing with the analysis.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {COLUMN_ORDER.map((columnKey) => {
          const isRequired = REQUIRED_COLUMNS.has(columnKey);
          const selectedHeader = mapping[columnKey];

          return (
            <div
              key={columnKey}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[#0B2347]">
                      {COLUMN_LABELS[columnKey]}
                    </p>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isRequired
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {isRequired ? "Required" : "Recommended"}
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {COLUMN_DESCRIPTIONS[columnKey]}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor={`inventory-column-${columnKey}`}
                    className="sr-only"
                  >
                    Select column for {COLUMN_LABELS[columnKey]}
                  </label>

                  <select
                    id={`inventory-column-${columnKey}`}
                    value={selectedHeader ?? ""}
                    onChange={(event) =>
                      updateMapping(columnKey, event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1E5AA8] focus:ring-2 focus:ring-[#1E5AA8]/20"
                  >
                    <option value="">Not mapped</option>

                    {headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:text-right">
                  {selectedHeader ? (
                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                      ✓ Mapped
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      Not mapped
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm font-semibold text-blue-900">
          Important
        </p>

        <p className="mt-1 text-sm leading-6 text-blue-800">
          Product Description, Quantity and Last Movement Date are required
          for inventory movement analysis. Product Code and Unit Cost are
          recommended. If Unit Cost is not available, the tool can still
          analyze inventory movement, but inventory value cannot be calculated.
        </p>
      </div>
    </section>
  );
}
