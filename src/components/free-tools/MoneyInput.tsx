"use client";

import { useState } from "react";

type MoneyInputProps = {
id: string;
label: string;
value: string;
currency: string;
onChange: (value: string) => void;
placeholder?: string;
helpText?: string;
};

function formatMoneyValue(value: string, currency: string): string {
if (!value) {
return "";
}

const numericValue = Number(value);

if (!Number.isFinite(numericValue)) {
return value;
}

const locale = currency === "INR" ? "en-IN" : "en-US";

return new Intl.NumberFormat(locale, {
useGrouping: true,
minimumFractionDigits: 0,
maximumFractionDigits: 2,
}).format(numericValue);
}

function cleanInputValue(value: string): string {
const withoutCommas = value.replace(/,/g, "");
const cleaned = withoutCommas.replace(/[^\d.]/g, "");

const decimalParts = cleaned.split(".");

if (decimalParts.length <= 1) {
return cleaned;
}

return `${decimalParts[0]}.${decimalParts.slice(1).join("")}`;
}

export default function MoneyInput({
id,
label,
value,
currency,
onChange,
placeholder = "0",
helpText,
}: MoneyInputProps) {
const [isFocused, setIsFocused] = useState(false);

const displayValue = isFocused
? value
: formatMoneyValue(value, currency);

return ( <div className="space-y-2"> <label
     htmlFor={id}
     className="block text-sm font-semibold text-[#0B2347]"
   >
{label} </label>


  <div className="relative">
    <input
      id={id}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onChange={(event) => {
        onChange(cleanInputValue(event.target.value));
      }}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-[#1E5AA8] focus:ring-2 focus:ring-[#1E5AA8]/20"
    />
  </div>

  {helpText && (
    <p className="text-xs leading-5 text-slate-500">
      {helpText}
    </p>
  )}
</div>


);
}
