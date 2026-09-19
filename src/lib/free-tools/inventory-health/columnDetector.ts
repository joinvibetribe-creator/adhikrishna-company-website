import type {
  ColumnDetectionResult,
  InventoryColumnKey,
  InventoryColumnMapping,
} from "@/types/inventory-health";

const REQUIRED_COLUMNS: InventoryColumnKey[] = [
  "productDescription",
  "quantity",
  "lastMovementDate",
];

const ALIASES: Record<InventoryColumnKey, string[]> = {
  productCode: [
    "product code",
    "product id",
    "sku",
    "item code",
    "item id",
    "stock code",
    "part number",
    "part no",
    "code",
  ],

  productDescription: [
    "product description",
    "description",
    "item description",
    "product name",
    "item name",
    "product",
    "item",
    "material description",
    "part description",
  ],

  quantity: [
    "quantity",
    "qty",
    "stock quantity",
    "current quantity",
    "current stock",
    "stock qty",
    "closing stock",
    "balance qty",
    "available quantity",
  ],

  unitCost: [
    "unit cost",
    "cost",
    "purchase cost",
    "purchase price",
    "cost price",
    "unit purchase price",
  ],

  lastMovementDate: [
    "last movement date",
    "last sale date",
    "last sales date",
    "last dispatch date",
    "last issue date",
    "last outbound date",
    "last transaction date",
    "last sold date",
  ],
};

function normalizeHeader(header: string): string {
  return header
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function findExactAliasMatch(
  headers: string[],
  aliases: string[],
): string | null {
  for (const header of headers) {
    const normalizedHeader = normalizeHeader(header);

    if (aliases.includes(normalizedHeader)) {
      return header;
    }
  }

  return null;
}

export function detectInventoryColumns(
  headers: string[],
): ColumnDetectionResult {
  const mapping: InventoryColumnMapping = {
    productCode: findExactAliasMatch(
      headers,
      ALIASES.productCode,
    ),

    productDescription: findExactAliasMatch(
      headers,
      ALIASES.productDescription,
    ),

    quantity: findExactAliasMatch(
      headers,
      ALIASES.quantity,
    ),

    unitCost: findExactAliasMatch(
      headers,
      ALIASES.unitCost,
    ),

    lastMovementDate: findExactAliasMatch(
      headers,
      ALIASES.lastMovementDate,
    ),
  };

  const detected: InventoryColumnKey[] = [];
  const missingRequired: InventoryColumnKey[] = [];
  const requiresConfirmation: InventoryColumnKey[] = [];

  for (const key of Object.keys(mapping) as InventoryColumnKey[]) {
    if (mapping[key]) {
      detected.push(key);
    }
  }

  for (const requiredColumn of REQUIRED_COLUMNS) {
    if (!mapping[requiredColumn]) {
      missingRequired.push(requiredColumn);
    }
  }

  return {
    mapping,
    detected,
    missingRequired,
    requiresConfirmation,
  };
}