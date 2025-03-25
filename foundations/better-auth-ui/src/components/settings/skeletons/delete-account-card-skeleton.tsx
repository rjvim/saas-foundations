import { cn } from "@foundations/shadcn/lib/utils";
import {
  Card,
  CardFooter,
  CardHeader,
} from "@foundations/shadcn/components/card";
import { Skeleton } from "@foundations/shadcn/components/skeleton";
import type { SettingsCardClassNames } from "../settings-card";

export function DeleteAccountCardSkeleton({
  className,
  classNames,
}: {
  className?: string;
  classNames?: SettingsCardClassNames;
}) {
  return (
    <Card
      className={cn(
        "w-full overflow-hidden border-destructive/40",
        className,
        classNames?.base
      )}
    >
      <CardHeader className={cn("space-y-2", classNames?.header)}>
        <Skeleton className={cn("h-5 w-32 md:h-6", classNames?.skeleton)} />
        <Skeleton className={cn("h-4 w-11/12", classNames?.skeleton)} />
        <Skeleton className={cn("-mt-2 h-4 w-3/4", classNames?.skeleton)} />
      </CardHeader>

      <CardFooter
        className={cn(
          "flex border-destructive/30 border-t bg-destructive/10 py-4 md:py-3",
          classNames?.footer
        )}
      >
        <Skeleton
          className={cn(
            "mx-auto h-8 w-32 md:mx-0 md:ms-auto",
            classNames?.skeleton
          )}
        />
      </CardFooter>
    </Card>
  );
}
