import type {
  InventoryRecord,
  InventoryStatus,
  InventoryStatusSummary,
} from "@/types/inventory-health";

type NormalizedInventoryRow = {
  rowNumber: number;
  productCode: string | null;
  productDescription: string;
  quantity: number | null;
  unitCost: number | null;
  lastMovementDate: string | null;
};

const ACTIVE_MAX_DAYS = 90;
const SLOW_MOVING_MAX_DAYS = 180;

function calculateDaysSinceMovement(
  lastMovementDate: string,
  analysisDate: string,
): number | null {
  const movementTime = new Date(
    `${lastMovementDate}T00:00:00Z`,
  ).getTime();

  const analysisTime = new Date(
    `${analysisDate}T00:00:00Z`,
  ).getTime();

  if (
    Number.isNaN(movementTime) ||
    Number.isNaN(analysisTime)
  ) {
    return null;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.floor(
    (analysisTime - movementTime) / millisecondsPerDay,
  );
}

function classifyInventoryStatus(
  row: NormalizedInventoryRow,
  daysSinceMovement: number | null,
): InventoryStatus {
  if (
    row.quantity === null ||
    !Number.isFinite(row.quantity) ||
    row.quantity < 0 ||
    !row.productDescription.trim()
  ) {
    return "data-quality-issue";
  }

  if (row.quantity === 0) {
    return "no-stock";
  }

  if (!row.lastMovementDate || daysSinceMovement === null) {
    return "insufficient-data";
  }

  if (daysSinceMovement < 0) {
    return "data-quality-issue";
  }

  if (daysSinceMovement <= ACTIVE_MAX_DAYS) {
    return "active";
  }

  if (daysSinceMovement <= SLOW_MOVING_MAX_DAYS) {
    return "slow-moving";
  }

  return "potential-dead";
}

function calculateStockValue(
  quantity: number,
  unitCost: number | null,
): number | null {
  if (
    unitCost === null ||
    !Number.isFinite(unitCost) ||
    unitCost < 0
  ) {
    return null;
  }

  return quantity * unitCost;
}

function createEmptyStatusSummary(): InventoryStatusSummary {
  return {
    count: 0,
    quantity: 0,
    stockValue: 0,
  };
}

function addRecordToSummary(
  summary: InventoryStatusSummary,
  record: InventoryRecord,
): void {
  summary.count += 1;

  if (record.status !== "data-quality-issue") {
    summary.quantity += record.quantity;
  }

  if (
    record.status === "data-quality-issue" ||
    record.stockValue === null
  ) {
    if (record.status !== "data-quality-issue") {
      summary.stockValue = null;
    }

    return;
  }

  if (summary.stockValue !== null) {
    summary.stockValue += record.stockValue;
  }
}

function buildSummary(
  records: InventoryRecord[],
) {
  const active = createEmptyStatusSummary();
  const slowMoving = createEmptyStatusSummary();
  const potentialDead = createEmptyStatusSummary();
  const noStock = createEmptyStatusSummary();
  const insufficientData = createEmptyStatusSummary();
  const dataQualityIssue = createEmptyStatusSummary();

  for (const record of records) {
    switch (record.status) {
      case "active":
        addRecordToSummary(active, record);
        break;

      case "slow-moving":
        addRecordToSummary(slowMoving, record);
        break;

      case "potential-dead":
        addRecordToSummary(potentialDead, record);
        break;

      case "no-stock":
        addRecordToSummary(noStock, record);
        break;

      case "insufficient-data":
        addRecordToSummary(insufficientData, record);
        break;

      case "data-quality-issue":
        addRecordToSummary(dataQualityIssue, record);
        break;
    }
  }

  const inventoryRecords = records.filter(
    (record) => record.status !== "data-quality-issue",
  );

  const totalQuantity = inventoryRecords.reduce(
    (total, record) => total + record.quantity,
    0,
  );

  const recordsWithMissingStockValue = inventoryRecords.some(
    (record) => record.stockValue === null,
  );

  const totalStockValue = recordsWithMissingStockValue
    ? null
    : inventoryRecords.reduce(
        (total, record) =>
          total + (record.stockValue ?? 0),
        0,
      );

  return {
    totalRecords: records.length,
    totalQuantity,
    totalStockValue,
    active,
    slowMoving,
    potentialDead,
    noStock,
    insufficientData,
    dataQualityIssue,
    recordsNeedingReview:
      slowMoving.count +
      potentialDead.count +
      insufficientData.count +
      dataQualityIssue.count,
  };
}

export function analyzeInventoryRows(
  rows: NormalizedInventoryRow[],
  analysisDate: string,
): {
  records: InventoryRecord[];
  summary: ReturnType<typeof buildSummary>;
} {
  const records: InventoryRecord[] = rows.map((row) => {
    const daysSinceMovement = row.lastMovementDate
      ? calculateDaysSinceMovement(
          row.lastMovementDate,
          analysisDate,
        )
      : null;

    const status = classifyInventoryStatus(
      row,
      daysSinceMovement,
    );

    const stockValue =
      row.quantity !== null &&
      Number.isFinite(row.quantity) &&
      row.quantity >= 0
        ? calculateStockValue(
            row.quantity,
            row.unitCost,
          )
        : null;

    return {
      rowNumber: row.rowNumber,
      productCode: row.productCode,
      productDescription: row.productDescription,
      quantity: row.quantity ?? 0,
      unitCost: row.unitCost,
      lastMovementDate: row.lastMovementDate,
      analysisDate,
      daysSinceMovement,
      stockValue,
      status,
      dataQualityStatus:
        status === "data-quality-issue"
          ? "data-quality-issue"
          : status === "insufficient-data"
            ? "insufficient-data"
            : "valid",
      attentionFlags: [],
    };
  });

  return {
    records,
    summary: buildSummary(records),
  };
}