import React from "react";
import { Composition } from "remotion";
import { ZymDemo } from "./src/ZymDemo";
import { FoodAnalysis } from "./src/FoodAnalysis";
import { FormCheck } from "./src/FormCheck";

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
      <Composition
        id="FoodAnalysis"
        component={FoodAnalysis}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FormCheck"
        component={FormCheck}
        durationInFrames={560}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
