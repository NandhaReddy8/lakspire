export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export interface Service {
  id: string
  title: string
  description: string
  shortDescription: string
}

export interface Stat {
  value: string
  label: string
  suffix?: string
}

export interface Industry {
  name: string
  icon: string
}

export interface ProcessStep {
  number: string
  title: string
  description: string
}

export interface WhyItem {
  title: string
  description: string
}
