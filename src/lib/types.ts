export interface LinkItem {
  href: string;
  text: string;
  image?: React.ReactNode;
}

export interface NavbarProps {
  links: LinkItem[];
}
