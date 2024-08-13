import type {
  RefineThemedLayoutV2SiderProps as BaseRefineThemedLayoutV2SiderProps,
  RefineThemedLayoutV2HeaderProps,
  RefineThemedLayoutV2Props,
  RefineLayoutThemedTitleProps as BaseRefineLayoutThemedTitleProps,
} from "@refinedev/ui-types";

type RefineLayoutThemedTitleProps = BaseRefineLayoutThemedTitleProps & {
  link?: string;
  onTitleClick?: () => void;
};

type RefineThemedLayoutV2SiderProps = BaseRefineThemedLayoutV2SiderProps & {
  fixed?: boolean;
};

export type {
  RefineLayoutThemedTitleProps,
  RefineThemedLayoutV2SiderProps,
  RefineThemedLayoutV2HeaderProps,
  RefineThemedLayoutV2Props,
};
