"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 1,
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.",
    author: "Brooklyn Simmons",
    image: "https://storage.googleapis.com/a1aa/image/jdud7PeGRRgPI0MmTRpscggyHFsZKLviR_NEWLLAMJs.jpg",
  },
  {
    id: 2,
    text: "This platform has been amazing for learning and development. Highly recommend to anyone looking for quality content!",
    author: "Emily Johnson",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    text: "Fantastic experience! The courses are well-structured and easy to follow. I learned a lot in a short time.",
    author: "James Anderson",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
  },
];

const TestimonialCarousel = () => {
  return (
    <section className="py-16 bg-gray-100 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        What viewers are saying
      </h2>
      <p className="text-gray-600 mb-8">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      </p>

      <div className="max-w-4xl mx-auto">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="testimonial-slider"
        >
          {testimonials.map(({ id, text, author, image }) => (
            <SwiperSlide key={id}>
              <div className="p-6 bg-white shadow-lg rounded-xl">
                <span className="text-4xl text-blue-500">❝</span>
                <p className="text-gray-700 text-lg italic mb-4">{text}</p>
                <div className="flex items-center justify-center space-x-3">
                  <div className="relative w-12 h-12">
                  <Image
                    src={image}
                    alt={author}
                    width={50}  // Explicit width
                    height={50} // Explicit height
                    className="rounded-full object-cover"
                  />

                  </div>
                  <p className="text-gray-800 font-semibold">{author}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
