import React, { useState } from 'react';
import { ForumPost, Language } from '../types/cycle';
import { INITIAL_FORUM_POSTS } from '../utils/cycleCalculations';
import { translations } from '../i18n/translations';
import communityImage from '../assets/images/community_buddy_care_1790625190609.jpg';
import {
  MessageSquare,
  Users,
  Heart,
  Send,
  PlusCircle,
  Copy,
  Check,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface CommunityAndBuddyProps {
  language: Language;
}

export const CommunityAndBuddy: React.FC<CommunityAndBuddyProps> = ({ language }) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'forum' | 'buddy'>('forum');
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);

  // New Post Form State
  const [showNewPost, setShowNewPost] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('catCramps');
  const [newContent, setNewContent] = useState('');

  // Reply State
  const [replyPostId, setReplyPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Buddy State
  const [myBuddyCode] = useState('SAKHI-9428-HER');
  const [copiedCode, setCopiedCode] = useState(false);
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  const [pairedBuddyName, setPairedBuddyName] = useState<string | null>(null);
  const [sharePhaseAlerts, setSharePhaseAlerts] = useState(true);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(myBuddyCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePairBuddy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerCodeInput.trim()) return;
    setPairedBuddyName(partnerCodeInput.toUpperCase());
    setPartnerCodeInput('');
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPostItem: ForumPost = {
      id: `post-${Date.now()}`,
      author: newAuthor.trim() || (language === 'hi' ? 'सखी सदस्य' : 'Sakhi Member'),
      categoryKey: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
      timestamp: 'Just now',
      likes: 1,
      replies: [],
    };

    setPosts([newPostItem, ...posts]);
    setNewTitle('');
    setNewContent('');
    setNewAuthor('');
    setShowNewPost(false);
  };

  const handleAddReply = (postId: string) => {
    if (!replyText.trim()) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            replies: [
              ...p.replies,
              {
                id: `rep-${Date.now()}`,
                author: language === 'hi' ? 'सहेली' : 'Sister Friend',
                text: replyText.trim(),
                timestamp: 'Just now',
              },
            ],
          };
        }
        return p;
      })
    );

    setReplyText('');
    setReplyPostId(null);
  };

  const getCategoryLabel = (key: string) => {
    return (t.community as any)[key] || key;
  };

  return (
    <section id="community" className="py-20 bg-[#FFF8F9] border-b border-[#FCE7EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#E25574]">
            {t.community.title}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D1222] tracking-tight">
            {t.community.subtitle}
          </h2>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-full border border-[#F8D7DF] shadow-xs flex items-center gap-2">
            <button
              onClick={() => setActiveTab('forum')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'forum'
                  ? 'bg-[#E25574] text-white shadow-xs'
                  : 'text-[#5A384D] hover:text-[#2D1222]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.community.tabForum}</span>
            </button>

            <button
              onClick={() => setActiveTab('buddy')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'buddy'
                  ? 'bg-[#E25574] text-white shadow-xs'
                  : 'text-[#5A384D] hover:text-[#2D1222]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{t.community.tabBuddy}</span>
            </button>
          </div>
        </div>

        {/* Forum Tab View */}
        {activeTab === 'forum' && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* New Topic Action Button */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8C657B]">
                {posts.length} {language === 'hi' ? 'सहानुभूतिपूर्ण चर्चाएं' : 'empathetic conversations'}
              </span>

              <button
                onClick={() => setShowNewPost(!showNewPost)}
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#E25574] to-[#F48B9E] rounded-full shadow-xs flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{showNewPost ? (language === 'hi' ? 'फॉर्म बंद करें' : 'Close Form') : t.community.newPost}</span>
              </button>
            </div>

            {/* New Post Form Drawer */}
            {showNewPost && (
              <form onSubmit={handleAddPost} className="bg-white p-6 rounded-3xl border border-[#F8D7DF] shadow-md space-y-4 animate-fadeIn">
                <h3 className="font-display font-bold text-sm text-[#2D1222]">
                  {t.community.newPost}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-[#5A384D] block mb-1">
                      {t.community.postAuthor}
                    </label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. Diya_Bloom"
                      className="w-full px-3 py-2 rounded-xl bg-[#FFF8F9] border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#5A384D] block mb-1">
                      {t.community.postCategory}
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFF8F9] border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
                    >
                      <option value="catCramps">{t.community.catCramps}</option>
                      <option value="catPcos">{t.community.catPcos}</option>
                      <option value="catFirstPeriod">{t.community.catFirstPeriod}</option>
                      <option value="catMindset">{t.community.catMindset}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#5A384D] block mb-1 text-xs">
                    {t.community.postTitle}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Brief headline..."
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8F9] border border-[#F8D7DF] text-xs text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#5A384D] block mb-1 text-xs">
                    {t.community.postContent}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Share your question, experience, or remedy..."
                    className="w-full p-3 rounded-xl bg-[#FFF8F9] border border-[#F8D7DF] text-xs text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#E25574] hover:bg-[#D13C60] rounded-full transition-all cursor-pointer"
                >
                  {t.community.publishPost}
                </button>
              </form>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl p-6 border border-[#F8D7DF] shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-[#2D1222]">{post.author}</span>
                      <span aria-hidden="true" className="text-[#8C657B]">·</span>
                      <span className="text-[#8C657B]">{post.timestamp}</span>
                    </div>

                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FCE7EC] text-[#9B1D48] border border-[#F8D7DF]">
                      {getCategoryLabel(post.categoryKey)}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-[#2D1222]">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5A384D] leading-relaxed">
                    {post.content}
                  </p>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#FCE7EC] text-xs text-[#8C657B]">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center gap-1.5 hover:text-[#E25574] transition-colors cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-[#E25574]" />
                        <span className="tabular-nums font-semibold">{post.likes}</span>
                      </button>

                      <button
                        onClick={() => setReplyPostId(replyPostId === post.id ? null : post.id)}
                        className="flex items-center gap-1.5 hover:text-[#2D1222] transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 text-[#8C657B]" />
                        <span>
                          {post.replies.length} {t.community.repliesLabel}
                        </span>
                      </button>
                    </div>

                    <button
                      onClick={() => setReplyPostId(replyPostId === post.id ? null : post.id)}
                      className="text-xs font-semibold text-[#E25574] hover:underline cursor-pointer"
                    >
                      {t.community.replyBtn}
                    </button>
                  </div>

                  {/* Replies List */}
                  {post.replies.length > 0 && (
                    <div className="pl-4 border-l-2 border-[#FCE7EC] space-y-2 pt-2">
                      {post.replies.map((rep) => (
                        <div key={rep.id} className="bg-[#FFF8F9] p-3 rounded-2xl border border-[#F8D7DF] text-xs space-y-1">
                          <div className="flex items-center justify-between text-[#8C657B]">
                            <span className="font-bold text-[#2D1222]">{rep.author}</span>
                            <span>{rep.timestamp}</span>
                          </div>
                          <p className="text-[#5A384D] leading-relaxed">{rep.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline Reply Input */}
                  {replyPostId === post.id && (
                    <div className="flex items-center gap-2 pt-2 animate-fadeIn">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={t.community.replyPlaceholder}
                        className="flex-1 text-xs px-3.5 py-2 rounded-xl bg-[#FFF8F9] border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
                      />
                      <button
                        onClick={() => handleAddReply(post.id)}
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#E25574] hover:bg-[#D13C60] rounded-xl transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{t.community.sendReply}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Cycle Buddy Tab View */}
        {activeTab === 'buddy' && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Image banner */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-lg border border-[#F8D7DF]">
                <img
                  src={communityImage}
                  alt="Two supportive friends sharing warm tea and comforting conversation"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D1222]/85 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <span className="text-xs uppercase font-semibold text-[#FCE7EC]">
                      {language === 'hi' ? 'बहन व सहेली संबल' : 'Sisterhood & Empathy'}
                    </span>
                    <h4 className="text-base font-bold font-display">
                      {t.community.buddyTitle}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Code & Pairing Controls */}
            <div className="lg:col-span-7 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#F8D7DF] shadow-md">
              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold text-[#2D1222]">
                  {t.community.buddyTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#5A384D] leading-relaxed">
                  {t.community.buddyDesc}
                </p>
              </div>

              {/* My Buddy Code Box */}
              <div className="bg-[#FFF8F9] p-4 rounded-2xl border border-[#F8D7DF] space-y-2">
                <span className="text-xs font-semibold text-[#8C657B]">
                  {t.community.buddyCodeLabel}
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-[#2D1222] tracking-wider">
                    {myBuddyCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-xl bg-[#FCE7EC] hover:bg-[#F8D7DF] text-[#9B1D48] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? t.community.copied : t.community.copyCode}</span>
                  </button>
                </div>
              </div>

              {/* Enter Partner's Buddy Code Form */}
              <form onSubmit={handlePairBuddy} className="space-y-2">
                <label className="text-xs font-semibold text-[#5A384D] block">
                  {t.community.enterBuddyCode}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={partnerCodeInput}
                    onChange={(e) => setPartnerCodeInput(e.target.value)}
                    placeholder="e.g. SAKHI-8821-MUM"
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-[#FFF8F9] border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#E25574] to-[#F48B9E] rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                  >
                    {t.community.pairBuddyBtn}
                  </button>
                </div>
              </form>

              {/* Paired Status indicator */}
              {pairedBuddyName && (
                <div className="bg-[#ECFDF5] border border-[#A7F3D0] p-3 rounded-2xl flex items-center justify-between text-xs text-[#065F46] animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#10B981]" />
                    <span>
                      {t.community.pairedStatus} ({pairedBuddyName})
                    </span>
                  </div>
                  <button
                    onClick={() => setPairedBuddyName(null)}
                    className="text-[11px] underline text-[#047857]"
                  >
                    Unpair
                  </button>
                </div>
              )}

              {/* Share Alerts Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-[#FCE7EC]">
                <span className="text-xs font-semibold text-[#2D1222]">
                  {t.community.sharePhaseToggle}
                </span>
                <input
                  type="checkbox"
                  checked={sharePhaseAlerts}
                  onChange={(e) => setSharePhaseAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#E25574] rounded-sm focus:ring-[#E25574]"
                />
              </div>

              {/* Privacy Notice on Buddy */}
              <div className="bg-[#FFF8F9] p-3 rounded-xl border border-[#F8D7DF] text-[11px] text-[#8C657B] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {t.community.privacyBuddyNote}
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
