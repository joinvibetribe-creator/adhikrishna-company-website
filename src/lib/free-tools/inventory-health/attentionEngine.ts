import type {
  AttentionFlag,
  InventoryAttentionItem,
  InventoryRecord,
} from "@/types/inventory-health";

const HIGH_VALUE_PERCENTILE = 0.75;
const LARGE_QUANTITY_PERCENTILE = 0.75;

function getNumericPercentile(
  values: number[],
  percentile: number,
): number | null {
  if (values.length === 0) {
    return null;
  }

  const sortedValues = [...values].sort(
    (a, b) => a - b,
  );

  const index =
    (sortedValues.length - 1) * percentile;

  const lowerIndex = Math.floor(index);
  const upperIndex = Math.ceil(index);

  if (lowerIndex === upperIndex) {
    return sortedValues[lowerIndex];
  }

  const lowerValue = sortedValues[lowerIndex];
  const upperValue = sortedValues[upperIndex];

  return (
    lowerValue +
    (upperValue - lowerValue) * (index - lowerIndex)
  );
}

function hasValidStockValue(
  record: InventoryRecord,
): boolean {
  return (
    record.stockValue !== null &&
    Number.isFinite(record.stockValue) &&
    record.stockValue >= 0
  );
}

function getHighValueThreshold(
  records: InventoryRecord[],
): number | null {
  const values = records
    .filter(
      (record) =>
        record.status !== "data-quality-issue" &&
        hasValidStockValue(record) &&
        record.stockValue !== null &&
        record.stockValue > 0,
    )
    .map((record) => record.stockValue as number);

  return getNumericPercentile(
    values,
    HIGH_VALUE_PERCENTILE,
  );
}

function getLargeQuantityThreshold(
  records: InventoryRecord[],
): number | null {
  const quantities = records
    .filter(
      (record) =>
        record.status !== "data-quality-issue" &&
        record.quantity > 0,
    )
    .map((record) => record.quantity);

  return getNumericPercentile(
    quantities,
    LARGE_QUANTITY_PERCENTILE,
  );
}

function addFlag(
  record: InventoryRecord,
  flag: AttentionFlag,
): void {
  if (!record.attentionFlags.includes(flag)) {
    record.attentionFlags.push(flag);
  }
}

function applyAttentionFlags(
  records: InventoryRecord[],
): void {
  const highValueThreshold =
    getHighValueThreshold(records);

  const largeQuantityThreshold =
    getLargeQuantityThreshold(records);

  for (const record of records) {
    if (record.status === "data-quality-issue") {
      continue;
    }

    if (
      record.status === "slow-moving" &&
      highValueThreshold !== null &&
      record.stockValue !== null &&
      record.stockValue >= highValueThreshold &&
      record.stockValue > 0
    ) {
      addFlag(
        record,
        "high-value-slow-moving",
      );
    }

    if (
      record.status === "potential-dead" &&
      highValueThreshold !== null &&
      record.stockValue !== null &&
      record.stockValue >= highValueThreshold &&
      record.stockValue > 0
    ) {
      addFlag(
        record,
        "high-value-potential-dead",
      );
    }

    if (
      (record.status === "slow-moving" ||
        record.status === "potential-dead") &&
      largeQuantityThreshold !== null &&
      record.quantity >= largeQuantityThreshold &&
      record.quantity > 0
    ) {
      addFlag(
        record,
        "large-quantity-limited-movement",
      );
    }

    if (
      record.status !== "no-stock" &&
      record.unitCost === null
    ) {
      addFlag(
        record,
        "missing-unit-cost",
      );
    }

    if (
      record.status === "insufficient-data" &&
      record.quantity > 0 &&
      !record.lastMovementDate
    ) {
      addFlag(
        record,
        "missing-movement-date",
      );
    }
  }
}

function buildAttentionItems(
  records: InventoryRecord[],
): InventoryAttentionItem[] {
  const flagDefinitions: Record<
    AttentionFlag,
    {
      title: string;
      description: string;
    }
  > = {
    "high-value-slow-moving": {
      title: "High-value slow-moving inventory",
      description:
        "These items have relatively high inventory value and have not moved recently according to the tool's movement guidelines. They may warrant further review.",
    },

    "high-value-potential-dead": {
      title: "High-value potential dead stock",
      description:
        "These items have relatively high inventory value and have not had recent outbound movement. Their current status may warrant further review.",
    },

    "large-quantity-limited-movement": {
      title: "Large quantity with limited movement",
      description:
        "These items have relatively large quantities while showing slow or no recent outbound movement. They may warrant further review.",
    },

    "missing-unit-cost": {
      title: "Missing unit cost",
      description:
        "These records can still be analyzed for movement, but inventory value cannot be calculated without reliable unit cost information.",
    },

    "missing-movement-date": {
      title: "Missing movement information",
      description:
        "These records contain inventory quantity but do not have a reliable last outbound movement date, so movement status cannot be determined.",
    },
  };

  const flags: AttentionFlag[] = [
    "high-value-slow-moving",
    "high-value-potential-dead",
    "large-quantity-limited-movement",
    "missing-unit-cost",
    "missing-movement-date",
  ];

  return flags
    .map((flag) => {
      const recordCount = records.filter(
        (record) => record.attentionFlags.includes(flag),
      ).length;

      if (recordCount === 0) {
        return null;
      }

      return {
        flag,
        title: flagDefinitions[flag].title,
        description:
          flagDefinitions[flag].description,
        recordCount,
      };
    })
    .filter(
      (
        item,
      ): item is InventoryAttentionItem =>
        item !== null,
    );
}

export function analyzeInventoryAttention(
  records: InventoryRecord[],
): InventoryAttentionItem[] {
  for (const record of records) {
    record.attentionFlags = [];
  }

  applyAttentionFlags(records);

  return buildAttentionItems(records);
}