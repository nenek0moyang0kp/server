import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/product.service";
import BlurText from "../components/Layouts/BlurText";
import NavbarPage from "./navbar";
import SplitTexts from "../components/Layouts/SplitText";
import Particles from "../components/Layouts/Particles";
import ContactForm from "../components/contactForm";
import arrowRight from "../../public/icons/arrow-right.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const MainPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchProducts()
      .then((response) => {
        setProducts(response.slice(0, 6));
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500 text-center p-8">Error: {error.message}</p>
      </div>
    );

  return (
    <>
      <NavbarPage />
      <div className="relative w-full min-h-screen bg-black flex flex-col items-center overflow-hidden scroll-smooth">
        <div className="absolute inset-0 w-full h-full">
          <Particles
            particleColors={["#ffffff", "#ffffff"]}
            particleCount={isMobile ? 300 : 1000}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={!isMobile}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto mt-20 md:mt-32 px-4">
          <div className="flex flex-col items-center mt-32">
            <div className="flex">
              <BlurText text="Young" delay={200} animateBy="words" direction="top" className="text-6xl md:text-7xl lg:text-8xl text-[#BFBFBF] font-henny leading-tight text-center" />
              <BlurText text="Bloom" delay={200} animateBy="words" direction="top" className="text-6xl md:text-7xl lg:text-8xl text-[#BFBFBF] font-henny leading-tight text-center md:mx-4" />
            </div>
            <BlurText text="Studio" delay={200} animateBy="words" direction="bottom" className="text-6xl md:text-7xl lg:text-8xl text-[#BFBFBF] font-henny leading-tight text-center" />
          </div>
        </div>

        <div className="flex items-center mt-12 md:mt-20 px-4 md:px-16 z-10">
          <SplitTexts
            text="Young Bloom Studio carries a deep and inspiring meaning. The word Young symbolizes energy, creativity, and a fresh, youthful spirit. Meanwhile, the word Bloom represents the process of growth, development, and reaching one's full potential. Thus, the name Young Bloom Studio can be interpreted as a place where young creativity and innovation flourish and thrive."
            className="text-sm md:text-base text-white font-spartan text-center max-w-2xl leading-relaxed"
            delay={7}
            animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
            animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
            easing="easeOutCubic"
            threshold={0.1}
            rootMargin="-50px"
          />
        </div>

        {/* Gallery Swiper */}
        <div className="flex flex-col items-center px-4 md:px-8">
        <SplitTexts
           text="Gallery"
           className="text-3xl md:text-4xl text-[#F1F5F9] text-opacity-80 font-fustat font-extrabold text-center mt-24 mb-16" // <-- ubah mb-nya di sini
           delay={7}
           animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
           animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
           easing="easeOutCubic"
           threshold={0.1}
           rootMargin="-50px"
          />
          <div className="max-w-6xl mx-auto">
                <Swiper
                  spaceBetween={4}
                  slidesPerView={1}
                  breakpoints={{
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                  }}
                >
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="flex justify-center items-center h-full">
                    <div className="overflow-hidden w-full max-w-xs rounded-xl shadow-lg">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="object-cover w-full h-72 md:h-96 transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Collaborate */}
        <div className="flex flex-col items-center mt-20 px-4 group w-full max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-2 cursor-pointer transform transition-all duration-300 hover:gap-4">
            <h1 className="text-primary font-potta text-xl md:text-2xl animate-gradient-x">
              Lets Collaborate
            </h1>
            <img src={arrowRight} alt="Arrow right" className="w-6 h-6 md:w-8 md:h-8 transition-transform duration-300 group-hover:translate-x-2" />
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Sosmed */}
        <div className="relative flex flex-col items-center justify-center gap-4 md:gap-6 mb-16 md:mb-36 w-full">
          {[
            ["Instagram", "https://www.instagram.com/youngbloomstudio"],
            ["YouTube", "https://youtube.com/@youngbloomstudio"],
            ["TikTok", "https://www.tiktok.com/@youngbloomstudio"],
          ].map(([platform, url]) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 font-spartan text-base md:text-lg hover:text-primary transition-colors duration-200 text-white px-4 py-2 md:py-3"
            >
              {platform}
            </a>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col items-center mb-16 md:mb-24 w-full px-4">
          <h1 className="text-white font-raleway text-2xl md:text-3xl font-bold mb-6 md:mb-8">
            Contact Us
          </h1>
          <div className="w-full max-w-md md:max-w-2xl">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
