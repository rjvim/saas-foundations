"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  NodeChange,
  applyNodeChanges,
  NodeTypes,
  Position,
  XYPosition,
  useReactFlow,
  ReactFlowProvider,
  Panel,
} from "@xyflow/react";
import {
  format,
  addMonths,
  differenceInCalendarDays,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isBefore,
  isAfter,
} from "date-fns";

import "@xyflow/react/dist/style.css";

// Types
export type GanttStatus = {
  id: string;
  name: string;
  color: string;
};

export type GanttFeature = {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  status: GanttStatus;
  group?: { id: string; name: string };
  owner?: {
    id: string;
    image: string;
    name: string;
  };
};

export type GanttMarker = {
  id: string;
  date: Date;
  label: string;
  className?: string;
};

export type Range = "daily" | "monthly" | "quarterly";

export type GanttProps = {
  features: GanttFeature[];
  markers?: GanttMarker[];
  range?: Range;
  zoom?: number;
  onMoveFeature?: (id: string, startAt: Date, endAt: Date) => void;
  onRemoveFeature?: (id: string) => void;
  onAddFeature?: (date: Date, group?: string) => void;
  onCreateMarker?: (date: Date) => void;
  onRemoveMarker?: (id: string) => void;
  onViewFeature?: (id: string) => void;
};

// Calculate grid sizes based on range
const getGridSize = (range: Range, zoom: number = 100): number => {
  switch (range) {
    case "daily":
      return 50 * (zoom / 100);
    case "monthly":
      return 150 * (zoom / 100);
    case "quarterly":
      return 100 * (zoom / 100);
    default:
      return 100 * (zoom / 100);
  }
};

// Helper to get days in month
const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

// Custom node types
type TaskNodeData = {
  feature: GanttFeature;
  gridSize: number;
  range: Range;
  onMove: (id: string, startAt: Date, endAt: Date) => void;
  onView: (id: string) => void;
  onRemove: (id: string) => void;
  timeframeStart: Date;
  isSelected: boolean;
};

