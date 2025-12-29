'use client'

import { cn } from '@/lib/utils'
import Autoplay from 'embla-carousel-autoplay'
import AutoHeight from 'embla-carousel-auto-height'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function Carousel({ images }: { images: string[] }) {
   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay(
   )])

   const [selectedIndex, setSelectedIndex] = useState(0)

   useEffect(() => {
      function selectHandler() {
         const index = emblaApi?.selectedScrollSnap()
         setSelectedIndex(index || 0)
      }

      emblaApi?.on('select', selectHandler)

      return () => {
         emblaApi?.off('select', selectHandler)
      }
   }, [emblaApi])

   return (
      <>
         <div className="overflow-hidden relative w-full h-full" ref={emblaRef}>
            <div className="flex">
               {images.map((src, i) => (
                  <div className="relative md:h-[600px] flex-[0_0_100%]" key={i}>
                     <Image src={src} fill className="object-cover" alt="" />
                  </div>
               ))}
            </div>
         </div>
         <Dots itemsLength={images.length} selectedIndex={selectedIndex} />
      </>
   )
}

type Props = {
   itemsLength: number
   selectedIndex: number
}
const Dots = ({ itemsLength, selectedIndex }: Props) => {
   const arr = new Array(itemsLength).fill(0)
   return (
      <div className="flex gap-1 justify-center -translate-y-8">
         {arr.map((_, index) => {
            const selected = index === selectedIndex
            return (
               <div
                  className={cn({
                     'h-2 w-2 rounded-full transition-all duration-300 bg-gray-500':
                        true,
                     'h-2 w-2 opacity-40': !selected,
                  })}
                  key={index}
               />
            )
         })}
      </div>
   )
}