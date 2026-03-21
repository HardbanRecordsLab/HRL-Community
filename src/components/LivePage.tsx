import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, MapPin, Clock, ArrowLeft, Send, ExternalLink, Plus, Info } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import type { Event } from '@/store/appStore';
import AdBanner from '@/components/AdBanner';

const categoryColors: Record<string, string> = {
  'webinar': 'bg-blue-500/20 text-blue-400',
  'workshop': 'bg-primary/20 text-primary',
  'meetup': 'bg-accent/20 text-accent',
  'qa': 'bg-purple-500/20 text-purple-400',
};

function EventCard({ event, onClick }: { event: Event; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -5 }}
      className="w-full text-left glass-strong rounded-3xl overflow-hidden border border-white/5 group hover:border-primary/30 transition-all duration-300"
    >
      <div className="relative aspect-video">
        <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
        
        <div className="absolute top-3 left-3">
          <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-md ${categoryColors[event.category]}`}>
            {event.category}
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Calendar className="w-3 h-3" />
            <span>{event.startTime}</span>
          </div>
          <h3 className="text-lg font-black text-white leading-tight group-hover:text-primary transition-colors">{event.title}</h3>
        </div>
      </div>
      
      <div className="p-4 flex items-center justify-between bg-white/5 border-t border-white/5">
        <div className="flex items-center gap-2">
          <img src={event.organizer.photos[0]} className="w-6 h-6 rounded-full object-cover border border-white/10" alt="" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{event.organizer.displayName}</span>
        </div>
        <div className="flex items-center gap-1.5 text-primary">
          <Users className="w-3 h-3" />
          <span className="text-[10px] font-bold">{event.attendeeCount} Joined</span>
        </div>
      </div>
    </motion.button>
  );
}

export default function EventsPage() {
  const { events: storeEvents } = useAppStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Mock events if store is empty
  const events: Event[] = storeEvents.length > 0 ? storeEvents : [
    {
      id: 'e1',
      title: 'HRL Community Launch Webinar',
      description: 'Join us for the official launch of the HRL Community Portal. We will walk through all the new features and how to make the most of our collaboration tools.',
      category: 'webinar',
      startTime: 'Today, 18:00',
      attendeeCount: 156,
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      organizer: { displayName: 'Admin', photos: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80'] } as any
    },
    {
      id: 'e2',
      title: 'Advanced AI Mastering Workshop',
      description: 'Deep dive into the latest AI mastering tools and techniques used in professional studios.',
      category: 'workshop',
      startTime: 'Tomorrow, 14:00',
      attendeeCount: 89,
      thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
      organizer: { displayName: 'Expert', photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80'] } as any
    },
    {
      id: 'e3',
      title: 'Monthly Creator Meetup',
      description: 'Network with other creators in the HRL ecosystem and share your latest projects.',
      category: 'meetup',
      startTime: 'Fri, 20:00',
      attendeeCount: 42,
      thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
      organizer: { displayName: 'Creator', photos: ['https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'] } as any
    }
  ];

  const categories = ['All', 'Webinar', 'Workshop', 'Meetup', 'QA'];
  const filteredEvents = activeCategory === 'All'
    ? events
    : events.filter(e => e.category === activeCategory.toLowerCase());

  if (selectedEvent) {
    return (
      <div className="h-full flex flex-col bg-background animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="relative h-64">
          <img src={selectedEvent.thumbnail} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
          <button 
            onClick={() => setSelectedEvent(null)}
            className="absolute top-6 left-6 w-10 h-10 glass rounded-2xl flex items-center justify-center text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-6 -mt-10 relative z-10 space-y-6 overflow-y-auto pb-24">
          <div className="space-y-2">
            <div className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-md ${categoryColors[selectedEvent.category]}`}>
              {selectedEvent.category}
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">{selectedEvent.title}</h1>
            <div className="flex items-center gap-4 text-white/40 text-xs font-bold uppercase tracking-wider pt-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>{selectedEvent.startTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>{selectedEvent.attendeeCount} Joined</span>
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-6 border border-white/5 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/20">Event Description</h2>
            <p className="text-white/70 text-sm leading-relaxed">{selectedEvent.description}</p>
          </div>

          <div className="flex items-center gap-4 p-4 glass rounded-3xl border border-white/5">
            <img src={selectedEvent.organizer.photos[0]} className="w-12 h-12 rounded-2xl object-cover border border-white/10" alt="" />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Organizer</p>
              <p className="text-sm font-bold text-white">{selectedEvent.organizer.displayName}</p>
            </div>
            <button className="text-xs font-bold text-primary hover:underline">View Profile</button>
          </div>

          <button className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            JOIN EVENT NOW
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-4 py-6 glass-strong border-b border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter">Community Events</h1>
            <p className="text-white/40 text-xs">Learn and grow with HRL experts</p>
          </div>
          <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-primary border border-primary/20 hover:bg-primary/10 transition-colors">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hidden">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground border-transparent shadow-lg shadow-primary/20'
                  : 'glass border-white/5 text-white/40 hover:text-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar space-y-6">
        <AdBanner placement="live" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20">
          {filteredEvents.map((event, i) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onClick={() => setSelectedEvent(event)} 
            />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-10">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-white/10" />
            </div>
            <h3 className="text-lg font-bold text-white/60">No events found</h3>
            <p className="text-sm text-white/30 mt-1">Try switching categories or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
