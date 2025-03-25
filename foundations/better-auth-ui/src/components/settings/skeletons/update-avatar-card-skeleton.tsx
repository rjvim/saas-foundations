import { cn } from "@foundations/shadcn/lib/utils";
import {
  Card,
  CardFooter,
  CardHeader,
} from "@foundations/shadcn/components/card";
import { Skeleton } from "@foundations/shadcn/components/skeleton";
import type { SettingsCardClassNames } from "../settings-card";

export function UpdateAvatarCardSkeleton({
  className,
  classNames,
}: {
  className?: string;
  classNames?: SettingsCardClassNames;
}) {
  return (
    <Card className={cn("w-full overflow-hidden", className, classNames?.base)}>
      <div className="flex justify-between">
        <CardHeader className={cn("grow space-y-2", classNames?.header)}>
          <Skeleton
            className={cn(
              "mt-0.5 h-5 w-24 md:mt-0 md:h-6",
              classNames?.skeleton
            )}
          />

          <div className="flex flex-col space-y-1.5">
            <Skeleton
              className={cn("h-3 w-5/6 md:h-4", classNames?.skeleton)}
            />
            <Skeleton
              className={cn("h-3 w-2/3 md:hidden", classNames?.skeleton)}
            />
          </div>
        </CardHeader>

        <div className="my-5 me-6">
          <Skeleton
            className={cn(
              "size-20 rounded-full",
              classNames?.avatar?.base,
              classNames?.skeleton
            )}
          />
        </div>
      </div>

      <CardFooter
        className={cn(
          "border-t bg-muted py-4.5 dark:bg-transparent",
          classNames?.footer
        )}
      >
        <Skeleton
          className={cn(
            "mx-auto h-4 w-64 md:mx-0 md:my-0.5 md:w-80",
            classNames?.skeleton
          )}
        />
      </CardFooter>
    </Card>
  );
}
