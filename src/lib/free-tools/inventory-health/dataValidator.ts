import type {
  InventoryValidationIssue,
  InventoryValidationIssueType,
  InventoryValidationResult,
} from "@/types/inventory-health";

type NormalizedInventoryRow = {
  rowNumber: number;
  productCode: string | null;
  productDescription: string;
  quantity: number | null;
  unitCost: number | null;
  lastMovementDate: string | null;
};

function addIssue(
  issues: InventoryValidationIssue[],
  rowNumber: number,
  type: InventoryValidationIssueType,
  message: string,
): void {
  issues.push({
    rowNumber,
    type,
    message,
  });
}

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.toISOString().slice(0, 10) === value;
}

function isFutureDate(
  value: string,
  analysisDate: string,
): boolean {
  return value > analysisDate;
}

export function validateInventoryRows(
  rows: NormalizedInventoryRow[],
  analysisDate: string,
): InventoryValidationResult {
  const issues: InventoryValidationIssue[] = [];

  let validRows = 0;
  let insufficientDataRows = 0;
  let dataQualityIssueRows = 0;

  for (const row of rows) {
    let hasDataQualityIssue = false;
    let hasInsufficientData = false;

    if (!row.productDescription.trim()) {
      addIssue(
        issues,
        row.rowNumber,
        "missing-product-description",
        "Product description is missing.",
      );

      hasDataQualityIssue = true;
    }

    if (row.quantity === null || !Number.isFinite(row.quantity)) {
      addIssue(
        issues,
        row.rowNumber,
        "invalid-quantity",
        "Quantity is missing or is not a valid number.",
      );

      hasDataQualityIssue = true;
    } else if (row.quantity < 0) {
      addIssue(
        issues,
        row.rowNumber,
        "negative-quantity",
        "Quantity cannot be negative.",
      );

      hasDataQualityIssue = true;
    }

    if (row.unitCost !== null) {
      if (!Number.isFinite(row.unitCost)) {
        addIssue(
          issues,
          row.rowNumber,
          "invalid-unit-cost",
          "Unit cost is not a valid number.",
        );

        hasDataQualityIssue = true;
      } else if (row.unitCost < 0) {
        addIssue(
          issues,
          row.rowNumber,
          "negative-unit-cost",
          "Unit cost cannot be negative.",
        );

        hasDataQualityIssue = true;
      }
    }

    if (!row.lastMovementDate) {
      addIssue(
        issues,
        row.rowNumber,
        "missing-movement-date",
        "Last outbound movement date is missing.",
      );

      hasInsufficientData = true;
    } else if (!isValidIsoDate(row.lastMovementDate)) {
      addIssue(
        issues,
        row.rowNumber,
        "invalid-movement-date",
        "Last outbound movement date is not a valid date.",
      );

      hasDataQualityIssue = true;
    } else if (isFutureDate(row.lastMovementDate, analysisDate)) {
      addIssue(
        issues,
        row.rowNumber,
        "future-movement-date",
        "Last outbound movement date cannot be after the analysis date.",
      );

      hasDataQualityIssue = true;
    }

    if (hasDataQualityIssue) {
      dataQualityIssueRows += 1;
    } else if (hasInsufficientData) {
      insufficientDataRows += 1;
    } else {
      validRows += 1;
    }
  }

  return {
    totalRows: rows.length,
    validRows,
    insufficientDataRows,
    dataQualityIssueRows,
    issues,
  };
}