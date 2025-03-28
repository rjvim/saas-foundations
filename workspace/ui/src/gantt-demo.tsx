"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@foundations/shadcn/components/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@foundations/shadcn/components/context-menu";
import {
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttMarker,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
} from "@foundations/shadcn/components/gantt";
import { EyeIcon, LinkIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

import {
  addMonths,
  endOfMonth,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";

const today = new Date();

export const exampleStatuses = [
  { id: "1", name: "Planned", color: "#6B7280" },
  { id: "2", name: "In Progress", color: "#F59E0B" },
  { id: "3", name: "Done", color: "#10B981" },
];

export const exampleFeatures = [
  {
    id: "1",
    name: "AI Scene Analysis",
    startAt: startOfMonth(subMonths(today, 6)),
    endAt: subDays(endOfMonth(today), 5),
    status: exampleStatuses[0],
    group: { id: "1", name: "Core AI Features" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "1",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=1",
      name: "Alice Johnson",
    },
    initiative: { id: "1", name: "AI Integration" },
    release: { id: "1", name: "v1.0" },
  },
  {
    id: "2",
    name: "Collaborative Editing",
    startAt: startOfMonth(subMonths(today, 5)),
    endAt: subDays(endOfMonth(today), 5),
    status: exampleStatuses[1],
    group: { id: "2", name: "Collaboration Tools" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "2",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=2",
      name: "Bob Smith",
    },
    initiative: { id: "2", name: "Real-time Collaboration" },
    release: { id: "1", name: "v1.0" },
  },
  {
    id: "3",
    name: "AI-Powered Color Grading",
    startAt: startOfMonth(subMonths(today, 4)),
    endAt: subDays(endOfMonth(today), 5),
    status: exampleStatuses[2],
    group: { id: "1", name: "Core AI Features" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "3",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=3",
      name: "Charlie Brown",
    },
    initiative: { id: "1", name: "AI Integration" },
    release: { id: "2", name: "v1.1" },
  },
  {
    id: "4",
    name: "Real-time Video Chat",
    startAt: startOfMonth(subMonths(today, 3)),
    endAt: subDays(endOfMonth(today), 12),
    status: exampleStatuses[0],
    group: { id: "2", name: "Collaboration Tools" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "4",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=4",
      name: "Diana Prince",
    },
    initiative: { id: "2", name: "Real-time Collaboration" },
    release: { id: "2", name: "v1.1" },
  },
  {
    id: "5",
    name: "AI Voice-to-Text Subtitles",
    startAt: startOfMonth(subMonths(today, 2)),
    endAt: subDays(endOfMonth(today), 5),
    status: exampleStatuses[1],
    group: { id: "1", name: "Core AI Features" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "5",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=5",
      name: "Ethan Hunt",
    },
    initiative: { id: "1", name: "AI Integration" },
    release: { id: "2", name: "v1.1" },
  },
  {
    id: "6",
    name: "Cloud Asset Management",
    startAt: startOfMonth(subMonths(today, 1)),
    endAt: endOfMonth(today),
    status: exampleStatuses[2],
    group: { id: "3", name: "Cloud Infrastructure" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "6",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=6",
      name: "Fiona Gallagher",
    },
    initiative: { id: "3", name: "Cloud Migration" },
    release: { id: "3", name: "v1.2" },
  },
  {
    id: "7",
    name: "AI-Assisted Video Transitions",
    startAt: startOfMonth(today),
    endAt: endOfMonth(addMonths(today, 1)),
    status: exampleStatuses[0],
    group: { id: "1", name: "Core AI Features" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "7",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=7",
      name: "George Lucas",
    },
    initiative: { id: "1", name: "AI Integration" },
    release: { id: "3", name: "v1.2" },
  },
  {
    id: "8",
    name: "Version Control System",
    startAt: startOfMonth(addMonths(today, 1)),
    endAt: endOfMonth(addMonths(today, 2)),
    status: exampleStatuses[1],
    group: { id: "2", name: "Collaboration Tools" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "8",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=8",
      name: "Hannah Montana",
    },
    initiative: { id: "2", name: "Real-time Collaboration" },
    release: { id: "3", name: "v1.2" },
  },
  {
    id: "9",
    name: "AI Content-Aware Fill",
    startAt: startOfMonth(addMonths(today, 2)),
    endAt: endOfMonth(addMonths(today, 3)),
    status: exampleStatuses[2],
    group: { id: "1", name: "Core AI Features" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "9",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=9",
      name: "Ian Malcolm",
    },
    initiative: { id: "1", name: "AI Integration" },
    release: { id: "4", name: "v1.3" },
  },
  {
    id: "10",
    name: "Multi-User Permissions",
    startAt: startOfMonth(addMonths(today, 3)),
    endAt: endOfMonth(addMonths(today, 4)),
    status: exampleStatuses[0],
    group: { id: "2", name: "Collaboration Tools" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "10",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=10",
      name: "Julia Roberts",
    },
    initiative: { id: "2", name: "Real-time Collaboration" },
    release: { id: "4", name: "v1.3" },
  },
  {
    id: "11",
    name: "AI-Powered Audio Enhancement",
    startAt: startOfMonth(addMonths(today, 4)),
    endAt: endOfMonth(addMonths(today, 5)),
    status: exampleStatuses[1],
    group: { id: "1", name: "Core AI Features" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "11",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=11",
      name: "Kevin Hart",
    },
    initiative: { id: "1", name: "AI Integration" },
    release: { id: "4", name: "v1.3" },
  },
  {
    id: "12",
    name: "Real-time Project Analytics",
    startAt: startOfMonth(addMonths(today, 5)),
    endAt: endOfMonth(addMonths(today, 6)),
    status: exampleStatuses[2],
    group: { id: "3", name: "Cloud Infrastructure" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "12",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=12",
      name: "Lara Croft",
    },
    initiative: { id: "3", name: "Cloud Migration" },
    release: { id: "5", name: "v1.4" },
  },
  {
    id: "13",
    name: "AI Scene Recommendations",
    startAt: startOfMonth(addMonths(today, 6)),
    endAt: endOfMonth(addMonths(today, 7)),
    status: exampleStatuses[0],
    group: { id: "1", name: "Core AI Features" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "13",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=13",
      name: "Michael Scott",
    },
    initiative: { id: "1", name: "AI Integration" },
    release: { id: "5", name: "v1.4" },
  },
  {
    id: "14",
    name: "Collaborative Storyboarding",
    startAt: startOfMonth(addMonths(today, 7)),
    endAt: endOfMonth(addMonths(today, 8)),
    status: exampleStatuses[1],
    group: { id: "2", name: "Collaboration Tools" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "14",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=14",
      name: "Natalie Portman",
    },
    initiative: { id: "2", name: "Real-time Collaboration" },
    release: { id: "5", name: "v1.4" },
  },
  {
    id: "15",
    name: "AI-Driven Video Compression",
    startAt: startOfMonth(addMonths(today, 8)),
    endAt: endOfMonth(addMonths(today, 9)),
    status: exampleStatuses[2],
    group: { id: "1", name: "Core AI Features" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "15",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=15",
      name: "Oscar Isaac",
    },
    initiative: { id: "1", name: "AI Integration" },
    release: { id: "6", name: "v1.5" },
  },
  {
    id: "16",
    name: "Global CDN Integration",
    startAt: startOfMonth(addMonths(today, 9)),
    endAt: endOfMonth(addMonths(today, 10)),
    status: exampleStatuses[0],
    group: { id: "3", name: "Cloud Infrastructure" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "16",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=16",
      name: "Penelope Cruz",
    },
    initiative: { id: "3", name: "Cloud Migration" },
    release: { id: "6", name: "v1.5" },
  },
  {
    id: "17",
    name: "AI Object Tracking",
    startAt: startOfMonth(addMonths(today, 10)),
    endAt: endOfMonth(addMonths(today, 11)),
    status: exampleStatuses[1],
    group: { id: "1", name: "Core AI Features" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "17",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=17",
      name: "Quentin Tarantino",
    },
    initiative: { id: "1", name: "AI Integration" },
    release: { id: "6", name: "v1.5" },
  },
  {
    id: "18",
    name: "Real-time Language Translation",
    startAt: startOfMonth(addMonths(today, 11)),
    endAt: endOfMonth(addMonths(today, 12)),
    status: exampleStatuses[2],
    group: { id: "2", name: "Collaboration Tools" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "18",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=18",
      name: "Rachel Green",
    },
    initiative: { id: "2", name: "Real-time Collaboration" },
    release: { id: "7", name: "v1.6" },
  },
  {
    id: "19",
    name: "AI-Powered Video Summarization",
    startAt: startOfMonth(addMonths(today, 12)),
    endAt: endOfMonth(addMonths(today, 13)),
    status: exampleStatuses[0],
    group: { id: "1", name: "Core AI Features" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "19",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=19",
      name: "Samuel L. Jackson",
    },
    initiative: { id: "1", name: "AI Integration" },
    release: { id: "7", name: "v1.6" },
  },
  {
    id: "20",
    name: "Blockchain-based Asset Licensing",
    startAt: startOfMonth(addMonths(today, 13)),
    endAt: endOfMonth(addMonths(today, 14)),
    status: exampleStatuses[1],
    group: { id: "3", name: "Cloud Infrastructure" },
    product: { id: "1", name: "Video Editor Pro" },
    owner: {
      id: "20",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=20",
      name: "Tom Hanks",
    },
    initiative: { id: "3", name: "Cloud Migration" },
    release: { id: "7", name: "v1.6" },
  },
];

export const exampleMarkers = [
  {
    id: "1",
    date: startOfMonth(subMonths(today, 3)),
    label: "Project Kickoff",
    className: "bg-blue-100 text-blue-900",
  },
  {
    id: "2",
    date: subMonths(endOfMonth(today), 2),
    label: "Phase 1 Completion",
    className: "bg-green-100 text-green-900",
  },
  {
    id: "3",
    date: startOfMonth(addMonths(today, 3)),
    label: "Beta Release",
    className: "bg-purple-100 text-purple-900",
  },
  {
    id: "4",
    date: endOfMonth(addMonths(today, 6)),
    label: "Version 1.0 Launch",
    className: "bg-red-100 text-red-900",
  },
  {
    id: "5",
    date: startOfMonth(addMonths(today, 9)),
    label: "User Feedback Review",
    className: "bg-orange-100 text-orange-900",
  },
  {
    id: "6",
    date: endOfMonth(addMonths(today, 12)),
    label: "Annual Performance Evaluation",
    className: "bg-teal-100 text-teal-900",
  },
];

const GanttDemo = () => {
  const [features, setFeatures] = useState(exampleFeatures);

  const groupedFeatures: Record<string, typeof features> = features.reduce<
    Record<string, typeof features>
  >((groups, feature) => {
    const groupName = feature.group.name;
    return {
      ...groups,
      [groupName]: [...(groups[groupName] || []), feature],
    };
  }, {});

  const sortedGroupedFeatures = Object.fromEntries(
    Object.entries(groupedFeatures).sort(([nameA], [nameB]) =>
      nameA.localeCompare(nameB)
    )
  );

  const handleViewFeature = (id: string) =>
    console.log(`Feature selected: ${id}`);

  const handleCopyLink = (id: string) => console.log(`Copy link: ${id}`);

  const handleRemoveFeature = (id: string) =>
    setFeatures((prev) => prev.filter((feature) => feature.id !== id));

  const handleRemoveMarker = (id: string) =>
    console.log(`Remove marker: ${id}`);

  const handleCreateMarker = (date: Date) =>
    console.log(`Create marker: ${date.toISOString()}`);

  const handleMoveFeature = (id: string, startAt: Date, endAt: Date | null) => {
    if (!endAt) {
      return;
    }

    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === id ? { ...feature, startAt, endAt } : feature
      )
    );

    console.log(`Move feature: ${id} from ${startAt} to ${endAt}`);
  };

  const handleAddFeature = (date: Date) =>
    console.log(`Add feature: ${date.toISOString()}`);

  return (
    <GanttProvider onAddItem={handleAddFeature} range="monthly" zoom={100}>
      <GanttSidebar>
        {Object.entries(sortedGroupedFeatures).map(([group, features]) => (
          <GanttSidebarGroup key={group} name={group}>
            {features.map((feature) => (
              <GanttSidebarItem
                key={feature.id}
                feature={feature}
                onSelectItem={handleViewFeature}
              />
            ))}
          </GanttSidebarGroup>
        ))}
      </GanttSidebar>
      <GanttTimeline>
        <GanttHeader />
        <GanttFeatureList>
          {Object.entries(sortedGroupedFeatures).map(([group, features]) => (
            <GanttFeatureListGroup key={group}>
              {features.map((feature) => (
                <div className="flex" key={feature.id}>
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <button
                        type="button"
                        onClick={() => handleViewFeature(feature.id)}
                      >
                        <GanttFeatureItem
                          onMove={handleMoveFeature}
                          {...feature}
                        >
                          <p className="flex-1 truncate text-xs">
                            {feature.name}
                          </p>
                          {feature.owner && (
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={feature.owner.image} />
                              <AvatarFallback>
                                {feature.owner.name?.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </GanttFeatureItem>
                      </button>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleViewFeature(feature.id)}
                      >
                        <EyeIcon size={16} className="text-muted-foreground" />
                        View feature
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleCopyLink(feature.id)}
                      >
                        <LinkIcon size={16} className="text-muted-foreground" />
                        Copy link
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="flex items-center gap-2 text-destructive"
                        onClick={() => handleRemoveFeature(feature.id)}
                      >
                        <TrashIcon size={16} />
                        Remove from roadmap
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </div>
              ))}
            </GanttFeatureListGroup>
          ))}
        </GanttFeatureList>
        {exampleMarkers.map((marker) => (
          <GanttMarker
            key={marker.id}
            {...marker}
            onRemove={handleRemoveMarker}
          />
        ))}
        <GanttToday />
        <GanttCreateMarkerTrigger onCreateMarker={handleCreateMarker} />
      </GanttTimeline>
    </GanttProvider>
  );
};

export default GanttDemo;
