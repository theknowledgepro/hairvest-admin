import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import type { VideoType } from '@/types';
import { getCloudFileURL } from '@/lib/utils';

interface VideoPlayerProps {
	video: VideoType;
	className?: string;
	poster?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, className, poster }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const hlsRef = useRef<Hls | null>(null);

	const videoSrc = getCloudFileURL(video.masterPlaylist);
	const fallbackPoster = poster || (video.thumbnails?.preview ? getCloudFileURL(video.thumbnails.preview) : undefined);

	useEffect(() => {
		const videoElement = videoRef.current;
		if (!videoElement || !videoSrc) return;

		// Cleanup previous HLS instance
		if (hlsRef.current) {
			hlsRef.current.destroy();
			hlsRef.current = null;
		}

		if (Hls.isSupported()) {
			const hls = new Hls({
				maxBufferLength: 30,
				maxMaxBufferLength: 60,
			});
			hlsRef.current = hls;

			hls.loadSource(videoSrc);
			hls.attachMedia(videoElement);

			hls.on(Hls.Events.ERROR, (_, data) => {
				if (data.fatal) {
					switch (data.type) {
						case Hls.ErrorTypes.NETWORK_ERROR:
							console.error('Network error loading HLS video', data);
							hls.startLoad();
							break;
						case Hls.ErrorTypes.MEDIA_ERROR:
							console.error('Media error loading HLS video', data);
							hls.recoverMediaError();
							break;
						default:
							hls.destroy();
							break;
					}
				}
			});
		} else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
			// Native HLS support (Safari)
			videoElement.src = videoSrc;
		}

		return () => {
			if (hlsRef.current) {
				hlsRef.current.destroy();
				hlsRef.current = null;
			}
		};
	}, [videoSrc]);

	return (
		<div className={`relative bg-black rounded-lg overflow-hidden group ${className || ''}`}>
			<video ref={videoRef} className='w-full h-full object-contain' controls playsInline poster={fallbackPoster} preload='metadata' />
			{/* Custom Play Button Overlay (visible only before play if desired, but native controls work well enough) */}
		</div>
	);
};
