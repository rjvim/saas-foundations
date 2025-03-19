import React from "react";
type StickyContent = {
  title?: string;
  details?: string;
  image_url: string;
};
type Props = {
  children: React.ReactNode;
  stickyContent: StickyContent;
};
const CustomStickyScroller = ({ children, stickyContent }: Props) => {
  return (
    <div className="flex flex-col lg:flex-row py-8 mobile:ml-2 gap-6  w-full">
      {/* Main Content */}
      <div className="right flex flex-col items-start rounded-2xl border border-slate-200 dark:border-neutral-700   w-full lg:w-[50%] shadow-lg">
        {children}
      </div>
      {/* Sidebar Container */}
      <div className="relative right w-full lg:w-[50%]">
        <div className="flex flex-col items-start gap-3">
          {stickyContent.title && (
            <span className="text-[#101828] dark:text-gray-100 font-inter text-5xl font-semibold leading-[45px] tracking-[-0.96px]">
              {stickyContent.title}
            </span>
          )}
          {stickyContent.details && (
            <span className="text-[#475467] dark:text-gray-300 font-inter text-xl font-normal leading-[30px]">
              {stickyContent.details}
            </span>
          )}
        </div>
        <div className="sticky top-8 hidden lg:block">
          <div className=" p-4 flex flex-col items-start gap-4">
            <img
              className="max-w-60 hidden lg:block"
              src={stickyContent.image_url}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomStickyScroller;
