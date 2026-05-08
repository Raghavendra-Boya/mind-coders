"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DownloadApp from "../../download/page";
import { fetchPrograms } from "@/store/slices/programSlice";
import { fetchProgramEpisodes } from "@/store/slices/programEpisodeSlice";

function getEpisodeImage(episode, program) {
  const candidates = [
    episode?.ImageURL,
    episode?.EpisodeImageURL,
    episode?.EpisodeImage,
    program?.ImageURL,
    program?.ProgramImageURL,
    program?.ProgramImage,
  ].filter(Boolean);

  return (
    candidates[0] ||
    "https://placehold.co/600x400?text=No+Image&font=inter"
  );
}

// Format duration in MM:SS format
const formatDuration = (seconds) => {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function PublicProgramDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [hoveredEpisode, setHoveredEpisode] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Client-side only code can go here
  }, []);

  const programState = useSelector((state) => state.program || {});
  const programList = Array.isArray(programState.programs?.ProgramsData)
    ? programState.programs.ProgramsData
    : Array.isArray(programState.programs)
      ? programState.programs
      : [];

  const { episodes = [], loading, error } = useSelector(
    (state) => state.programEpisode || {}
  );

  const programId = Number(id);
  const program = programList.find((p) => {
    const pid = p.ProgramID ?? p.SNo;
    return pid && Number(pid) === programId;
  });

  useEffect(() => {
    if (!programList.length) {
      dispatch(fetchPrograms());
    }
    if (programId) {
      dispatch(fetchProgramEpisodes(programId));
    }
  }, [dispatch, programId, programList.length]);

  const title = program?.ProgramName || "Program";
  const totalEpisodes = Array.isArray(episodes) ? episodes.length : 0;

  const handleEpisodeClick = (episode, idx) => {
    // Navigate to the episode page
    const episodeId = episode.EpisodeID || episode.SNo;
    console.log('Navigating to episode:', { programId, episodeId }); // For debugging
    router.push(`/programs/${programId}/${episodeId}`);
  };
  const closePlayer = () => {
    // Pause any playing video when closing
    document.querySelectorAll('video, iframe').forEach(el => {
      if (el.pause) el.pause();
    });

    setIsPlaying(false);
    setPreviewPlaying(false);
    setSelectedEpisode(null);
  };

  const handleEpisodeHover = (episode, idx, isHovering) => {
    if (isHovering) {
      // Only show preview for non-active episodes
      const isActive = episode.IsActive === "Y" || episode.Status === "Active";
      if (!isActive || selectedEpisode?.EpisodeID !== episode.EpisodeID) {
        setHoveredEpisode({
          ...episode,
          index: idx,
          videoUrl: episode.EpisodeLink || '',
          isYoutube: episode.EpisodeLink?.includes('youtube.com') || episode.EpisodeLink?.includes('youtu.be'),
          isVimeo: episode.EpisodeLink?.includes('vimeo.com'),
          isDirectVideo: episode.EpisodeLink?.match(/\.(mp4|webm|ogg)$/i)
        });
        setPreviewPlaying(true);
      }
    } else if (hoveredEpisode?.EpisodeID === episode.EpisodeID) {
      setHoveredEpisode(null);
      setPreviewPlaying(false);
    }
  };

  // Helper function to extract YouTube video ID
  const getYoutubeId = (url) => {
    if (!url) return null;

    // Handle youtu.be links
    const shortMatch = url.match(/youtu.be\/([^?&]+)/);
    if (shortMatch) return shortMatch[1];

    // Handle youtube.com/watch?v=ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Helper function to extract Vimeo video ID
  const getVimeoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/|vimeo\.com\/\w+\/)(\d+)/);
    return match ? match[1] : null;
  };

  return (
    <>
      <div className="min-h-screen bg-[#F7FBFF] dark:bg-gray-900 transition-colors">
        <Navbar />

        <main className="max-w-6xl mx-auto px-6 py-4 mt-24">
          {/* Back link - Made more prominent */}
          <section className="bg-[#F7FBFF] rounded-xl p-6 mb-8">
            <div className="">
              <button
                onClick={() => router.back()}
                className="flex items-center text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Programs
              </button>
            </div>
            {/* Program Header */}


            <h1
              className="text-gray-900 dark:text-white mb-3 mt-4"
              style={{
                fontFamily: 'Fustat, sans-serif',
                fontWeight: 800,
                fontStyle: 'normal',
                fontSize: '34px',
                lineHeight: '130%',
                letterSpacing: '0px',
                textTransform: 'capitalize',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}
            >
              {title}
            </h1>
            <p
              className="text-gray-700 dark:text-gray-200 mb-4 max-w-3xl"
              style={{
                fontFamily: 'Fustat, sans-serif',
                fontWeight: 300,
                fontStyle: 'normal',
                fontSize: '18px',
                lineHeight: '150%',
                letterSpacing: '0%',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}
            >
              {program?.Description || 'No description available.'}
            </p>

          </section>

          {/* <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div> */}

          {/* Video Player Section */}

          {selectedEpisode && (
            <section id="video-player" className="mb-8 bg-black rounded-xl overflow-hidden shadow-xl">
              <div className="relative w-full pt-[56.25%] bg-black">
                {selectedEpisode.videoUrl ? (
                  <>
                    {selectedEpisode.isYoutube ? (
                      // YouTube embed
                      <iframe
                        src={`https://www.youtube.com/embed/${getYoutubeId(selectedEpisode.videoUrl)}?autoplay=1&rel=0&showinfo=0&controls=1&modestbranding=1`}
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={selectedEpisode.EpisodeName || `Episode ${selectedEpisode.index + 1}`}
                      />
                    ) : selectedEpisode.isVimeo ? (
                      // Vimeo embed
                      <iframe
                        src={`https://player.vimeo.com/video/${getVimeoId(selectedEpisode.videoUrl)}?autoplay=1&title=0&byline=0&portrait=0`}
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title={selectedEpisode.EpisodeName || `Episode ${selectedEpisode.index + 1}`}
                      />
                    ) : selectedEpisode.isDirectVideo ? (
                      // Direct video
                      <video
                        className="absolute top-0 left-0 w-full h-full"
                        controls
                        autoPlay
                        src={selectedEpisode.videoUrl}
                        title={selectedEpisode.EpisodeName || `Episode ${selectedEpisode.index + 1}`}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <p>Unsupported video format</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <p>No video URL provided</p>
                  </div>
                )}

                {/* Video Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {selectedEpisode.EpisodeName || `Episode ${selectedEpisode.index + 1}`}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {selectedEpisode.Description?.substring(0, 100)}{selectedEpisode.Description?.length > 100 ? '...' : ''}
                      </p>
                    </div>
                    <button
                      onClick={closePlayer}
                      className="text-white hover:text-gray-300 transition-colors p-2"
                      aria-label="Close player"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Episodes grid */}

        </main>
        <section className="bg-white w-full rounded-xl mb-8 ">
          <h2
            className="text-gray-900 dark:text-white mb-6 ml-[51.6px] p-[24px]"
            style={{
              fontFamily: 'Fustat, sans-serif',
              fontWeight: 800,
              fontStyle: 'normal',
              fontSize: '40px',
              lineHeight: '120%',
              letterSpacing: '0%',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale'
            }}
          >
            Episodes
          </h2>
          {loading && (
            <p className="text-gray-500 text-sm mb-4  ml-[51.6px] p-[24px]">Loading episodes...</p>
          )}
          {error && (
            <p className="text-red-500 text-sm mb-4  ml-[51.6px] p-[24px]">{String(error)}</p>
          )}

          {!loading && !episodes.length && !error && (
            <p className="text-gray-500 text-sm  ml-[51.6px] p-[24px]">No episodes found for this program.</p>
          )}

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ml-[51.6px] p-[24px]">
  {episodes.map((ep, idx) => {
    const episodeTitle = ep.EpisodeName || `Episode ${idx + 1}`;
    const episodeNumber = idx + 1;
    const isActive = ep.IsActive === "Y" || ep.Status === "Active";
    const isSelected = selectedEpisode?.EpisodeID === ep.EpisodeID;
    const isHovered = hoveredEpisode?.EpisodeID === ep.EpisodeID;
    const showPreview = isHovered && !isSelected && !isPlaying;
    const showThumbnail = !showPreview || !hoveredEpisode?.videoUrl;

    return (
      <div 
        key={ep.EpisodeID ?? idx}
        className="w-[386px]"
      >
        {/* Card with Image */}
        <div
          className="relative w-full h-[260px] rounded-[20px] overflow-hidden group transition-all duration-200 cursor-pointer"
          onClick={() => handleEpisodeClick(ep, idx)}
          onMouseEnter={() => handleEpisodeHover(ep, idx, true)}
          onMouseLeave={() => handleEpisodeHover(ep, idx, false)}
        >
          {/* Thumbnail Image */}
          <div className="w-full h-full">
            <img
              src={getEpisodeImage(ep, program)}
              alt={episodeTitle}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://placehold.co/600x400?text=No+Image&font=inter";
              }}
            />
          </div>
        </div>

      {/* Episode Info - Below the card */}
{/* Episode Info - Below the card */}
<div className="flex items-center justify-between mt-3 px-1">
  <h3 className="text-gray-900 dark:text-white font-medium text-base">
    {episodeTitle} - Episode {episodeNumber < 10 ? `0${episodeNumber}` : episodeNumber}
  </h3>
</div>
      </div>
    );
  })}
</div>
        </section>
      </div>

      <DownloadApp />
      <Footer />
    </>
  );
}