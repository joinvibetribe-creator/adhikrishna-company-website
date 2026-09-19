import * as XLSX from "xlsx";

export type RawInventoryData = {
  fileName: string;
  fileType: "xlsx" | "csv";
  sheetName: string | null;
  headers: string[];
  rows: unknown[][];
  rowCount: number;
};

function getFileType(fileName: string): "xlsx" | "csv" {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (extension === "xlsx") {
    return "xlsx";
  }

  if (extension === "csv") {
    return "csv";
  }

  throw new Error(
    "Unsupported file type. Please upload an Excel (.xlsx) or CSV (.csv) file.",
  );
}

function isNonEmptyRow(row: unknown[]): boolean {
  return row.some((cell) => {
    if (cell === null || cell === undefined) {
      return false;
    }

    return String(cell).trim() !== "";
  });
}

function findUsableSheet(workbook: XLSX.WorkBook): string | null {
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      continue;
    }

    const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
      header: 1,
      defval: null,
      raw: true,
    });

    if (rows.some((row) => Array.isArray(row) && isNonEmptyRow(row))) {
      return sheetName;
    }
  }

  return null;
}

function extractSheetData(
  workbook: XLSX.WorkBook,
  sheetName: string,
): {
  headers: string[];
  rows: unknown[][];
} {
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error("The selected worksheet could not be read.");
  }

  const rawRows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: null,
    raw: true,
  });

  const firstDataRowIndex = rawRows.findIndex(
    (row) => Array.isArray(row) && isNonEmptyRow(row),
  );

  if (firstDataRowIndex === -1) {
    throw new Error("The worksheet does not contain usable tabular data.");
  }

  const headerRow = rawRows[firstDataRowIndex];

  if (!Array.isArray(headerRow)) {
    throw new Error("The worksheet header row could not be read.");
  }

  const headers = headerRow.map((header) =>
    header === null || header === undefined ? "" : String(header).trim(),
  );

  if (headers.every((header) => header === "")) {
    throw new Error("The worksheet does not contain usable column headers.");
  }

  const rows = rawRows
    .slice(firstDataRowIndex + 1)
    .filter((row) => Array.isArray(row) && isNonEmptyRow(row))
    .map((row) => {
      const normalizedRow = [...row];

      while (normalizedRow.length < headers.length) {
        normalizedRow.push(null);
      }

      return normalizedRow.slice(0, headers.length);
    });

  return {
    headers,
    rows,
  };
}

export async function readInventoryFile(
  file: File,
): Promise<RawInventoryData> {
  if (!file) {
    throw new Error("No file was provided.");
  }

  const fileType = getFileType(file.name);

  try {
    const fileBuffer = await file.arrayBuffer();

    const workbook = XLSX.read(fileBuffer, {
      type: "array",
      cellFormula: false,
    });

    if (!workbook.SheetNames.length) {
      throw new Error("The uploaded file does not contain any worksheets.");
    }

    const sheetName = findUsableSheet(workbook);

    if (!sheetName) {
      throw new Error("No worksheet with usable tabular data was found.");
    }

    const { headers, rows } = extractSheetData(workbook, sheetName);

    return {
      fileName: file.name,
      fileType,
      sheetName,
      headers,
      rows,
      rowCount: rows.length,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Could not read "${file.name}": ${error.message}`);
    }

    throw new Error(`Could not read "${file.name}".`);
  }
}