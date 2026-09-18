import type { Service } from '@/types/content'

export const services: Service[] = [
  {
    id: 'data-processing',
    title: 'Data Processing',
    shortDescription: 'Transform raw, unstructured data into clean, reliable datasets at scale.',
    description:
      'We ingest, clean, normalise and structure data from any source — enabling your systems and teams to work with information they can trust.',
  },
  {
    id: 'data-management',
    title: 'Data Management',
    shortDescription: 'Govern, store and access your data assets with precision and control.',
    description:
      'From data cataloguing to lifecycle management, we establish the architecture and governance your organisation needs to manage data as a strategic asset.',
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics',
    shortDescription: 'Convert complex information into clear, actionable business intelligence.',
    description:
      'We build analytics pipelines and reporting solutions that surface the patterns and insights your decision-makers need — when they need them.',
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    shortDescription: 'Deploy intelligent automation that learns from your operational data.',
    description:
      'We design and implement AI-powered workflows that reduce manual overhead, accelerate processing and surface intelligent recommendations across your operations.',
  },
  {
    id: 'data-annotation',
    title: 'Data Annotation & AI Training',
    shortDescription: 'High-quality labelled datasets built for model training and evaluation.',
    description:
      'Our expert annotation teams deliver precisely labelled text, image, audio and multimodal datasets — with rigorous QA processes that ensure your models learn from signal, not noise.',
  },
  {
    id: 'business-support',
    title: 'Business Support',
    shortDescription: 'Operational data services that keep your business running efficiently.',
    description:
      'From back-office data operations to specialised business process support, we provide the human expertise and technology infrastructure that keeps your organisation moving.',
  },
]
