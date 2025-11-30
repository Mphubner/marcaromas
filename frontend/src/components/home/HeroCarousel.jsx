import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper/modules';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

const banners = [
    {
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1920&h=600&fit=crop',
        title: 'Velas Artesanais Premium',
        subtitle: 'Transforme sua rotina em ritual',
        cta: 'Conheça o Club',
        link: '/clube',
        overlay: 'from-black/70 via-black/50 to-transparent'
    },
    {
        image: 'https://images.unsplash.com/photo-1602874801006-2bc2972f9c90?w=1920&h=600&fit=crop',
        title: 'Marc Store',
        subtitle: 'Velas e aromas exclusivos para sua casa',
        cta: 'Ver Produtos',
        link: '/loja',
        overlay: 'from-[#8B7355]/80 via-[#8B7355]/60 to-transparent'
    },
    {
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1920&h=600&fit=crop',
        title: 'Presenteie Quem Você Ama',
        subtitle: 'Caixas de velas personalizadas',
        cta: 'Presentear',
        link: '/presentear',
        overlay: 'from-purple-900/70 via-purple-800/50 to-transparent'
    },
];

export function HeroCarousel() {
    return (
        <div className="hero-carousel relative">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade, Navigation]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation
                loop={true}
                className="w-full h-[500px] md:h-[600px]"
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full h-full bg-black">
                            {/* Background Image */}
                            <img
                                src={banner.image}
                                alt={banner.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Overlay Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${banner.overlay}`}></div>

                            {/* Content */}
                            <div className="absolute inset-0 flex items-center">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                                    <div className="max-w-2xl">
                                        <h1 className="font-playfair text-4xl md:text-7xl font-bold text-white mb-4 leading-tight">
                                            {banner.title}
                                        </h1>
                                        <p className="text-white/90 text-lg md:text-2xl mb-8 font-light">
                                            {banner.subtitle}
                                        </p>
                                        <Link to={banner.link}>
                                            <Button
                                                size="lg"
                                                className="bg-[#8B7355] hover:bg-[#7A6548] text-white px-8 py-6 text-lg font-semibold shadow-2xl hover:scale-110 transition-all duration-300"
                                            >
                                                {banner.cta}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Pagination Styling */}
            <style>{`
        :global(.swiper-pagination-bullet) {
          background: white;
          opacity: 0.5;
          width: 12px;
          height: 12px;
        }
        :global(.swiper-pagination-bullet-active) {
          opacity: 1;
          background: #8B7355;
        }
        :global(.swiper-button-next),
        :global(.swiper-button-prev) {
          color: white;
        }
      `}</style>
        </div>
    );
}
