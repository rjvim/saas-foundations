import React, { useRef, useState, useLayoutEffect } from "react";

interface StickySectionsProps {
  children: React.ReactNode;
  className?: string;
}

const StickySections: React.FC<StickySectionsProps> = ({
  children,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Helper function to remap a value from one range to another
  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = Array.from(container.querySelectorAll("section"));

    // Initialize container styles
    container.style.setProperty("--stick-items", `${sections.length + 1}00vh`);

    // Apply temporary transition prevention
    container.classList.add("[&_*]:!transition-none");
    setTimeout(() => {
      container.classList.remove("[&_*]:!transition-none");
    }, 1);

    const handleScroll = () => {
      const viewportTop = window.scrollY;
      const containerHeight = container.clientHeight;
      const containerTop = container.offsetTop;
      const containerBottom = containerTop + containerHeight;

      // Calculate scroll value
      let scrollValue;
      if (containerBottom <= viewportTop) {
        // Container is above viewport
        scrollValue = sections.length + 1;
      } else if (containerTop >= viewportTop) {
        // Container is below viewport
        scrollValue = 0;
      } else {
        // Container intersects viewport
        scrollValue = remapValue(
          viewportTop,
          containerTop,
          containerBottom,
          0,
          sections.length + 1
        );
      }

      // Determine active section
      const newActiveIndex =
        Math.floor(scrollValue) >= sections.length
          ? sections.length - 1
          : Math.floor(scrollValue);

      // Only update state if the active index has changed
      if (newActiveIndex !== activeIndex) {
        setActiveIndex(newActiveIndex);
      }

      // Apply styles to all sections
      sections.forEach((section, i) => {
        section.style.setProperty(
          "--stick-visibility",
          i === newActiveIndex ? "1" : "0"
        );
        section.style.setProperty(
          "--stick-scale",
          i === newActiveIndex ? "1" : "0.8"
        );
      });
    };

    // Initial calculation
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeIndex]); // Re-run if active index changes

  return (
    <div
      ref={containerRef}
      data-sticky-sections
      className={`sticky-container ${className}`}
    >
      {children}
    </div>
  );
};

export default StickySections;
