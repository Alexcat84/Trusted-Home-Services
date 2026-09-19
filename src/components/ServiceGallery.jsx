import { useEffect, useRef, useState } from 'react';

/**
 * The photographs beside a service, one fading into the next.
 *
 * Two things it has to get right beyond the fade. Content that changes on its
 * own has to be stoppable, so it holds while the pointer is over it or a dot
 * has focus, and the dots are real buttons for anyone not using a pointer.
 * And a visitor who has asked their system for less motion gets the first
 * photograph and no movement at all.
 */
export default function ServiceGallery({ images, ratio, interval = 1500, label }) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [stillness, setStillness] = useState(false);
  const countRef = useRef(images.length);
  countRef.current = images.length;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setStillness(query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (held || stillness || images.length < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % countRef.current), interval);
    return () => clearInterval(id);
  }, [held, stillness, interval, images.length]);

  if (images.length === 0) return null;

  return (
    <div
      className="service-gallery"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
    >
      <div className="service-gallery-frame" style={{ aspectRatio: ratio }}>
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === index ? label : ''}
            className={`service-gallery-img ${i === index ? 'is-current' : ''}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            aria-hidden={i !== index}
          />
        ))}
      </div>
      {images.length > 1 && (
        <div className="service-gallery-dots">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`service-gallery-dot ${i === index ? 'is-current' : ''}`}
              aria-label={`${label} ${i + 1}`}
              aria-current={i === index}
              onFocus={() => setHeld(true)}
              onBlur={() => setHeld(false)}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
