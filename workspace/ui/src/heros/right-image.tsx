import { FloatingPaths } from "@foundations/shadcn/components/kokonutui/background-paths";
import { GridBackground } from "../grid-background";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@foundations/shadcn/components/button";
import { cn } from "@foundations/shadcn/lib/utils";
import Image from "next/image";

export default function RightImage() {
  return (
    <div className="relative flex w-full flex-col items-center px-5 overflow-x-hidden">
      <GridBackground maxWidthClass="max-w-7xl" />

      <FloatingPaths position={-1} color="text-cyan-500" />
      <FloatingPaths position={-2} color="text-blue-500" />

      <div className="relative isolate mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative grid-cols-1 pb-24 pt-32 md:grid-cols-[max(50%,400px)_1fr] grid mx-auto">
        <div className="space-y-8 sm:px-4">
          <div className="flex h-6 w-fit items-center gap-2 whitespace-nowrap rounded-full bg-black/30 py-0.5 pl-3 pr-3 text-xs font-semibold text-white backdrop-blur">
            Preview
          </div>

          <span
            className={cn(
              "text-[min(88px,7vmax)] font-bold leading-[1.1] tracking-tighter text-[#2F2E31]",
              "isolate block mix-blend-color-burn"
            )}
          >
            Financial infrastructure to grow your revenue
          </span>

          <p className="text-base md:text-lg">
            Join the millions of companies that use Stripe to accept payments
            online and in person, embed financial services, power custom revenue
            models, and build a more profitable business.
          </p>

          <Button className="rounded-full">
            Request an invite <ArrowRightIcon />
          </Button>
        </div>

        <div className="absolute bottom-48 left-56 col-start-2 h-[580px] w-[920px] overflow-hidden rounded-2xl bg-white/30 shadow-2xl">
          <div className="ml-56 mt-16 size-full rounded-tl-lg bg-white" />
        </div>
        <div className="relative hidden h-full items-center justify-center md:flex">
          <Image
            src={"https://placehold.co/270x536"}
            alt="phone"
            width={270}
            height={536}
            className="relative object-contain"
            style={{
              filter: "drop-shadow(0 6px 24px rgba(0,0,0,0.4))",
            }}
          />
        </div>
      </div>
    </div>
  );
}
