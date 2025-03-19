"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@foundations/shadcn/components/button";
import { NavigationMenuDemo } from "./navigation-menu";
import { GridBackground } from "./grid-background";
import Footer from "./footer";
import StripeCanvas from "./StripeCanvas";
import Image from "next/image";
import phoneImg from "./stripe/phone.svg";
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@foundations/shadcn/lib/utils";
import StickySections from "./stick-sections-2";
import { PPScrollerSection } from "./PPScrollerSection";
import StickyScroll from "./sticky-scroll";

const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Marketplace", href: "#" },
  { name: "Company", href: "#" },
];

const features = [
  {
    id: 1,
    badge: "Integrated Knowledge",
    title: "Support your users with popular topics",
    description:
      "Statistics show that people browsing your webpage who receive live assistance with a chat widget are more likely to make a purchase.",
    image:
      "https://raw.githubusercontent.com/cruip/cruip-tutorials/refs/heads/main/sticky-scrolling/illustration-04.png",
  },
  {
    id: 2,
    badge: "Authentic Experiences",
    title: "Personalise the support experience",
    description:
      "Statistics show that people browsing your webpage who receive live assistance with a chat widget are more likely to make a purchase.",
    image:
      "https://raw.githubusercontent.com/cruip/cruip-tutorials/refs/heads/main/sticky-scrolling/illustration-01.png",
  },
  {
    id: 3,
    badge: "Live Assistance",
    title: "Scale your sales using automation",
    description:
      "Statistics show that people browsing your webpage who receive live assistance with a chat widget are more likely to make a purchase.",
    image:
      "https://raw.githubusercontent.com/cruip/cruip-tutorials/refs/heads/main/sticky-scrolling/illustration-02.png",
  },
  {
    id: 4,
    badge: "Satisfaction Guaranteed",
    title: "Make customer satisfaction easier",
    description:
      "Statistics show that people browsing your webpage who receive live assistance with a chat widget are more likely to make a purchase.",
    image:
      "https://raw.githubusercontent.com/cruip/cruip-tutorials/refs/heads/main/sticky-scrolling/illustration-03.png",
  },
];

