import type { FreeTool } from "@/types/free-tool";

export const freeTools: FreeTool[] = [
  {
    name: "Profit Margin Calculator",
    slug: "profit-margin",
    category: "Business Calculator",
    status: "available",
    description:
      "A practical calculator for understanding revenue, cost, gross profit and profit margin.",
    shortDescription:
      "Calculate gross profit and profit margin from your business numbers.",
    katyaConnection: "general",
    href: "/free-tools/profit-margin",
  },

  {
    name: "Markup Calculator",
    slug: "markup",
    category: "Business Calculator",
    status: "available",
    description:
      "A practical calculator for calculating markup amount, selling price and the relationship between markup and margin.",
    shortDescription:
      "Calculate selling price and understand markup versus margin.",
    katyaConnection: "general",
    href: "/free-tools/markup",
  },

  {
    name: "Break-Even Calculator",
    slug: "break-even",
    category: "Business Calculator",
    status: "available",
    description:
      "A practical calculator for estimating the sales volume and revenue required to reach break-even.",
    shortDescription:
      "Estimate the sales volume and revenue needed to cover your costs.",
    katyaConnection: "general",
    href: "/free-tools/break-even",
  },

  {
    name: "Business Health Check",
    slug: "business-health",
    category: "Business Diagnostic",
    status: "available",
    description:
      "A structured business diagnostic tool that highlights financial and operational areas that may deserve attention.",
    shortDescription:
      "Review key business indicators and identify areas that may need attention.",
    katyaConnection: "katya",
    href: "/free-tools/business-health",
  },

  {
    name: "Inventory Health Checker",
    slug: "inventory-health",
    category: "Business Intelligence",
    status: "available",
    description:
      "Analyze inventory movement, stock value and inventory records that may require further review.",
    shortDescription:
      "Analyze inventory movement and identify active, slow-moving and potentially dead stock.",
    katyaConnection: "katya",
    href: "/free-tools/inventory-health",
  },

  {
    name: "Excel Business Intelligence Analyzer",
    slug: "excel-business-analyzer",
    category: "Business Intelligence",
    status: "planned",
    description:
      "Analyze business spreadsheet data to discover sales, customer, product, inventory and other business intelligence signals.",
    shortDescription:
      "Analyze business data and uncover meaningful sales, customer, product and inventory signals.",
    katyaConnection: "katya",
    href: "/free-tools/excel-business-analyzer",
  },
];