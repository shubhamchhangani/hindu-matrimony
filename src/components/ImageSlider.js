import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';

export default function ImageSlider({ images, altText }) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={10}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      // Enable dragging for desktop and touch on mobile automatically.
      style={{ width: '100%', height: '100%' }}
    >
      {images.map((imgUrl, index) => (
        <SwiperSlide key={index}>
          <div className="relative w-full h-96">
            <Image
              src={imgUrl}
              alt={`${altText} ${index + 1}`}
              fill
              className="object-cover rounded"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
