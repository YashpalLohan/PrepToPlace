import { Track } from '../types';
import { AIML_SECTIONS } from './aimlCurriculum';
import { DEVOPS_SECTIONS } from './devopsCurriculum';
import { SYSTEM_DESIGN_SECTIONS } from './systemDesignCurriculum';

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-ai-ml',
    slug: 'ai-ml',
    name: 'AI / ML Track',
    description: 'Machine Learning foundations, Deep Learning, LLMs, NLP, evaluation metrics, and end-to-end ML engineering.',
    estimatedHours: 90,
    iconName: 'Cpu',
    badgeColor: 'violet',
    sections: AIML_SECTIONS
  },
  {
    id: 'track-system-design',
    slug: 'system-design',
    name: 'System Design Track',
    description: 'High-Level Design (HLD), Low-Level Design (LLD), scalability, caching, load balancers, microservices, and distributed systems.',
    estimatedHours: 70,
    iconName: 'Layers',
    badgeColor: 'amber',
    sections: SYSTEM_DESIGN_SECTIONS
  },
  {
    id: 'track-devops',
    slug: 'devops',
    name: 'DevOps Track',
    description: 'CI/CD pipelines, Docker containers, Kubernetes, cloud platforms, infrastructure as code, and observability.',
    estimatedHours: 60,
    iconName: 'Terminal',
    badgeColor: 'rose',
    sections: DEVOPS_SECTIONS
  },
  {
    id: 'track-dsa',
    slug: 'dsa',
    name: 'DSA Track',
    description: 'Data Structures and Algorithms, problem patterns, time complexity analysis, and coding interview practice.',
    estimatedHours: 120,
    iconName: 'Binary',
    badgeColor: 'sky',
    sections: [],
    isExternal: true,
    externalUrl: 'https://prep-to-place.vercel.app/problems'
  },
  {
    id: 'track-development',
    slug: 'development',
    name: 'Development Track',
    description: 'Frontend, Backend, Full-stack web architectures, REST APIs, databases, authentication, and practical development projects.',
    estimatedHours: 100,
    iconName: 'CodeXml',
    badgeColor: 'emerald',
    sections: [],
    isExternal: true,
    externalUrl: 'https://prep-to-place.vercel.app/roadmap/dev-track'
  },
  {
    id: 'track-core-subjects',
    slug: 'core-subjects',
    name: 'Core Subjects Track',
    description: 'Computer Networks (CN), Operating Systems (OS), Database Management Systems (DBMS), and Object-Oriented Programming (OOPs).',
    estimatedHours: 50,
    iconName: 'BookMarked',
    badgeColor: 'indigo',
    sections: [],
    isExternal: true,
    externalUrl: 'https://prep-to-place.vercel.app/roadmap/core-subjects'
  }
];
