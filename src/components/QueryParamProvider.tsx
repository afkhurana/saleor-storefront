import React, { memo, useMemo } from "react";
import { useRouter } from "next/router";
import { QueryParamProvider as ContextProvider } from "use-query-params";
import { ssrMode } from "@temp/constants";

interface QueryParamProviderProps {
  children?: React.ReactNode;
}

export const QueryParamProviderComponent = (props: QueryParamProviderProps) => {
  const { children, ...rest } = props;

  const router = useRouter();
  const match = router.asPath.match(/[^?]+/);
  const pathname = match ? match[0] : router.asPath;

  const location = useMemo(
    () =>
      ssrMode
        ? ({
            search: router.asPath.replace(/[^?]+/u, ""),
          } as Location)
        : window.location,
    [router.asPath]
  );

  const history = useMemo(
    () => ({
      push: ({ search }: Location) =>
        router.push(
          { pathname: router.pathname, query: router.query },
          { search, pathname },
          { shallow: true }
        ),
      replace: ({ search }: Location) =>
        router.replace(
          { pathname: router.pathname, query: router.query },
          { search, pathname },
          { shallow: true }
        ),
    }),
    [pathname, router]
  );

  return (
    <ContextProvider {...rest} history={history} location={location}>
      {children}
    </ContextProvider>
  );
};

export const QueryParamProvider = memo(QueryParamProviderComponent);
