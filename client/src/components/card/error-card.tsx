import * as React from "react";
import Link from "next/link";

import { ClientButton } from "@/components/client/client-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card-update";
import { Icons } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface ErrorCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  icon?: keyof typeof Icons;
  title: string;
  description: string;
  retryLink?: string;
  retryLinkText?: string;
  reset?: () => void;
}

export function ErrorCard({
  icon,
  title,
  description,
  retryLink,
  retryLinkText = "Trở lại",
  reset,
  className,
  ...props
}: ErrorCardProps) {
  const Icon = Icons[icon ?? "warning"];

  return (
    <Card
      as="section"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={cn("grid w-full place-items-center", className)}
      {...props}
    >
      <CardHeader>
        <div className="grid h-20 w-20 place-items-center rounded-full bg-muted">
            <Icon className="h-10 w-10 text-red-500" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent className="flex min-h-[176px] flex-col items-center justify-center space-y-2.5 text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      {retryLink ? (
        <CardFooter>
          <Link
            href={retryLink}
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
            )}
          >
            <ArrowLeft className="w-4 h-4 mr-2"/> {retryLinkText}
            <span className="sr-only">{retryLinkText}</span>
          </Link>
        </CardFooter>
      ) : null}
      {reset ? (
        <CardFooter>
          <ClientButton aria-label="Retry" variant="ghost" onClick={reset}>
            Thử lại
          </ClientButton>
        </CardFooter>
      ) : null}
    </Card>
  );
}