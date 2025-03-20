"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";
import { cn } from "@foundations/shadcn/lib/utils";

interface JsonViewerProps {
  data: any;
  className?: string;
  initialExpanded?: boolean;
  title?: string;
}

export const JsonViewer = ({
  data,
  className,
  initialExpanded = false,
  title,
}: JsonViewerProps) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderValue = (value: any) => {
    if (value === null) return <span className="text-gray-500">null</span>;
    if (value === undefined)
      return <span className="text-gray-500">undefined</span>;

    switch (typeof value) {
      case "string":
        return <span className="text-green-600">"{value}"</span>;
      case "number":
        return <span className="text-blue-600">{value}</span>;
      case "boolean":
        return <span className="text-purple-600">{value.toString()}</span>;
      case "object":
        if (Array.isArray(value)) {
          return <JsonArray data={value} />;
        }
        return <JsonObject data={value} />;
      default:
        return <span>{String(value)}</span>;
    }
  };

  const JsonObject = ({ data }: { data: Record<string, any> }) => {
    const [expanded, setExpanded] = useState(initialExpanded);

    if (!data || Object.keys(data).length === 0) {
      return <span className="text-gray-500">{"{}"}</span>;
    }

    return (
      <div className="ml-4">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronDown className="h-3 w-3 text-gray-500" />
          ) : (
            <ChevronRight className="h-3 w-3 text-gray-500" />
          )}
          <span className="text-gray-500 ml-1">{"{}"}</span>
        </div>

        {expanded && (
          <div className="ml-4 border-l border-gray-200 pl-2">
            {Object.entries(data).map(([key, value], index) => (
              <div key={index} className="my-1">
                <span className="text-gray-800 font-medium">{key}:</span>{" "}
                {renderValue(value)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const JsonArray = ({ data }: { data: any[] }) => {
    const [expanded, setExpanded] = useState(initialExpanded);

    if (!data || data.length === 0) {
      return <span className="text-gray-500">[]</span>;
    }

    return (
      <div className="ml-4">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronDown className="h-3 w-3 text-gray-500" />
          ) : (
            <ChevronRight className="h-3 w-3 text-gray-500" />
          )}
          <span className="text-gray-500 ml-1">[{data.length}]</span>
        </div>

        {expanded && (
          <div className="ml-4 border-l border-gray-200 pl-2">
            {data.map((value, index) => (
              <div key={index} className="my-1">
                <span className="text-gray-500 font-medium">[{index}]:</span>{" "}
                {renderValue(value)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("rounded-md border bg-white p-4 shadow-sm", className)}>
      <div className="flex justify-between items-center mb-2">
        {title && (
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        )}
        <button
          onClick={copyToClipboard}
          className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="font-mono text-sm overflow-auto max-h-[500px]">
        {renderValue(data)}
      </div>
    </div>
  );
};
