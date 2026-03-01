import React from "react";
import { Composition } from "remotion";
import { ZymDemo } from "./src/ZymDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ZymDemo"
        component={ZymDemo}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
