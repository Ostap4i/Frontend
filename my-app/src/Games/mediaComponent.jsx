import React, { useEffect, useRef } from 'react';

const MediaComponent = ({ mediaType, mediaSrc, className }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const videoElement = videoRef.current;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    videoElement.play();
                } else {
                    videoElement.pause();
                }
            },
            {
                threshold: 0.25,
            }
        );

        if (videoElement) {
            observer.observe(videoElement);
        }

        return () => {
            if (videoElement) {
                observer.unobserve(videoElement);
            }
        };
    }, []);

    return (
        <div>
            {mediaType === 'video' ? (
                <video
                    ref={videoRef}
                    src={mediaSrc}
                    autoPlay
                    muted
                    loop
                    controls
                    className={className === "PostItem" ? "card-media" : "singleCard-media"}
                />
            ) : (
                <img src={mediaSrc} alt="Media" className={className === "PostItem" ? "card-media" : "singleCard-media"} />
            )}
        </div>
    );
};

export default MediaComponent;
