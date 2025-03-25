import { FloatingPaths } from "@foundations/shadcn/components/kokonutui/background-paths";
import { GridBackground } from "../grid-background";

export default function RightImage() {
  return (
    <div className="relative flex w-full flex-col items-center px-5 overflow-x-hidden">
      <div className="relative isolate mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative grid-cols-1 pb-24 pt-32 md:grid-cols-[max(50%,400px)_1fr] grid mx-auto">
        <GridBackground maxWidthClass="max-w-7xl" />

        <FloatingPaths position={-1} color="text-cyan-500" />
        <FloatingPaths position={-2} color="text-blue-500" />
      </div>
    </div>
  );
}
