import React, { useLayoutEffect, useState } from "react";
import styles from "./loader.module.scss";
export { styles };

export const Loader = ({ className = "" }) => {
  return <div className={[styles.loader, className].join(" ").trim()} />;
};

export const Loader2 = ({ className = "" }) => {
  return (
    <div className={[styles.loader2Wrapper, className].join(" ").trim()}>
      <div className={styles.loader2}>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export const ContainerLoader = ({
  allowInteraction,
  containerRef = { current: null },
  text,
  ...props
}) => {
  // dont give 0, container is not required arg and undefined will let set height auto
  const [height, setHeight] = useState();
  const [width, setWidth] = useState();

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [containerRef.current]);

  const observer = React.useMemo(
    () =>
      new window.ResizeObserver(function (entries) {
        if (entries[0]) {
          setHeight(entries[0].target?.scrollHeight);
          setWidth(entries[0].target?.scrollWidth);
        }
      }),
    []
  );

  return (
    <div
      style={{ height, width }}
      className={`${styles.loaderContainerWrapper} ${
        allowInteraction ? styles.allowInteraction : ""
      }`}
    >
      <Loader2 {...props} />
      {text && <span>{text}</span>}
    </div>
  );
};