export default function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8 @container"
        >
          <div className="flex items-center gap-x-12">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
            <div className="hidden lg:flex lg:gap-x-12">
              <NavigationMenuDemo />
            </div>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="#" className="text-sm/6 font-semibold text-gray-900">
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <StripeCanvas />

      <div className="relative flex w-full flex-col items-center px-5 overflow-x-hidden">
        <div className="relative isolate mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative grid-cols-1 pb-24 pt-32 md:grid-cols-[max(50%,400px)_1fr] grid mx-auto">
          <GridBackground maxWidthClass="max-w-7xl" />

          <div className="space-y-8 sm:px-4">
            <div className="flex h-6 w-fit items-center gap-2 whitespace-nowrap rounded-full bg-black/30 py-0.5 pl-3 pr-3 text-xs font-semibold text-white backdrop-blur">
              Preview
            </div>

            <span
              className={cn(
                "text-[min(88px,7vmax)] font-bold leading-[1.1] tracking-tighter text-[#2F2E31]",
                "isolate block mix-blend-color-burn"
              )}
            >
              Financial infrastructure to grow your revenue
            </span>

            <p className="text-base md:text-lg">
              Join the millions of companies that use Stripe to accept payments
              online and in person, embed financial services, power custom
              revenue models, and build a more profitable business.
            </p>

            <Button className="rounded-full">
              Request an invite <ArrowRightIcon />
            </Button>
          </div>

          <div className="absolute bottom-48 left-56 col-start-2 h-[580px] w-[920px] overflow-hidden rounded-2xl bg-white/30 shadow-2xl">
            <div className="ml-56 mt-16 size-full rounded-tl-lg bg-white" />
          </div>
          <div className="relative hidden h-full items-center justify-center md:flex">
            <Image
              src={phoneImg}
              alt="phone"
              width={270}
              height={536}
              className="relative object-contain"
              style={{
                filter: "drop-shadow(0 6px 24px rgba(0,0,0,0.4))",
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative isolate mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GridBackground maxWidthClass="max-w-7xl" />

        <div className="relative">
          <div className="mx-auto max-w-5xl px-4">
            <div className="py-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex items-center justify-center py-6">
                  <img
                    src="https://placehold.co/200x40"
                    alt="Logo 1"
                    className="h-8"
                  />
                </div>
                <div className="flex items-center justify-center py-6">
                  <img
                    src="https://placehold.co/200x40"
                    alt="Logo 2"
                    className="h-8"
                  />
                </div>
                <div className="flex items-center justify-center py-6">
                  <img
                    src="https://placehold.co/200x40"
                    alt="Logo 3"
                    className="h-8"
                  />
                </div>
                <div className="flex items-center justify-center py-6">
                  <img
                    src="https://placehold.co/200x40"
                    alt="Logo 4"
                    className="h-8"
                  />
                </div>
                <div className="flex items-center justify-center py-6">
                  <img
                    src="https://placehold.co/200x40"
                    alt="Logo 1"
                    className="h-8"
                  />
                </div>
                <div className="flex items-center justify-center py-6">
                  <img
                    src="https://placehold.co/200x40"
                    alt="Logo 2"
                    className="h-8"
                  />
                </div>
                <div className="flex items-center justify-center py-6">
                  <img
                    src="https://placehold.co/200x40"
                    alt="Logo 3"
                    className="h-8"
                  />
                </div>
                <div className="flex items-center justify-center py-6">
                  <img
                    src="https://placehold.co/200x40"
                    alt="Logo 4"
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative isolate mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 hidden">
        <GridBackground maxWidthClass="max-w-7xl" />
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Announcing our next round of funding.{" "}
              <a href="#" className="font-semibold text-indigo-600">
                <span aria-hidden="true" className="absolute inset-0" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
              Data to enrich your online business
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
              lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </a>
              <a href="#" className="text-sm/6 font-semibold text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a>
              <Button>This is a ShadCN button</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50">
        <div className="relative isolate mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <GridBackground maxWidthClass="max-w-7xl" />

          <StickyScroll />

          {/* <PPScrollerSection /> */}

          {/* <StickySections className="max-w-md mx-auto lg:max-w-none lg:min-h-(--stick-items)">
            <div className="lg:sticky lg:top-0 lg:h-screen space-y-16 lg:space-y-0">
              {features.map((feature) => (
                <section
                  key={feature.id}
                  className="lg:absolute lg:inset-0 lg:z-(--stick-visibility)"
                >
                  <div className="flex flex-col lg:h-full lg:flex-row space-y-4 space-y-reverse lg:space-y-0 lg:space-x-20">
                    <div className="flex-1 flex items-center lg:opacity-(--stick-visibility) transition-opacity duration-300 order-1 lg:order-none">
                      <div className="space-y-3">
                        <div className="relative inline-flex text-indigo-500 font-semibold">
                          {feature.badge}
                          <svg
                            className="fill-indigo-300 absolute top-full w-full"
                            xmlns="http://www.w3.org/2000/svg"
                            width="166"
                            height="4"
                          >
                            <path d="M98.865 1.961c-8.893.024-17.475.085-25.716.182-2.812.019-5.023.083-7.622.116l-6.554.067a2910.9 2910.9 0 0 0-25.989.38c-4.04.067-7.709.167-11.292.27l-1.34.038c-2.587.073-4.924.168-7.762.22-2.838.051-6.054.079-9.363.095-1.994.007-2.91-.08-3.106-.225l-.028-.028c-.325-.253.203-.463 1.559-.62l.618-.059c.206-.02.42-.038.665-.054l1.502-.089 3.257-.17 2.677-.132c.902-.043 1.814-.085 2.744-.126l1.408-.06c4.688-.205 10.095-.353 16.167-.444C37.413 1.22 42.753.98 49.12.824l1.614-.037C54.041.707 57.588.647 61.27.6l1.586-.02c4.25-.051 8.53-.1 12.872-.14C80.266.4 84.912.373 89.667.354l2.866-.01c8.639-.034 17.996 0 27.322.03 6.413.006 13.168.046 20.237.12l2.368.027c1.733.014 3.653.05 5.712.105l2.068.064c5.89.191 9.025.377 11.823.64l.924.09c.802.078 1.541.156 2.21.233 1.892.233.29.343-3.235.364l-3.057.02c-.446.003-.89.008-1.33.014a305.77 305.77 0 0 1-4.33-.004c-2.917-.005-5.864-.018-8.783-.019l-4.982.003a447.91 447.91 0 0 1-3.932-.02l-4.644-.023-4.647-.014c-9.167-.026-18.341-.028-26.923.03l-.469-.043Z" />
                          </svg>
                        </div>
                        <h2 className="text-4xl text-slate-900 font-extrabold">
                          {feature.title}
                        </h2>
                        <p className="text-lg text-slate-500">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center lg:scale-(--stick-scale) lg:opacity-(--stick-visibility) transition duration-300">
                      <img
                        width="512"
                        height="480"
                        src={feature.image}
                        alt={`Illustration ${feature.id}`}
                      />
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </StickySections> */}
        </div>
      </div>

      <Footer />
    </div>
  );
}
