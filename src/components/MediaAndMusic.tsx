import React, { useState } from 'react';
import { Language } from '../types/cycle';
import { translations } from '../i18n/translations';
import { EDUCATIONAL_VIDEOS, SPOTIFY_PLAYLISTS } from '../utils/cycleCalculations';
import { Music, Video, ExternalLink, Play, Disc3, ShieldAlert } from 'lucide-react';

interface MediaAndMusicProps {
  language: Language;
}

export const MediaAndMusic: React.FC<MediaAndMusicProps> = ({ language }) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'spotify' | 'youtube'>('spotify');
  const [selectedPlaylist, setSelectedPlaylist] = useState(SPOTIFY_PLAYLISTS[0]);
  const [selectedVideo, setSelectedVideo] = useState(EDUCATIONAL_VIDEOS[0]);

  return (
    <section id="media" className="py-20 bg-white border-b border-[#FCE7EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#E25574]">
            {language === 'hi' ? 'कल्याण संगीत एवं वीडियो' : 'Somatic Harmony'}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D1222] tracking-tight">
            {t.media.title}
          </h2>
          <p className="text-base text-[#5A384D]">
            {t.media.subtitle}
          </p>

          {/* Tab Selector */}
          <div className="pt-4 flex justify-center">
            <div className="bg-[#FFF8F9] p-1.5 rounded-full border border-[#F8D7DF] shadow-xs flex items-center gap-2">
              <button
                onClick={() => setActiveTab('spotify')}
                className={`px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'spotify'
                    ? 'bg-[#1DB954] text-white shadow-xs'
                    : 'text-[#5A384D] hover:text-[#2D1222]'
                }`}
              >
                <Music className="w-4 h-4" />
                <span>{t.media.tabMusic}</span>
              </button>

              <button
                onClick={() => setActiveTab('youtube')}
                className={`px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'youtube'
                    ? 'bg-[#FF0000] text-white shadow-xs'
                    : 'text-[#5A384D] hover:text-[#2D1222]'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>{t.media.tabVideos}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. SPOTIFY PLAYLISTS VIEW */}
        {activeTab === 'spotify' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            
            {/* Playlist Selector Buttons (Col 5) */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C657B]">
                Select Playlist:
              </span>

              {SPOTIFY_PLAYLISTS.map((pl) => {
                const isSelected = selectedPlaylist.id === pl.id;
                const title = (t.media as any)[pl.titleKey] || pl.genre;
                const desc = (t.media as any)[pl.descriptionKey] || '';

                return (
                  <button
                    key={pl.id}
                    onClick={() => setSelectedPlaylist(pl)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                      isSelected
                        ? 'bg-[#FFF8F9] border-[#E25574] ring-2 ring-[#E25574]/20 shadow-xs'
                        : 'bg-white border-[#F8D7DF] hover:bg-[#FFF8F9]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-[#2D1222] flex items-center gap-2">
                        <Disc3 className={`w-4 h-4 ${isSelected ? 'text-[#E25574] animate-spin' : 'text-[#8C657B]'}`} />
                        {title}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#1DB954]">
                        {pl.genre}
                      </span>
                    </div>
                    <p className="text-xs text-[#5A384D] leading-relaxed line-clamp-2">
                      {desc}
                    </p>
                  </button>
                );
              })}

              <div className="p-3 bg-[#FFF8F9] rounded-2xl border border-[#F8D7DF] text-[11px] text-[#8C657B]">
                {t.media.spotifyNotice}
              </div>
            </div>

            {/* Embedded Player & Fallback (Col 7) */}
            <div className="lg:col-span-7 bg-[#FFF8F9] p-5 sm:p-6 rounded-3xl border border-[#F8D7DF] space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#FCE7EC] pb-3">
                <span className="text-xs font-bold text-[#2D1222] flex items-center gap-1.5">
                  <Music className="w-4 h-4 text-[#1DB954]" />
                  <span>{(t.media as any)[selectedPlaylist.titleKey] || selectedPlaylist.genre}</span>
                </span>

                <a
                  href={selectedPlaylist.fallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#1DB954] hover:underline flex items-center gap-1"
                >
                  <span>{t.media.openSpotify}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Spotify Embed iFrame */}
              <div className="rounded-2xl overflow-hidden shadow-inner bg-black min-h-[352px]">
                <iframe
                  title="Spotify Player"
                  src={selectedPlaylist.embedUrl}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="w-full rounded-2xl"
                />
              </div>

              <div className="text-right">
                <a
                  href={selectedPlaylist.fallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#8C657B] hover:text-[#2D1222] inline-flex items-center gap-1"
                >
                  <span>Can&apos;t play inside the app? Open directly in Spotify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        )}

        {/* 2. YOUTUBE EDUCATIONAL GUIDES VIEW */}
        {activeTab === 'youtube' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            
            {/* Video Selector Buttons (Col 5) */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C657B]">
                Select Video Guide:
              </span>

              {EDUCATIONAL_VIDEOS.map((vid) => {
                const isSelected = selectedVideo.id === vid.id;
                const title = (t.media as any)[vid.titleKey] || vid.topic;

                return (
                  <button
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                      isSelected
                        ? 'bg-[#FFF8F9] border-[#E25574] ring-2 ring-[#E25574]/20 shadow-xs'
                        : 'bg-white border-[#F8D7DF] hover:bg-[#FFF8F9]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-[#2D1222] flex items-center gap-2">
                        <Play className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FF0000]' : 'text-[#8C657B]'}`} />
                        {title}
                      </span>
                      <span className="text-[10px] font-semibold text-[#8C657B]">
                        {vid.duration}
                      </span>
                    </div>
                    <div className="text-xs text-[#5A384D]">
                      {vid.channel} · <span className="text-[#8C657B]">{vid.topic}</span>
                    </div>
                  </button>
                );
              })}

              <div className="p-3 bg-[#FFF8F9] rounded-2xl border border-[#F8D7DF] text-[11px] text-[#8C657B]">
                {t.media.youtubeNotice}
              </div>
            </div>

            {/* Embedded Player & Fallback (Col 7) */}
            <div className="lg:col-span-7 bg-[#FFF8F9] p-5 sm:p-6 rounded-3xl border border-[#F8D7DF] space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#FCE7EC] pb-3">
                <span className="text-xs font-bold text-[#2D1222] flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#FF0000]" />
                  <span>{(t.media as any)[selectedVideo.titleKey] || selectedVideo.topic}</span>
                </span>

                <a
                  href={selectedVideo.fallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#FF0000] hover:underline flex items-center gap-1"
                >
                  <span>{t.media.watchOnYoutube}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* YouTube Responsive Embed */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
                <iframe
                  title={selectedVideo.topic}
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?rel=0`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-2xl"
                />
              </div>

              <div className="text-right">
                <a
                  href={selectedVideo.fallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#8C657B] hover:text-[#2D1222] inline-flex items-center gap-1"
                >
                  <span>Video not loading? Watch directly on YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
