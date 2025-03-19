import React, { useState, useEffect, useRef } from "react";
import FeatureCard from "./feature-card";

const features = [
  {
    id: 1,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
      >
        <path d="M4 9L9 4L14 9" fill="#6366F1" />
        <path d="M9 4L14 9L19 4" fill="#8B5CF6" />
        <path d="M14 19L9 14L4 19" fill="#8B5CF6" />
        <path d="M19 14L14 19L9 14" fill="#6366F1" />
      </svg>
    ),
    badge: "Payments",
    title: "Accept and optimise payments, globally",
    description:
      "Increase authorisation rates, optimise your checkout conversion, and offer local payment methods in every market.",
    buttonText: "Start with Payments",
    image:
      "https://raw.githubusercontent.com/cruip/cruip-tutorials/refs/heads/main/sticky-scrolling/illustration-04.png",
  },
  {
    id: 2,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
      >
        <path d="M4 9L9 4L14 9" fill="#10B981" />
        <path d="M9 4L14 9L19 4" fill="#0EA5E9" />
        <path d="M14 19L9 14L4 19" fill="#0EA5E9" />
        <path d="M19 14L14 19L9 14" fill="#10B981" />
      </svg>
    ),
    badge: "Billing",
    title: "Build flexible subscription models",
    description:
      "Create and manage recurring billing plans with custom pricing tiers, trial periods, and automated invoicing for subscription businesses.",
    buttonText: "Explore Billing",
    image:
      "https://raw.githubusercontent.com/cruip/cruip-tutorials/refs/heads/main/sticky-scrolling/illustration-01.png",
  },
  {
    id: 3,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
      >
        <path d="M4 9L9 4L14 9" fill="#F59E0B" />
        <path d="M9 4L14 9L19 4" fill="#EF4444" />
        <path d="M14 19L9 14L4 19" fill="#EF4444" />
        <path d="M19 14L14 19L9 14" fill="#F59E0B" />
      </svg>
    ),
    badge: "Connect",
    title: "Create marketplace payment flows",
    description:
      "Build multi-sided marketplaces with seamless onboarding, split payments, and automated payouts to your platform and connected accounts.",
    buttonText: "Start with Connect",
    image:
      "https://raw.githubusercontent.com/cruip/cruip-tutorials/refs/heads/main/sticky-scrolling/illustration-02.png",
  },
  {
    id: 4,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
      >
        <path d="M4 9L9 4L14 9" fill="#A855F7" />
        <path d="M9 4L14 9L19 4" fill="#EC4899" />
        <path d="M14 19L9 14L4 19" fill="#EC4899" />
        <path d="M19 14L14 19L9 14" fill="#A855F7" />
      </svg>
    ),
    badge: "Terminal",
    title: "Design in-person payment experiences",
    description:
      "Create custom in-person checkout experiences with flexible SDKs, pre-certified card readers, and unified reporting across channels.",
    buttonText: "Explore Terminal",
    image:
      "https://raw.githubusercontent.com/cruip/cruip-tutorials/refs/heads/main/sticky-scrolling/illustration-03.png",
  },
];

const PaymentFeaturesUI = () => {
  const [activeFeature, setActiveFeature] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();

    if (!isMobile) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = parseInt(entry.target.id.replace("section-", ""));
              setActiveFeature(id);
            }
          });
        },
        { threshold: 0.6 }
      );

      sectionRefs.current.forEach((section) => {
        if (section) observer.observe(section);
      });

      return () => {
        sectionRefs.current.forEach((section) => {
          if (section) observer.unobserve(section);
        });
      };
    }

    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [isMobile]);

  return (
    <main className="relative flex min-h-screen flex-col justify-center overflow-hidden supports-[overflow:clip]:overflow-clip rounded-md">
      <div className="mx-auto w-full max-w-6xl">
        {/* Desktop Layout */}
        {!isMobile && (
          <div className="relative">
            <div className="flex">
              {/* Left side: Scrollable content */}
              <div className="w-3/6">
                {features.map((feature, index) => (
                  <div
                    key={feature.id}
                    id={`section-${feature.id}`}
                    ref={(el) => (sectionRefs.current[index] = el)}
                    className="flex h-screen flex-col items-start justify-center pr-12"
                  >
                    <FeatureCard
                      title={feature.title}
                      description={feature.description}
                      ctaText={"Start with Payments"}
                      ctaHref={"#"}
                    />
                  </div>
                ))}
              </div>

              {/* Right side: Sticky content */}
              <div className="w-3/6">
                <div className="sticky top-0 flex h-screen items-center justify-center p-12">
                  <img
                    src={features.find((f) => f.id === activeFeature)?.image}
                    alt={features.find((f) => f.id === activeFeature)?.title}
                    className="max-w-full rounded-xl shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <div className="space-y-16 py-8">
            {features.map((feature) => (
              <div key={feature.id} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center mb-2">
                    <div className="mr-3">{feature.icon}</div>
                    <h3 className="text-lg font-medium text-slate-800">
                      {feature.badge}
                    </h3>
                  </div>

                  <h2 className="text-3xl font-bold text-slate-900">
                    {feature.title}
                  </h2>

                  <p className="text-lg text-slate-600">
                    {feature.description}
                  </p>

                  <a
                    href="#"
                    className="inline-flex items-center px-5 py-2 mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-full"
                  >
                    {feature.buttonText}
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </a>
                </div>
                <div className="flex justify-center">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="max-w-full rounded-xl shadow-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default PaymentFeaturesUI;
