import type {
  RefineThemedLayoutV2SiderProps as BaseRefineThemedLayoutV2SiderProps,
  RefineThemedLayoutV2HeaderProps,
  RefineThemedLayoutV2Props as BaseRefineThemedLayoutV2Props,
  RefineLayoutThemedTitleProps as BaseRefineLayoutThemedTitleProps,
} from "@refinedev/ui-types";

type RefineLayoutThemedTitleProps = BaseRefineLayoutThemedTitleProps & {
  link?: string;
  onTitleClick?: () => void;
};

type RefineThemedLayoutV2Props = BaseRefineThemedLayoutV2Props & {
  siderCollapsed?: boolean;
  setSiderCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
};

type RefineThemedLayoutV2SiderProps = BaseRefineThemedLayoutV2SiderProps & {
  fixed?: boolean;
  siderCollapsed?: boolean;
  setSiderCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
};

export type {
  RefineLayoutThemedTitleProps,
  RefineThemedLayoutV2SiderProps,
  RefineThemedLayoutV2HeaderProps,
  RefineThemedLayoutV2Props,
};
