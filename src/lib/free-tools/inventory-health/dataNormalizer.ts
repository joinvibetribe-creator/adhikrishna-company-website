import type { InventoryColumnMapping } from "@/types/inventory-health";

type NormalizedInventoryRow = {
  rowNumber: number;
  productCode: string | null;
  productDescription: string;
  quantity: number | null;
  unitCost: number | null;
  lastMovementDate: string | null;
};

function normalizeText(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function normalizeOptionalText(value: unknown): string | null {
  const text = normalizeText(value);

  return text === "" ? null : text;
}

function normalizeNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const cleaned = String(value)
    .trim()
    .replace(/,/g, "")
    .replace(/\s/g, "");

  if (cleaned === "") {
    return null;
  }

  const numberValue = Number(cleaned);

  return Number.isFinite(numberValue) ? numberValue : null;
}

function excelSerialToIsoDate(serial: number): string | null {
  if (!Number.isFinite(serial)) {
    return null;
  }

  const excelEpoch = Date.UTC(1899, 11, 30);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  const timestamp = excelEpoch + serial * millisecondsPerDay;
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

function normalizeDate(value: unknown): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return null;
    }

    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "number") {
    return excelSerialToIsoDate(value);
  }

  const text = String(value).trim();

  if (!text) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const date = new Date(`${text}T00:00:00Z`);

    return Number.isNaN(date.getTime())
      ? null
      : date.toISOString().slice(0, 10);
  }

  const parsed = new Date(text);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return null;
}

function getColumnIndex(
  headers: string[],
  mappedColumn: string | null,
): number {
  if (!mappedColumn) {
    return -1;
  }

  return headers.findIndex((header) => header === mappedColumn);
}

export function normalizeInventoryRows(
  headers: string[],
  rows: unknown[][],
  mapping: InventoryColumnMapping,
): NormalizedInventoryRow[] {
  const productCodeIndex = getColumnIndex(headers, mapping.productCode);
  const productDescriptionIndex = getColumnIndex(
    headers,
    mapping.productDescription,
  );
  const quantityIndex = getColumnIndex(headers, mapping.quantity);
  const unitCostIndex = getColumnIndex(headers, mapping.unitCost);
  const lastMovementDateIndex = getColumnIndex(
    headers,
    mapping.lastMovementDate,
  );

  return rows.map((row, index) => {
    const getValue = (columnIndex: number): unknown => {
      if (columnIndex < 0) {
        return null;
      }

      return row[columnIndex] ?? null;
    };

    return {
      rowNumber: index + 2,
      productCode: normalizeOptionalText(getValue(productCodeIndex)),
      productDescription: normalizeText(
        getValue(productDescriptionIndex),
      ),
      quantity: normalizeNumber(getValue(quantityIndex)),
      unitCost: normalizeNumber(getValue(unitCostIndex)),
      lastMovementDate: normalizeDate(
        getValue(lastMovementDateIndex),
      ),
    };
  });
}