import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@foundations/shadcn/components/button";

interface FeatureCardProps {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  relatedLinks?: Array<{
    title: string;
    description: string;
    href: string;
  }>;
}

export default function FeatureCard({
  title = "Accept and optimise payments, globally",
  description = "Increase authorisation rates, optimise your checkout conversion, and offer local payment methods in every market.",
  ctaText = "Start with Payments",
  ctaHref = "#",
  relatedLinks = [
    {
      title: "Tax",
      description: "for automating sales tax and VAT",
      href: "#",
    },
    {
      title: "Radar",
      description: "for fraud prevention and management",
      href: "#",
    },
    {
      title: "Terminal",
      description: "for custom in-person payments",
      href: "#",
    },
  ],
}: FeatureCardProps) {
  return (
    <div className="max-w-xl p-8 flex flex-col space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl text-slate-800 font-medium">Payments</span>
      </div>

      <h2 className="text-5xl font-bold text-slate-900 leading-tight">
        {title}
      </h2>

      <p className="text-xl text-slate-600 leading-relaxed">{description}</p>

      <Button>
        {ctaText} <ChevronRight className="w-5 h-5" />
      </Button>

      {relatedLinks && relatedLinks.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-4">See also</h3>
          <div className="space-y-3">
            {relatedLinks.map((link, index) => (
              <div key={index} className="flex">
                <Link
                  href={link.href}
                  className="text-indigo-500 hover:text-indigo-600 font-medium text-xl"
                >
                  {link.title}
                </Link>
                <span className="text-slate-600 text-xl ml-1">
                  {" " + link.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
