"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Props = { companies: string[] };

export function WorkedWithCarousel({ companies }: Props) {
  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      className="w-full px-10"
    >
      <CarouselContent className="-ml-2">
        {companies.map((name) => (
          <CarouselItem
            key={name}
            className="flex shrink-0 basis-auto items-center justify-center pl-2"
          >
            <span className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-zinc-50/80 px-4 py-2 text-center text-sm font-medium text-zinc-800">
              {name}
            </span>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 border-zinc-200 bg-zinc-50 hover:bg-zinc-100 disabled:opacity-30" />
      <CarouselNext className="right-0 border-zinc-200 bg-zinc-50 hover:bg-zinc-100 disabled:opacity-30" />
    </Carousel>
  );
}
