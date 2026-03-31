import { useEffect, useRef, useState } from 'react';
import projectCarouselLogo from '../../assets/images/project-carousel-logo.png';
import './ProjectsCarousel.css';

function ProjectsCarousel({ projects }) {
  const carouselRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState(3);
  const [activeIndex, setActiveIndex] = useState(0);
  const maxSlideIndex = Math.max(0, projects.length - visibleCards);

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth <= 700) {
        setVisibleCards(1);
        return;
      }

      if (window.innerWidth <= 1100) {
        setVisibleCards(2);
        return;
      }

      setVisibleCards(3);
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, maxSlideIndex));
  }, [maxSlideIndex]);

  const getSlideStep = () => {
    if (!carouselRef.current) {
      return 0;
    }

    const firstCard = carouselRef.current.querySelector('.project-card');

    if (!firstCard) {
      return 0;
    }

    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(carouselRef.current).gap) || 0;
    return cardWidth + gap;
  };

  const scrollToSlide = (index) => {
    if (!carouselRef.current) {
      return;
    }

    const step = getSlideStep();
    carouselRef.current.scrollTo({
      left: step * index,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  const handleCarouselScroll = () => {
    if (!carouselRef.current) {
      return;
    }

    const step = getSlideStep();
    if (!step) {
      return;
    }

    const nextIndex = Math.round(carouselRef.current.scrollLeft / step);
    setActiveIndex(Math.min(maxSlideIndex, Math.max(0, nextIndex)));
  };

  return (
    <>
      <div className="projects-carousel">
        <button
          type="button"
          className="carousel-btn carousel-btn-left"
          onClick={() => scrollToSlide(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          aria-label="View previous projects"
        >
          &#8249;
        </button>
        <div className="carousel-viewport" ref={carouselRef} onScroll={handleCarouselScroll}>
          <div className="project-cards-row">
            {projects.map((project) => (
              <article key={project.id} className="project-card">
                <div className="project-head">
                  <div className="project-logo-placeholder">
                    <img
                      src={projectCarouselLogo}
                      alt={`${project.title} logo`}
                      className="project-logo-image"
                    />
                  </div>
                  <div>
                    <h3>{project.title}</h3>
                    <p className="project-meta">{project.meta}</p>
                  </div>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-footer">
                  <span>{project.duration}</span>
                  <span>{project.volunteers}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="carousel-btn carousel-btn-right"
          onClick={() => scrollToSlide(Math.min(maxSlideIndex, activeIndex + 1))}
          disabled={activeIndex >= maxSlideIndex}
          aria-label="View more projects"
        >
          &#8250;
        </button>
      </div>

      <div className="slider-dots" aria-label="Project carousel indicators">
        {Array.from({ length: maxSlideIndex + 1 }, (_, index) => (
          <button
            key={`dot-${index}`}
            type="button"
            className={`carousel-dot ${index === activeIndex ? 'carousel-dot-active' : ''}`}
            onClick={() => scrollToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
}

export default ProjectsCarousel;
