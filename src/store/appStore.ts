import { create } from 'zustand';

export type AppView = 'landing' | 'login' | 'register' | 'onboarding' | 'app';
export type AppTab = 'members' | 'projects' | 'chats' | 'events' | 'profile';

export interface User {
  id: string;
  displayName: string;
  role: 'member' | 'admin' | 'expert' | 'creator';
  bio: string;
  avatarUrl: string;
  isVerified: boolean;
  donorBadge: boolean;
  reputationScore: number;
  status: 'online' | 'offline' | 'busy' | 'away';
  location: { city: string };
  skills: string[];
  projects: string[];
  photos: string[];
  profileComplete: boolean;
}

export interface Profile {
  id: string;
  displayName: string;
  role: string;
  city: string;
  bio: string;
  photos: string[];
  skills: string[];
  currentProjects: string[];
  status: string;
  isVerified: boolean;
  donorBadge: boolean;
  reputationScore: number;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'video';
  sentAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  user: Profile;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: Message[];
  isOnline: boolean;
  isTyping: boolean;
}

export interface Event {
  id: string;
  organizer: Profile;
  title: string;
  description: string;
  startTime: string;
  attendeeCount: number;
  thumbnail: string;
  category: 'webinar' | 'workshop' | 'meetup' | 'qa';
}

interface AppStore {
  view: AppView;
  activeTab: AppTab;
  currentUser: User | null;
  members: Profile[];
  projects: any[]; // To be defined later
  events: Event[];
  conversations: Conversation[];
  repAnimation: boolean;

  setView: (view: AppView) => void;
  setActiveTab: (tab: AppTab) => void;
  setCurrentUser: (user: User | null) => void;
  followMember: (memberId: string) => void;
  joinProject: (projectId: string) => void;
  addReputation: (amount: number) => void;
}

const mockPhotos = [
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
];

const mockSkillSets = [
  ['React', 'TypeScript', 'Node.js', 'AWS'],
  ['UI/UX', 'Figma', 'Product Design'],
  ['Marketing', 'SEO', 'Content Strategy'],
  ['Python', 'Data Science', 'Machine Learning'],
  ['Sales', 'Business Development', 'CRM'],
];

export const mockProfiles: Profile[] = [
  { id: '1', displayName: 'Sofia', role: 'Fullstack Dev', city: 'Warsaw', bio: 'Passionate about building scalable web apps and mentoring juniors. Let\'s collaborate! �', photos: [mockPhotos[0], mockPhotos[1]], skills: mockSkillSets[0], currentProjects: ['Project X', 'HRL Community'], status: 'online', isVerified: true, donorBadge: false, reputationScore: 1250 },
  { id: '2', displayName: 'Mia', role: 'UI/UX Designer', city: 'Kraków', bio: 'Creating beautiful and functional user experiences. Always open for design critiques 🎨', photos: [mockPhotos[1], mockPhotos[2]], skills: mockSkillSets[1], currentProjects: ['Design System', 'Mobile App'], status: 'away', isVerified: true, donorBadge: true, reputationScore: 2100 },
  { id: '3', displayName: 'Elena', role: 'Content Strategist', city: 'Gdańsk', bio: 'Helping brands tell their stories through data-driven content. Coffee enthusiast ☕', photos: [mockPhotos[2], mockPhotos[3]], skills: mockSkillSets[2], currentProjects: ['Marketing 2024'], status: 'offline', isVerified: false, donorBadge: false, reputationScore: 850 },
  { id: '4', displayName: 'Zara', role: 'Backend Engineer', city: 'Wrocław', bio: 'I love optimizing databases and writing clean, maintainable code. Let\'s talk architecture �️', photos: [mockPhotos[4], mockPhotos[0]], skills: mockSkillSets[3], currentProjects: ['API Gateway'], status: 'online', isVerified: true, donorBadge: false, reputationScore: 1540 },
  { id: '5', displayName: 'Alex', role: 'Product Manager', city: 'Poznań', bio: 'Bridging the gap between business and technology. Into agile and lean �', photos: [mockPhotos[5], mockPhotos[6]], skills: mockSkillSets[4], currentProjects: ['Product Launch'], status: 'online', isVerified: true, donorBadge: true, reputationScore: 1890 },
];

const mockConversations: Conversation[] = [
  {
    id: 'c1',
    user: mockProfiles[0],
    lastMessage: 'Hey! I saw you like React too ⚛️',
    lastMessageAt: '2 min ago',
    unreadCount: 2,
    isOnline: true,
    isTyping: true,
    messages: [
      { id: 'msg1', senderId: '1', content: 'Hey! I saw you like React too ⚛️', type: 'text', sentAt: '14:32', isRead: false },
      { id: 'msg2', senderId: 'me', content: 'Yes! I work mostly with Next.js. You?', type: 'text', sentAt: '14:33', isRead: true },
      { id: 'msg3', senderId: '1', content: 'Same here! We should do a collab project sometime 🔥', type: 'text', sentAt: '14:34', isRead: false },
    ]
  },
  {
    id: 'c2',
    user: mockProfiles[1],
    lastMessage: 'That design system looks amazing!',
    lastMessageAt: '1 hr ago',
    unreadCount: 0,
    isOnline: false,
    isTyping: false,
    messages: [
      { id: 'msg4', senderId: 'me', content: 'I\'m working on the new HRL Design System', type: 'text', sentAt: '13:10', isRead: true },
      { id: 'msg5', senderId: '2', content: 'That design system looks amazing!', type: 'text', sentAt: '13:45', isRead: true },
    ]
  },
];

export const useAppStore = create<AppStore>((set) => ({
  view: 'landing',
  activeTab: 'members',
  currentUser: null,
  members: [],
  projects: [],
  events: [],
  conversations: [],
  repAnimation: false,

  setView: (view) => set({ view }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setCurrentUser: (currentUser) => set({ currentUser }),
  followMember: (memberId) => console.log('Followed member:', memberId),
  joinProject: (projectId) => console.log('Joined project:', projectId),
  addReputation: (amount) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, reputationScore: state.currentUser.reputationScore + amount } : null,
    repAnimation: true
  })),
}));
