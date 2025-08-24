'use client';
import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PerformanceTriangle from '@/components/PerformanceTriangle';
import StudyRadarChart from '@/components/StudyRadarChart';
import TaskPriorityChart from '@/components/TaskPriorityChart';

type CarouselProps = {
  performanceData: any; // This line was missing
  studyData: any[];
  taskData: any[];
};

export default function AnalyticsCarousel({ performanceData, studyData, taskData }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="card-container h-96 flex flex-col">
       <h2 className="text-xl font-semibold text-white mb-2 px-2">Analytics Hub</h2>
      <div className="embla flex-grow" ref={emblaRef}>
        <div className="embla__container h-full">
          {/* Slide 1: Performance Triangle */}
          <div className="embla__slide">
             <div className="h-full p-4">
              <PerformanceTriangle data={performanceData} />
            </div>
          </div>
          {/* Slide 2: Study Balance */}
          <div className="embla__slide">
            <div className="h-full p-4">
              <StudyRadarChart logs={studyData} />
            </div>
          </div>
          {/* Slide 3: Task Priority */}
          <div className="embla__slide">
            <div className="h-full p-4">
              <TaskPriorityChart tasks={taskData} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 mt-2">
        <button onClick={scrollPrev} className="btn-ghost p-2 rounded-full">
          <ChevronLeft />
        </button>
        <button onClick={scrollNext} className="btn-ghost p-2 rounded-full">
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