// Task node component
const TaskNode: React.FC<{ data?: TaskNodeData }> = ({ data }) => {
  if (!data || !data.feature) {
    return <div className="error-node">Missing task data</div>;
  }

  const {
    feature,
    gridSize,
    range,
    onMove,
    onView,
    onRemove,
    timeframeStart,
    isSelected,
  } = data;

  // Calculate width based on duration
  const getWidth = () => {
    const days = differenceInCalendarDays(feature.endAt, feature.startAt) + 1;
    switch (range) {
      case "daily":
        return days * gridSize;
      case "monthly": {
        let width = 0;
        let currentDate = new Date(feature.startAt);
        while (
          isBefore(currentDate, feature.endAt) ||
          isSameDay(currentDate, feature.endAt)
        ) {
          width += gridSize / getDaysInMonth(currentDate);
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return width;
      }
      case "quarterly": {
        const months =
          (feature.endAt.getFullYear() - feature.startAt.getFullYear()) * 12 +
          feature.endAt.getMonth() -
          feature.startAt.getMonth() +
          (feature.endAt.getDate() >= feature.startAt.getDate() ? 1 : 0);
        return (months * gridSize) / 3;
      }
      default:
        return 100;
    }
  };

  // Drag handle for the left edge to change start date
  const leftDragHandle = useRef<HTMLDivElement>(null);
  // Drag handle for the right edge to change end date
  const rightDragHandle = useRef<HTMLDivElement>(null);

  // States to track dragging
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const [startDatePreview, setStartDatePreview] = useState<Date | null>(null);
  const [endDatePreview, setEndDatePreview] = useState<Date | null>(null);

  // Handle drag start for edge resizing
  const handleMouseDown = (edge: "left" | "right") => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (edge === "left") {
      setIsDraggingLeft(true);
      setStartDatePreview(feature.startAt);
    } else {
      setIsDraggingRight(true);
      setEndDatePreview(feature.endAt);
    }

    // Add event listeners for mouse move and up
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Convert mouse position to date
  const getDateFromPosition = (clientX: number) => {
    const flowElement = document.querySelector(".react-flow");
    if (!flowElement) return new Date();

    try {
      const rect = flowElement.getBoundingClientRect();
      const offsetX = clientX - rect.left;

      switch (range) {
        case "daily": {
          const dayOffset = Math.floor(offsetX / (gridSize || 50));
          const result = new Date(timeframeStart || new Date());
          result.setDate(result.getDate() + dayOffset);
          return result;
        }
        case "monthly": {
          let currentDate = new Date(timeframeStart || new Date());
          let position = 0;
          const monthWidth = gridSize || 150;

          while (position < offsetX) {
            if (position + monthWidth > offsetX) {
              // We found the month
              const daysInMonth = getDaysInMonth(currentDate);
              const dayWidth = monthWidth / daysInMonth;
              const dayOffset = Math.floor((offsetX - position) / dayWidth);

              const result = new Date(currentDate);
              result.setDate(1 + dayOffset);
              return result;
            }

            position += monthWidth;
            currentDate.setMonth(currentDate.getMonth() + 1);
          }

          return currentDate;
        }
        case "quarterly": {
          const monthWidth = (gridSize || 100) / 3;
          const monthOffset = Math.floor(offsetX / monthWidth);

          const result = new Date(timeframeStart || new Date());
          result.setMonth(result.getMonth() + monthOffset);
          return result;
        }
        default:
          return new Date();
      }
    } catch (error) {
      console.error("Error calculating date from position:", error);
      return new Date();
    }
  };

  // Handle mouse move for resizing
  const handleMouseMove = (e: MouseEvent) => {
    if (isDraggingLeft) {
      const newDate = getDateFromPosition(e.clientX);
      if (isBefore(newDate, feature.endAt)) {
        setStartDatePreview(newDate);
      }
    } else if (isDraggingRight) {
      const newDate = getDateFromPosition(e.clientX);
      if (isAfter(newDate, feature.startAt)) {
        setEndDatePreview(newDate);
      }
    }
  };

  // Handle mouse up to commit changes
  const handleMouseUp = () => {
    if (isDraggingLeft && startDatePreview) {
      onMove(feature.id, startDatePreview, feature.endAt);
    } else if (isDraggingRight && endDatePreview) {
      onMove(feature.id, feature.startAt, endDatePreview);
    }

    setIsDraggingLeft(false);
    setIsDraggingRight(false);
    setStartDatePreview(null);
    setEndDatePreview(null);

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const width = getWidth();

  return (
    <div
      className="gantt-task-node"
      style={{
        position: "relative",
        width: `${width}px`,
        height: "36px",
        background: isSelected ? "#f1f5f9" : "#ffffff",
        borderRadius: "4px",
        border: `1px solid ${feature.status.color}`,
        display: "flex",
        alignItems: "center",
        padding: "0 8px",
        boxShadow: isSelected ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
        transition: "background-color 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        overflow: "hidden",
      }}
      onClick={() => onView(feature.id)}
    >
      {/* Left resize handle */}
      <div
        ref={leftDragHandle}
        style={{
          position: "absolute",
          left: "-4px",
          top: 0,
          bottom: 0,
          width: "8px",
          cursor: "col-resize",
          zIndex: 10,
        }}
        onMouseDown={handleMouseDown("left")}
      />

      {/* Content */}
      <div
        className="status-indicator"
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: feature.status.color,
          marginRight: "8px",
        }}
      />

      <div
        className="task-name"
        style={{
          flexGrow: 1,
          fontSize: "12px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {feature.name}
      </div>

      {feature.owner && (
        <div
          className="task-avatar"
          style={{
            marginLeft: "8px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <img
            src={feature.owner.image}
            alt={feature.owner.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Right resize handle */}
      <div
        ref={rightDragHandle}
        style={{
          position: "absolute",
          right: "-4px",
          top: 0,
          bottom: 0,
          width: "8px",
          cursor: "col-resize",
          zIndex: 10,
        }}
        onMouseDown={handleMouseDown("right")}
      />

      {/* Date preview tooltips */}
      {startDatePreview && isDraggingLeft && (
        <div
          style={{
            position: "absolute",
            top: "-30px",
            left: "0",
            background: "#fff",
            padding: "4px 8px",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            fontSize: "10px",
            whiteSpace: "nowrap",
          }}
        >
          {format(startDatePreview, "MMM dd, yyyy")}
        </div>
      )}

      {endDatePreview && isDraggingRight && (
        <div
          style={{
            position: "absolute",
            top: "-30px",
            right: "0",
            background: "#fff",
            padding: "4px 8px",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            fontSize: "10px",
            whiteSpace: "nowrap",
          }}
        >
          {format(endDatePreview, "MMM dd, yyyy")}
        </div>
      )}
    </div>
  );
};

// Marker node component
const MarkerNode: React.FC<{
  data: { marker: GanttMarker; onRemove: (id: string) => void };
}> = ({ data }) => {
  const { marker, onRemove } = data;

  return (
    <div
      className="gantt-marker-node"
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        className={`marker-label ${marker?.className || ""}`}
        style={{
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          whiteSpace: "nowrap",
          marginBottom: "4px",
          background: "#f1f5f9", // Default background if className doesn't provide one
          cursor: "pointer",
        }}
        onClick={() => {
          // Implement context menu here
          if (window.confirm(`Remove marker "${marker.label}"?`)) {
            onRemove(marker.id);
          }
        }}
      >
        {marker.label}
        <div style={{ fontSize: "10px", color: "#64748b" }}>
          {format(marker.date, "MMM dd, yyyy")}
        </div>
      </div>
      <div
        style={{
          width: "1px",
          height: "100vh",
          background: marker.className ? undefined : "#cbd5e1",
        }}
      />
    </div>
  );
};

// Group header node
const GroupHeaderNode: React.FC<{ data?: { name?: string } }> = ({ data }) => {
  return (
    <div
      className="gantt-group-header"
      style={{
        padding: "8px",
        fontSize: "14px",
        fontWeight: "bold",
        color: "#64748b",
      }}
    >
      {data?.name || "Unnamed Group"}
    </div>
  );
};

// Today marker node
const TodayMarkerNode: React.FC<{ data?: any }> = () => {
  return (
    <div
      className="gantt-today-marker"
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          whiteSpace: "nowrap",
          marginBottom: "4px",
          background: "#f43f5e",
          color: "white",
        }}
      >
        Today
      </div>
      <div style={{ width: "2px", height: "100vh", background: "#f43f5e" }} />
    </div>
  );
};

// Header column for timeline
const TimelineHeader: React.FC<{
  range: Range;
  timeframeStart: Date;
  timeframeEnd: Date;
  gridSize: number;
}> = ({ range, timeframeStart, timeframeEnd, gridSize }) => {
  const headers = [];

  switch (range) {
    case "daily": {
      let current = new Date(timeframeStart);
      while (current <= timeframeEnd) {
        headers.push({
          label: format(current, "d"),
          subLabel: format(current, "EEE"),
          date: new Date(current),
        });
        current.setDate(current.getDate() + 1);
      }
      break;
    }
    case "monthly": {
      let current = new Date(timeframeStart);
      current.setDate(1); // Start from the 1st of the month
      while (current <= timeframeEnd) {
        headers.push({
          label: format(current, "MMM"),
          subLabel: format(current, "yyyy"),
          date: new Date(current),
        });
        current.setMonth(current.getMonth() + 1);
      }
      break;
    }
    case "quarterly": {
      let current = new Date(timeframeStart);
      current.setDate(1); // Start from the 1st of the month
      while (current <= timeframeEnd) {
        const quarter = Math.floor(current.getMonth() / 3) + 1;
        headers.push({
          label: `Q${quarter}`,
          subLabel: format(current, "yyyy"),
          date: new Date(current),
        });
        current.setMonth(current.getMonth() + 3);
      }
      break;
    }
  }

  return (
    <div
      className="gantt-timeline-header"
      style={{
        display: "flex",
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(4px)",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      }}
    >
      {headers.map((header, index) => (
        <div
          key={index}
          style={{
            width: `${gridSize}px`,
            padding: "8px 4px",
            textAlign: "center",
            borderRight: "1px solid #e2e8f0",
            fontSize: "12px",
          }}
        >
          <div style={{ fontWeight: "bold" }}>{header.label}</div>
          <div style={{ color: "#64748b", fontSize: "10px" }}>
            {header.subLabel}
          </div>
        </div>
      ))}
    </div>
  );
};

// Sidebar component
const GanttSidebar: React.FC<{
  features: GanttFeature[];
  groups: { id: string; name: string }[];
  onViewFeature: (id: string) => void;
  selectedFeatureId?: string;
}> = ({ features, groups, onViewFeature, selectedFeatureId }) => {
  // Group features by group
  const groupedFeatures: Record<string, GanttFeature[]> = {};

  // Initialize empty arrays for each group
  groups.forEach((group) => {
    groupedFeatures[group.id] = [];
  });

  // Add features to their respective groups
  features.forEach((feature) => {
    if (feature.group) {
      if (!groupedFeatures[feature.group.id]) {
        groupedFeatures[feature.group.id] = [];
      }
      groupedFeatures[feature.group.id].push(feature);
    }
  });

  return (
    <div
      className="gantt-sidebar"
      style={{
        width: "300px",
        borderRight: "1px solid #e2e8f0",
        overflow: "auto",
        height: "100%",
        background: "white",
      }}
    >
      <div
        className="sidebar-header"
        style={{
          padding: "8px",
          borderBottom: "1px solid #e2e8f0",
          fontWeight: "bold",
          height: "60px", // Match header height
          display: "flex",
          alignItems: "flex-end",
          fontSize: "12px",
          color: "#64748b",
        }}
      >
        <div style={{ flexGrow: 1 }}>Issues</div>
        <div>Duration</div>
      </div>

      {groups.map((group) => (
        <div key={group.id} className="sidebar-group">
          <div
            className="group-header"
            style={{
              padding: "8px",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#64748b",
              height: "36px", // Match node height
            }}
          >
            {group.name}
          </div>

          <div className="group-items">
            {(groupedFeatures[group.id] || []).map((feature) => (
              <div
                key={feature.id}
                className={`sidebar-item ${selectedFeatureId === feature.id ? "selected" : ""}`}
                style={{
                  padding: "8px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #f1f5f9",
                  cursor: "pointer",
                  background:
                    selectedFeatureId === feature.id ? "#f1f5f9" : "white",
                }}
                onClick={() => onViewFeature(feature.id)}
              >
                <div
                  className="status-indicator"
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: feature.status.color,
                    marginRight: "8px",
                  }}
                />
                <div
                  style={{
                    flexGrow: 1,
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {feature.name}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  {differenceInCalendarDays(feature.endAt, feature.startAt) + 1}{" "}
                  days
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Main GanttChart component
const GanttChart: React.FC<GanttProps> = ({
  features,
  markers = [],
  range = "monthly",
  zoom = 100,
  onMoveFeature,
  onRemoveFeature,
  onAddFeature,
  onCreateMarker,
  onRemoveMarker,
  onViewFeature,
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedFeatureId, setSelectedFeatureId] = useState<
    string | undefined
  >();
  const reactFlowInstance = useReactFlow();
  const { getNodes } = reactFlowInstance;
  const containerRef = useRef<HTMLDivElement>(null);

  // Get unique groups from features
  const groups = Array.from(
    new Map(
      features.filter((f) => f.group).map((f) => [f.group?.id, f.group])
    ).values()
  ) as { id: string; name: string }[];

  // Calculate the start and end dates of the timeframe to display
  const calculateTimeframe = useCallback(() => {
    try {
      if (!features || features.length === 0) {
        const today = new Date();
        return {
          start: startOfMonth(addMonths(today, -6)),
          end: endOfMonth(addMonths(today, 6)),
        };
      }

      let minDate = features[0]?.startAt || new Date();
      let maxDate = features[0]?.endAt || new Date();

      features.forEach((feature) => {
        if (feature?.startAt && feature.startAt < minDate)
          minDate = feature.startAt;
        if (feature?.endAt && feature.endAt > maxDate) maxDate = feature.endAt;
      });

      // Add padding to timeframe
      const paddedStart = new Date(minDate);
      paddedStart.setMonth(paddedStart.getMonth() - 3);

      const paddedEnd = new Date(maxDate);
      paddedEnd.setMonth(paddedEnd.getMonth() + 3);

      return {
        start: paddedStart,
        end: paddedEnd,
      };
    } catch (error) {
      console.error("Error calculating timeframe:", error);
      const today = new Date();
      return {
        start: startOfMonth(addMonths(today, -6)),
        end: endOfMonth(addMonths(today, 6)),
      };
    }
  }, [features]);

  const { start: timeframeStart, end: timeframeEnd } = calculateTimeframe();
  const gridSize = getGridSize(range, zoom);

  // Create nodes from features
  const createNodes = useCallback(() => {
    const newNodes: Node[] = [];
    const today = new Date();
    let yOffset = 0;

    // Add today marker
    newNodes.push({
      id: "today-marker",
      type: "today-marker",
      position: getDatePosition(today, timeframeStart, range, gridSize),
      data: {},
    });

    // Add markers
    if (markers && Array.isArray(markers)) {
      markers.forEach((marker) => {
        if (marker && marker.id && marker.date) {
          newNodes.push({
            id: `marker-${marker.id}`,
            type: "marker",
            position: getDatePosition(
              marker.date,
              timeframeStart,
              range,
              gridSize
            ),
            data: { marker, onRemove: onRemoveMarker },
          });
        }
      });
    }

    // Process groups and features
    if (groups && Array.isArray(groups)) {
      groups.forEach((group) => {
        if (group && group.id) {
          // Add group header
          newNodes.push({
            id: `group-${group.id}`,
            type: "group-header",
            position: { x: 0, y: yOffset },
            data: { name: group.name },
          });

          yOffset += 50; // Space after group header

          // Add features in this group
          const groupFeatures = features.filter(
            (f) => f.group && f.group.id === group.id
          );
          if (groupFeatures && Array.isArray(groupFeatures)) {
            groupFeatures.forEach((feature) => {
              if (feature && feature.id && feature.startAt && feature.endAt) {
                const position = getFeaturePosition(
                  feature,
                  timeframeStart,
                  range,
                  gridSize,
                  yOffset
                );

                newNodes.push({
                  id: feature.id,
                  type: "task",
                  position,
                  data: {
                    feature,
                    gridSize,
                    range,
                    onMove: onMoveFeature || (() => {}),
                    onView: handleViewFeature,
                    onRemove: onRemoveFeature || (() => {}),
                    timeframeStart,
                    isSelected: feature.id === selectedFeatureId,
                  },
                });

                yOffset += 40; // Space for next feature
              }
            });
          }

          yOffset += 20; // Space after group
        }
      });
    }

    return newNodes;
  }, [
    features,
    markers,
    groups,
    range,
    gridSize,
    timeframeStart,
    onMoveFeature,
    onRemoveMarker,
    selectedFeatureId,
  ]);

  // Position helpers
  function getDatePosition(
    date: Date,
    startDate: Date,
    range: Range,
    gridSize: number
  ): XYPosition {
    if (!date || !startDate) {
      return { x: 0, y: 0 };
    }

    try {
      let x = 0;

      switch (range) {
        case "daily": {
          const days = differenceInCalendarDays(date, startDate);
          x = days * (gridSize || 50);
          break;
        }
        case "monthly": {
          const months =
            (date.getFullYear() - startDate.getFullYear()) * 12 +
            date.getMonth() -
            startDate.getMonth();
          const daysInMonth = getDaysInMonth(
            new Date(date.getFullYear(), date.getMonth(), 1)
          );
          const dayPosition = date.getDate() / daysInMonth;
          x = months * (gridSize || 150) + dayPosition * (gridSize || 150);
          break;
        }
        case "quarterly": {
          const months =
            (date.getFullYear() - startDate.getFullYear()) * 12 +
            date.getMonth() -
            startDate.getMonth();
          x = months * ((gridSize || 100) / 3); // 3 months per quarter
          break;
        }
      }

      return { x, y: 0 };
    } catch (error) {
      console.error("Error calculating position for date:", error);
      return { x: 0, y: 0 };
    }
  }

  function getFeaturePosition(
    feature: GanttFeature,
    startDate: Date,
    range: Range,
    gridSize: number,
    yPosition: number
  ): XYPosition {
    if (!feature?.startAt || !startDate) {
      return { x: 0, y: yPosition };
    }

    try {
      const x = getDatePosition(feature.startAt, startDate, range, gridSize).x;
      return { x, y: yPosition };
    } catch (error) {
      console.error("Error calculating feature position:", error);
      return { x: 0, y: yPosition };
    }
  }

  // Update nodes when features, markers, or display settings change
  useEffect(() => {
    const newNodes = createNodes();
    if (JSON.stringify(newNodes) !== JSON.stringify(nodes)) {
      setNodes(newNodes);
    }
  }, [
    JSON.stringify(features),
    JSON.stringify(markers),
    range,
    gridSize,
    selectedFeatureId,
  ]);

  // Handle node changes (like dragging)
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  // Handle view feature
  const handleViewFeature = useCallback(
    (id: string) => {
      setSelectedFeatureId(id);
      if (onViewFeature) {
        onViewFeature(id);
      }
    },
    [onViewFeature]
  );

  // Handle click on background to add new feature
  const handlePaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (onAddFeature && event.target === event.currentTarget) {
        // Convert click position to date
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const offsetX = event.clientX - rect.left;

        // Calculate date from X position
        let date = new Date(timeframeStart);

        switch (range) {
          case "daily": {
            const dayOffset = Math.floor(offsetX / gridSize);
            date.setDate(date.getDate() + dayOffset);
            break;
          }
          case "monthly": {
            const monthOffset = Math.floor(offsetX / gridSize);
            date.setMonth(date.getMonth() + monthOffset);
            const remainingX = offsetX % gridSize;
            const daysInMonth = getDaysInMonth(date);
            const dayOffset = Math.floor((remainingX / gridSize) * daysInMonth);
            date.setDate(1 + dayOffset);
            break;
          }
          case "quarterly": {
            const monthWidth = gridSize / 3;
            const monthOffset = Math.floor(offsetX / monthWidth);
            date.setMonth(date.getMonth() + monthOffset);
            break;
          }
        }

        onAddFeature(date);
      }
    },
    [onAddFeature, timeframeStart, range, gridSize]
  );

  // Define node types
  const nodeTypes: NodeTypes = {
    task: TaskNode,
    marker: MarkerNode,
    "today-marker": TodayMarkerNode,
    "group-header": GroupHeaderNode,
  };

  return (
    <div
      className="gantt-chart-container"
      style={{ display: "flex", height: "100%", width: "100%" }}
    >
      <GanttSidebar
        features={features}
        groups={groups}
        onViewFeature={handleViewFeature}
        selectedFeatureId={selectedFeatureId}
      />

      <div
        ref={containerRef}
        style={{
          flexGrow: 1,
          height: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <TimelineHeader
          range={range}
          timeframeStart={timeframeStart}
          timeframeEnd={timeframeEnd}
          gridSize={gridSize}
        />

        <ReactFlow
          nodes={nodes}
          edges={[]}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          onPaneClick={handlePaneClick}
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          snapToGrid={true}
          snapGrid={[gridSize, 20]}
          panOnScroll={true}
          selectionOnDrag={false}
          nodesConnectable={false}
          elementsSelectable={true}
          nodesDraggable={false} // We handle dragging ourselves
          zoomOnDoubleClick={false}
          fitView
          style={{ background: "#f8fafc" }}
        >
          <Background gap={gridSize} size={1} color="#e2e8f0" />
          <Controls showInteractive={false} />
        </ReactFlow>

        {/* Create marker button */}
        {onCreateMarker && (
          <div
            className="create-marker-container"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "none",
              zIndex: 5,
            }}
          >
            <div
              className="marker-creator"
              style={{
                position: "absolute",
                top: "70px",
                left: "0px",
                opacity: 0,
                transition: "opacity 0.2s",
                pointerEvents: "all",
              }}
              onMouseEnter={(e) => {
                // Show the marker creator
                e.currentTarget.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                // Hide the marker creator
                e.currentTarget.style.opacity = "0";
              }}
              onClick={() => {
                const date = timeframeStart; // Calculate the date from X position
                onCreateMarker(date);
              }}
            >
              <button
                style={{
                  border: "none",
                  background: "#e2e8f0",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Gantt component with range and zoom controls
export const Gantt: React.FC<GanttProps> = (props) => {
  const [range, setRange] = useState<Range>(props.range || "monthly");
  const [zoom, setZoom] = useState<number>(props.zoom || 100);

  return (
    <div
      className="gantt-wrapper"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <ReactFlowProvider>
        <GanttChart {...props} range={range} zoom={zoom} />

        {/* Range and zoom controls */}
        <Panel position="top-right" style={{ display: "flex", gap: "8px" }}>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as Range)}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #e2e8f0",
              background: "white",
              fontSize: "14px",
            }}
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "white",
              borderRadius: "4px",
              border: "1px solid #e2e8f0",
              padding: "0 8px",
            }}
          >
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 10))}
              style={{ border: "none", background: "none", cursor: "pointer" }}
            >
              -
            </button>
            <input
              type="range"
              min="50"
              max="200"
              value={zoom}
              onChange={(e) => setZoom(parseInt(e.target.value))}
              style={{ width: "100px" }}
            />
            <button
              onClick={() => setZoom((z) => Math.min(200, z + 10))}
              style={{ border: "none", background: "none", cursor: "pointer" }}
            >
              +
            </button>
          </div>
        </Panel>
      </ReactFlowProvider>
    </div>
  );
};

// Example usage
export const GanttExample: React.FC = () => {
  const today = new Date();

  const statuses: GanttStatus[] = [
    { id: "1", name: "Planned", color: "#6B7280" },
    { id: "2", name: "In Progress", color: "#F59E0B" },
    { id: "3", name: "Done", color: "#10B981" },
  ];

  const exampleFeatures: GanttFeature[] = [
    {
      id: "1",
      name: "Feature 1",
      startAt: new Date(today.getFullYear(), today.getMonth() - 1, 5),
      endAt: new Date(today.getFullYear(), today.getMonth(), 10),
      status: statuses[0],
      group: { id: "group1", name: "Group 1" },
    },
    {
      id: "2",
      name: "Feature 2",
      startAt: new Date(today.getFullYear(), today.getMonth(), 1),
      endAt: new Date(today.getFullYear(), today.getMonth(), 20),
      status: statuses[1],
      group: { id: "group1", name: "Group 1" },
      owner: {
        id: "1",
        name: "John Doe",
        image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=1",
      },
    },
    {
      id: "3",
      name: "Feature 3",
      startAt: new Date(today.getFullYear(), today.getMonth() + 1, 1),
      endAt: new Date(today.getFullYear(), today.getMonth() + 1, 15),
      status: statuses[2],
      group: { id: "group2", name: "Group 2" },
    },
  ];

  const exampleMarkers: GanttMarker[] = [
    {
      id: "1",
      date: new Date(today.getFullYear(), today.getMonth(), 15),
      label: "Release 1.0",
      className: "bg-blue-100 text-blue-900",
    },
  ];

  const [features, setFeatures] = useState(exampleFeatures);
  const [markers, setMarkers] = useState(exampleMarkers);

  const handleMoveFeature = useCallback(
    (id: string, startAt: Date, endAt: Date) => {
      setFeatures((prev) =>
        prev.map((feature) =>
          feature.id === id ? { ...feature, startAt, endAt } : feature
        )
      );
    },
    []
  );

  const handleViewFeature = useCallback((id: string) => {
    console.log("View feature:", id);
  }, []);

  const handleRemoveFeature = useCallback((id: string) => {
    setFeatures((prev) => prev.filter((feature) => feature.id !== id));
  }, []);

  const handleAddFeature = useCallback(
    (date: Date) => {
      const id = Math.random().toString(36).substring(2, 9);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 10);

      setFeatures((prev) => [
        ...prev,
        {
          id,
          name: `New Feature ${id}`,
          startAt: date,
          endAt: endDate,
          status: statuses[0],
          group: { id: "group1", name: "Group 1" },
        },
      ]);
    },
    [statuses]
  );

  const handleCreateMarker = useCallback((date: Date) => {
    const id = Math.random().toString(36).substring(2, 9);

    setMarkers((prev) => [
      ...prev,
      {
        id,
        date,
        label: `Marker ${id}`,
        className: "bg-purple-100 text-purple-900",
      },
    ]);
  }, []);

  const handleRemoveMarker = useCallback((id: string) => {
    setMarkers((prev) => prev.filter((marker) => marker.id !== id));
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Gantt
        features={features}
        markers={markers}
        onMoveFeature={handleMoveFeature}
        onRemoveFeature={handleRemoveFeature}
        onAddFeature={handleAddFeature}
        onCreateMarker={handleCreateMarker}
        onRemoveMarker={handleRemoveMarker}
        onViewFeature={handleViewFeature}
      />
    </div>
  );
};
