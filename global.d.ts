declare module "*.css";

declare module "aos" {
  const AOS: {
    init: (options?: {
      duration?: number;
      once?: boolean;
      [key: string]: unknown;
    }) => void;
    refresh?: () => void;
  };
  export default AOS;
}

