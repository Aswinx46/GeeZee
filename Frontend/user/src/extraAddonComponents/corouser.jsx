import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import React from 'react'

function corouser() {
    return (
        <Carousel>
            <CarouselContent className="-ml-2 md:-ml-4">
                <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>
                <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>
                <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>
            </CarouselContent>
        </Carousel>
    )
}

export default corouser
