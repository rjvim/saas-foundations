import { cn } from "@foundations/shadcn/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@foundations/shadcn/components/card";
import { Skeleton } from "@foundations/shadcn/components/skeleton";
import type { SettingsCardClassNames } from "../settings-card";

export function SettingsCardSkeleton({
  className,
  classNames,
}: {
  className?: string;
  classNames?: SettingsCardClassNames;
}) {
  return (
    <Card className={cn("w-full overflow-hidden", className, classNames?.base)}>
      <CardHeader className={cn("space-y-2", classNames?.header)}>
        <Skeleton className={cn("h-5 w-1/3 md:h-6", classNames?.skeleton)} />
        <Skeleton className={cn("h-4 w-2/3", classNames?.skeleton)} />
      </CardHeader>

      <CardContent className={cn("space-y-2", classNames?.content)}>
        <Skeleton className={cn("h-9 w-full", classNames?.skeleton)} />
      </CardContent>

      <CardFooter
        className={cn(
          "flex flex-col justify-between gap-4 border-t bg-muted py-4 md:flex-row md:py-3 dark:bg-transparent",
          classNames?.footer
        )}
      >
        <Skeleton className={cn("h-4 w-48 md:w-56", classNames?.skeleton)} />
        <Skeleton className={cn("h-8 w-14 md:ms-auto", classNames?.skeleton)} />
      </CardFooter>
    </Card>
  );
}
