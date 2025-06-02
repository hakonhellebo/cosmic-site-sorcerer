
import { ReactElement } from "react";
import Statistics from "./pages/Statistics";

export interface NavItem {
  to: string;
  page: ReactElement;
}

export const navItems: NavItem[] = [
  {
    to: "/",
    page: <Statistics />
  },
  {
    to: "/statistikk",
    page: <Statistics />
  }
];
