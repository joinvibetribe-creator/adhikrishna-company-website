export type InventoryStatus =
  | "active"
  | "slow-moving"
  | "potential-dead"
  | "no-stock"
  | "insufficient-data"
  | "data-quality-issue";

export type DataQualityStatus =
  | "valid"
  | "insufficient-data"
  | "data-quality-issue";

export type AttentionFlag =
  | "high-value-slow-moving"
  | "high-value-potential-dead"
  | "large-quantity-limited-movement"
  | "missing-unit-cost"
  | "missing-movement-date";

export type InventoryRecord = {
  rowNumber: number;
  productCode: string | null;
  productDescription: string;
  quantity: number;
  unitCost: number | null;
  lastMovementDate: string | null;
  analysisDate: string;
  daysSinceMovement: number | null;
  stockValue: number | null;
  status: InventoryStatus;
  dataQualityStatus: DataQualityStatus;
  attentionFlags: AttentionFlag[];
};

export type InventoryColumnKey =
  | "productCode"
  | "productDescription"
  | "quantity"
  | "unitCost"
  | "lastMovementDate";

export type InventoryColumnMapping = {
  productCode: string | null;
  productDescription: string | null;
  quantity: string | null;
  unitCost: string | null;
  lastMovementDate: string | null;
};

export type ColumnDetectionResult = {
  mapping: InventoryColumnMapping;
  detected: InventoryColumnKey[];
  missingRequired: InventoryColumnKey[];
  requiresConfirmation: InventoryColumnKey[];
};

export type InventoryValidationIssueType =
  | "missing-product-description"
  | "invalid-quantity"
  | "negative-quantity"
  | "invalid-unit-cost"
  | "negative-unit-cost"
  | "missing-movement-date"
  | "invalid-movement-date"
  | "future-movement-date";

export type InventoryValidationIssue = {
  rowNumber: number;
  type: InventoryValidationIssueType;
  message: string;
};

export type InventoryValidationResult = {
  totalRows: number;
  validRows: number;
  insufficientDataRows: number;
  dataQualityIssueRows: number;
  issues: InventoryValidationIssue[];
};

export type InventoryStatusSummary = {
  count: number;
  quantity: number;
  stockValue: number | null;
};

export type InventorySummary = {
  totalRecords: number;
  totalQuantity: number;
  totalStockValue: number | null;
  active: InventoryStatusSummary;
  slowMoving: InventoryStatusSummary;
  potentialDead: InventoryStatusSummary;
  noStock: InventoryStatusSummary;
  insufficientData: InventoryStatusSummary;
  dataQualityIssue: InventoryStatusSummary;
  recordsNeedingReview: number;
};

export type InventoryAttentionItem = {
  flag: AttentionFlag;
  title: string;
  description: string;
  recordCount: number;
};

export type InventoryAnalysisResult = {
  analysisDate: string;
  currency: string;
  records: InventoryRecord[];
  summary: InventorySummary;
  attentionItems: InventoryAttentionItem[];
  validation: InventoryValidationResult;
};