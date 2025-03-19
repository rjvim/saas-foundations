import { useEffect, useRef, useState } from "react";

interface Section {
  id: number;
  leftContent: string;
  rightContent: string;
}

const PatientDetails: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sections: Section[] = [
    {
      id: 1,
      leftContent:
        "Section 1 Left Content - Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      rightContent: "Section 1 Right Content - Sticky Info 1",
    },
    {
      id: 2,
      leftContent:
        "Section 2 Left Content - Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      rightContent: "Section 2 Right Content - Sticky Info 2",
    },
    {
      id: 3,
      leftContent:
        "Section 3 Left Content - Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
      rightContent: "Section 3 Right Content - Sticky Info 3",
    },
  ];

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = parseInt(
              entry.target.getAttribute("data-section") || "0",
              10
            );
            setActiveSection(sectionId);
          }
        });
      },
      { threshold: 0.8 }
    );

    leftRefs.current.forEach((ref) => {
      if (ref) observerRef.current?.observe(ref);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="flex w-full max-w-6xl mx-auto">
      {/* Left Scrolling Section */}
      <div className="w-3/5 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {sections.map((section, index) => (
          <div
            key={section.id}
            ref={(el) => {
              if (el) leftRefs.current[index] = el;
            }}
            data-section={section.id}
            className="min-h-screen p-5 bg-gray-500 text-white mb-5"
          >
            <h2 className="text-2xl font-bold mb-2">Section {section.id}</h2>
            <p>{section.leftContent}</p>
          </div>
        ))}
      </div>

      {/* Sticky Right Section */}
      <div className="w-2/5 h-screen sticky top-0 p-5">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`p-5 absolute top-0 h-[10rem] bg-white border border-gray-200 mb-5 transition-all duration-300 ${
              activeSection === section.id
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-5 "
            }`}
          >
            <h3 className="text-xl font-semibold mb-2">Sticky {section.id}</h3>
            <p>{section.rightContent}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDetails;
