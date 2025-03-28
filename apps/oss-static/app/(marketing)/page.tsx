import MinimalGridFeatures from "@workspace/ui/features/minimal-grid";
import GanttDemo from "@workspace/ui/gantt-demo";
import AnimatedHero from "@workspace/ui/heros/animated-hero";

export default function HomePage() {
  const defaultFeatures = [
    {
      title: "Built for developers",
      description:
        "Built for engineers, developers, dreamers, thinkers and doers.",
      icon: <div className="w-6 h-6">⌨️</div>,
    },
    {
      title: "Ease of use",
      description:
        "It's as easy as using an Apple, and as expensive as buying one.",
      icon: <div className="w-6 h-6">🔄</div>,
    },
    {
      title: "Pricing like no other",
      description:
        "Our prices are best in the market. No cap, no lock, no credit card required.",
      icon: <div className="w-6 h-6">💰</div>,
    },
    {
      title: "100% Uptime guarantee",
      description: "We just cannot be taken down by anyone.",
      icon: <div className="w-6 h-6">☁️</div>,
    },
    {
      title: "Multi-tenant Architecture",
      description: "You can simply share passwords instead of buying new seats",
      icon: <div className="w-6 h-6">🔀</div>,
    },
    {
      title: "24/7 Customer Support",
      description:
        "We are available a 100% of the time. Atleast our AI Agents are.",
      icon: <div className="w-6 h-6">❓</div>,
    },
    {
      title: "Money back guarantee",
      description:
        "If you donot like EveryAI, we will convince you to like us.",
      icon: <div className="w-6 h-6">⚙️</div>,
    },
    {
      title: "And everything else",
      description: "I just ran out of copy ideas. Accept my sincere apologies",
      icon: <div className="w-6 h-6">❤️</div>,
    },
  ];

  return (
    <div>
      <AnimatedHero />
      <div className="max-w-7xl px-4 mx-auto">
        <GanttDemo />
      </div>
      <MinimalGridFeatures features={defaultFeatures} />
    </div>
  );
}
