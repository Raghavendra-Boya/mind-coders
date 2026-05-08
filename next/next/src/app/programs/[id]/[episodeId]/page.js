"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DownloadApp from "../../../../app/download/page";
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

  return candidates[0] || "https://placehold.co/600x400?text=No+Image&font=inter";
}

// Format duration in MM:SS format
const formatDuration = (seconds) => {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Helper function to extract YouTube video ID
const getYoutubeId = (url) => {
  if (!url) return null;
  const shortMatch = url.match(/youtu.be\/([^?&]+)/);
  if (shortMatch) return shortMatch[1];
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

export default function EpisodePage() {
  const { id: programId, episodeId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [relatedEpisodes, setRelatedEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);
  const params = useParams();
  const episodeNumber = parseInt(params.episodeId, 10) || 1;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch episodes for the program
        const response = await dispatch(fetchProgramEpisodes(programId));
        const episodesData = response.payload || [];
        setEpisodes(Array.isArray(episodesData) ? episodesData : []);

        // Find the current episode
        const episode = episodesData.find(ep =>
          String(ep.EpisodeID) === episodeId ||
          String(ep.SNo) === episodeId
        );

        if (!episode) {
          throw new Error('Episode not found');
        }

        setCurrentEpisode(episode);

        console.log('All Episodes:', episodesData); // Debug log

        // Get all episodes from the same program except the current one
        console.log('Current Episode:', episode);
        console.log('All Episodes:', episodesData);

        // Convert IDs to strings for consistent comparison
        const currentEpisodeId = String(episode.EpisodeID || episode.SNo);
        const currentProgramId = String(episode.ProgramID);

        console.log('Looking for episodes with Program ID:', currentProgramId);
        console.log('Current Episode ID to exclude:', currentEpisodeId);

        // First, ensure all episodes have the required fields
        const validEpisodes = episodesData.filter(ep => ep && (ep.EpisodeID || ep.SNo) && ep.ProgramID);

        // Find all episodes from the same program
        const episodesFromSameProgram = validEpisodes.filter(ep =>
          String(ep.ProgramID) === currentProgramId
        );

        console.log('Episodes from same program:', episodesFromSameProgram);

        // Exclude the current episode and sort by SNo
        const related = episodesFromSameProgram
          .filter(ep => {
            const episodeId = String(ep.EpisodeID || ep.SNo);
            return episodeId !== currentEpisodeId;
          })
          .sort((a, b) => (a.SNo || 0) - (b.SNo || 0));

        console.log('Related episodes after filtering:', related);

        console.log('Related Episodes:', related);
        console.log('Current Episode ID:', episode.EpisodeID);
        console.log('Program ID:', episode.ProgramID);
        console.log('Total Episodes:', episodesData.length);
        console.log('Related Episodes Count:', related.length);

        setRelatedEpisodes(related);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching episode:', err);
        setError(err.message || 'Failed to load episode');
        setLoading(false);
      }
    };

    if (programId && episodeId) {
      fetchData();
    }
  }, [programId, episodeId, dispatch]);

  const handleEpisodeClick = (episode) => {
    router.push(`/programs/${programId}/${episode.EpisodeID || episode.SNo}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FBFF] dark:bg-gray-900">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p>Loading episode...</p>
        </div>
      </div>
    );
  }

  if (error || !currentEpisode) {
    return (
      <div className="min-h-screen bg-[#F7FBFF] dark:bg-gray-900">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-red-500">{error || 'Episode not found'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get video source based on EpisodeLink
  const getVideoSource = (url) => {
    if (!url) return { type: 'unsupported' };

    // Check for YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = getYoutubeId(url);
      return {
        type: 'youtube',
        url: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&controls=1`
      };
    }

    // Check for Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = getVimeoId(url);
      return {
        type: 'vimeo',
        url: `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`
      };
    }

    // Check for direct video
    if (url.match(/\.(mp4|webm|ogg|mov|m3u8|mpd|ism|m3u8\?.*|mpd\?.*|ism\?.*|m3u8#.*|mpd#.*|ism#.*)$/i)) {
      return {
        type: 'direct',
        url: url
      };
    }

    return { type: 'unsupported' };
  };

  const videoSource = getVideoSource(currentEpisode.EpisodeLink || '');

  return (
    <div className="min-h-screen bg-[#F7FBFF] dark:bg-gray-900">
      <Navbar />

      <main className="w-full max-w-6xl mx-auto px-6 py-8 mt-20">
        <div className="w-full" style={{
          width: '1000px',
          height: '200px',
          backgroundColor: '#F7FBFF',
          opacity: 1
        }}>
          <div className="w-full max-w-6xl mx-auto px-6 py-8">
            {/* Back button */}
            <button
              onClick={() => router.back()}
              className="flex items-center mb-6"
              style={{
                fontFamily: 'Fustat, sans-serif',
                fontWeight: 800,
                fontStyle: 'normal',
                fontSize: '16px',
                lineHeight: '100%',
                letterSpacing: '0%',
                textTransform: 'capitalize',
                width: '37px',
                height: '16px',
                opacity: 1,
                color: '#4B5563', // text-gray-600
                transition: 'color 0.2s',
                padding: 0,
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#111827'} // hover:text-gray-900
              onMouseOut={(e) => e.currentTarget.style.color = '#4B5563'} // text-gray-600
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{
                  width: '20px',
                  height: '20px',
                  flexShrink: 0
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </button>

            {/* Video Info */}
            <div className="p-2">
              <h1
                className="text-gray-900 dark:text-white mb-2 mr-10"
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
                {currentEpisode.EpisodeName
                  ? `${currentEpisode.EpisodeName} - Episode ${episodeNumber < 10 ? `0${episodeNumber}` : episodeNumber}`
                  : `Episode ${episodeNumber < 10 ? `0${episodeNumber}` : episodeNumber}`
                }
              </h1>
            </div>
          </div>
        </div>

        {/* Video Player Section */}
        <section className="mb-8 bg-[#FFFFFF99]  rounded-xl overflow-hidden shadow-lg">
          <div className="relative w-full pt-[56.25%] bg-black">
            {videoSource.type === 'youtube' || videoSource.type === 'vimeo' ? (
              <iframe
                src={videoSource.url}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentEpisode.EpisodeName || 'Episode'}
              />
            ) : videoSource.type === 'direct' ? (
              <video
                className="absolute top-0 left-0 w-full h-full"
                controls
                autoPlay
                playsInline
                src={videoSource.url}
                title={currentEpisode.EpisodeName || 'Episode'}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">Video not available</p>
                <p className="text-sm text-gray-300 mt-1">The video format is not supported or the URL is invalid.</p>
              </div>
            )}
          </div>


        </section>



        {/* Related Episodes Section */}
        {relatedEpisodes.length > 0 ? (
          <div className="mt-12">
            <h2
              className="text-gray-900 mb-8"
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
              Related Episodes
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedEpisodes.map((episode, index) => (
                <div
                  key={episode.EpisodeID || `episode-${index}`}
                  className="group cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                  onClick={() => handleEpisodeClick(episode)}
                >
                  {/* Thumbnail Container */}
                  <div
                    className="relative bg-gray-100 rounded-xl overflow-hidden shadow-md group"
                    style={{
                      width: '386px',
                      height: '260px',
                      borderRadius: '20px',
                      opacity: 1,
                      transform: 'rotate(0deg)'
                    }}
                  >
                    {/* Episode Image */}
                    <div className="absolute inset-0">
                      <img
                        src={episode.EpisodeImageURL || "https://placehold.co/600x400?text=No+Image&font=inter"}
                        alt={episode.EpisodeName || `Episode ${episode.SNo || (index + 1)}`}
                        className="w-full h-full object-cover"
                        style={{
                          borderRadius: '20px'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/600x400?text=No+Image&font=inter";
                        }}
                      />
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Duration Badge */}
                    {episode.Duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                        {formatDuration(episode.Duration)}
                      </div>
                    )}
                  </div>

                  {/* Episode Title with Number */}
                  <div className="mt-2 px-1">
                    {/* Episode Title with Number */}
                    <div
                      className="mt-2"
                      style={{
                        width: '386px',
                        height: '48px',
                        opacity: 1
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: 'Fustat, sans-serif',
                          fontWeight: 800,
                          fontStyle: 'normal',
                          fontSize: '20px',
                          lineHeight: '120%',
                          letterSpacing: '0%',
                          color: '#1F2937', // text-gray-900 equivalent
                          margin: 0,
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale'
                        }}
                        className="line-clamp-2"
                      >
                        <span style={{ color: '#000000' }}>Episode -{index + 1}</span> {episode.EpisodeName || 'Untitled Episode'}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>


          </div>
        ) : (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">More Episodes</h2>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
              <svg className="w-12 h-12 mx-auto text-blue-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5.04 15.71a2.25 2.25 0 00-.33 2.5l1.2 2.4a2.25 2.25 0 002.5 1.2h10.8a2.25 2.25 0 002.5-1.2l1.2-2.4a2.25 2.25 0 00-.33-2.5l-4.05-4.301a2.25 2.25 0 01-.659-1.591V3.104M9.75 3.104c0-1.5 3-1.5 3 0m-3 0c0-1.5-3-1.5-3 0m0 0v5.714c0 .597.237 1.17.659 1.591l4.05 4.301a2.25 2.25 0 01.659 1.591V21" />
              </svg>
              <h3 className="text-lg font-medium text-blue-800 mb-1">No More Episodes</h3>
              <p className="text-blue-600">Check back later for new content!</p>
            </div>
          </div>
        )}
      </main>

      <DownloadApp />
      <Footer />
    </div>
  );
}
