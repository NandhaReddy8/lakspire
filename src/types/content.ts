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
