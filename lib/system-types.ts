/**
 * 系统注册接口 — 引用自 docs/AI-Dev/ARCHITECTURE.md
 */

import type { ComponentType } from "react";

export interface MenuItem {
  key: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  path: string;
}

export interface SystemRoute {
  path: string;
  component: ComponentType;
}

export interface SystemRegistration {
  id: string;
  name: string;
  icon?: ComponentType<{ className?: string }>;
  color?: string;
  routes: SystemRoute[];
  menuItems: MenuItem[];
  init?: () => void | Promise<void>;
}

export interface SystemContext {
  systemId: string;
  navigate: (path: string) => void;
  storage: {
    get: <T>(key: string) => T | undefined;
    set: <T>(key: string, value: T) => void;
  };
}

export type SystemPlugin = {
  register: () => SystemRegistration;
};
