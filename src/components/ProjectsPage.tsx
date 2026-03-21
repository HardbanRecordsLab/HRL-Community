import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder, Plus, Search, Filter, Users, Calendar,
  ChevronRight, ArrowLeft, Star, ExternalLink, MessageSquare
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import AdBanner from '@/components/AdBanner';

interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Open Source' | 'Startup' | 'Creative' | 'Research';
  status: 'Planning' | 'In Progress' | 'MVP' | 'Scaling';
  members: number;
  maxMembers?: number;
  tags: string[];
  owner: {
    name: string;
    avatar: string;
  };
  reputationRequired: number;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'HRL Design System',
    description: 'Building a unified UI kit for all HardbanRecords Lab applications. Looking for React developers and UI designers.',
    category: 'Open Source',
    status: 'In Progress',
    members: 5,
    maxMembers: 10,
    tags: ['React', 'Tailwind', 'Figma'],
    owner: { name: 'Sofia', avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&q=80' },
    reputationRequired: 500,
  },
  {
    id: 'p2',
    title: 'AI Music Engine',
    description: 'Creating a generative music tool for content creators. Need Python engineers with ML background.',
    category: 'Startup',
    status: 'Planning',
    members: 2,
    maxMembers: 5,
    tags: ['Python', 'PyTorch', 'Audio'],
    owner: { name: 'Alex', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
    reputationRequired: 1000,
  },
  {
    id: 'p3',
    title: 'Community Podcast',
    description: 'Weekly podcast featuring creators from the HRL community. Looking for hosts and editors.',
    category: 'Creative',
    status: 'MVP',
    members: 3,
    tags: ['Audio', 'Marketing', 'Editing'],
    owner: { name: 'Mia', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80' },
    reputationRequired: 200,
  },
  {
    id: 'p4',
    title: 'Web3 Auth Layer',
    description: 'Researching and implementing a secure Web3 authentication layer for decentralized apps.',
    category: 'Research',
    status: 'Scaling',
    members: 8,
    maxMembers: 15,
    tags: ['Solidity', 'Web3', 'Security'],
    owner: { name: 'Zara', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&q=80' },
    reputationRequired: 1500,
  }
];

export default function ProjectsPage() {
  const { currentUser } = useAppStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | Project['category']>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = MOCK_PROJECTS.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                         p.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || p.category === filter;
    return matchesSearch && matchesFilter;
  });

  if (selectedProject) {
    return (
      <div className="h-full flex flex-col overflow-y-auto scrollbar-hidden">
        <div className="px-5 pt-4 pb-2">
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Board
          </button>
        </div>

        <div className="px-5 py-4 space-y-6">
          <div className="glass rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full gradient-fire text-primary-foreground">
                {selectedProject.status}
              </span>
            </div>
            <h2 className="text-3xl font-black mb-2">{selectedProject.title}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{selectedProject.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedProject.tags.map(tag => (
                <span key={tag} className="glass px-3 py-1 rounded-full text-xs border border-primary/20">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between p-4 glass rounded-2xl">
              <div className="flex items-center gap-3">
                <img src={selectedProject.owner.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-xs text-muted-foreground">Project Lead</p>
                  <p className="text-sm font-bold">{selectedProject.owner.name}</p>
                </div>
              </div>
              <button className="p-2 glass rounded-full hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-4 flex flex-col items-center gap-1">
              <Users className="w-5 h-5 text-primary" />
              <p className="text-lg font-bold">{selectedProject.members}{selectedProject.maxMembers ? ` / ${selectedProject.maxMembers}` : ''}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Members</p>
            </div>
            <div className="glass rounded-2xl p-4 flex flex-col items-center gap-1">
              <Star className="w-5 h-5 text-accent" />
              <p className="text-lg font-bold">{selectedProject.reputationRequired}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Rep Required</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full py-4 rounded-2xl gradient-fire text-primary-foreground font-bold shadow-lg shadow-primary/20">
              Apply to Join Project
            </button>
            <button className="w-full py-4 rounded-2xl glass border border-border font-bold flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" /> View Documentation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-black">Project Board</h1>
          <button className="w-10 h-10 gradient-fire rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Plus className="w-6 h-6 text-primary-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 glass rounded-2xl px-4 py-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Search projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hidden">
            {['All', 'Open Source', 'Startup', 'Creative', 'Research'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat as any)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === cat ? 'gradient-fire text-primary-foreground' : 'glass text-muted-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-3 mb-2">
        <AdBanner placement="projects" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-4 scrollbar-hidden">
        {filteredProjects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedProject(project)}
            className="glass rounded-3xl p-5 border border-white/5 hover:border-primary/30 transition-all group active:scale-[0.98]"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
              </div>
              <div className="flex -space-x-2">
                <img src={project.owner.avatar} alt="" className="w-7 h-7 rounded-full border-2 border-background object-cover" />
                <div className="w-7 h-7 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[8px] font-bold">
                  +{project.members}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
              {project.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-bold">{project.reputationRequired}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-bold">{project.members}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="py-20 text-center opacity-50">
            <Folder className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="font-bold">No projects found</p>
            <p className="text-sm">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}
