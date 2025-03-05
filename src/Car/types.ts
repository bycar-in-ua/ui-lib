import type { Component } from "vue";

export type InfoBullet = {
  text: string;
  title?: string;
  icon: Component;
};

export type InfoBulletProps = {
  title: string;
  value: string;
  icon: string | Component;
};

export type InfoBlock = {
  title: string;
  defaultOpen?: boolean;
  items: Array<{
    title: string;
    value: string | number;
  }>;
};
