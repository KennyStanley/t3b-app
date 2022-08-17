// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
    "xstate.stop": { type: "xstate.stop" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: "attachClickHandler" | "toggle";
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    addMesh: "";
    assignEngineToContext: "CANVAS_MOUNTED";
    attachClickHandler: "";
    configureScene: "CANVAS_MOUNTED";
    createScene: "CANVAS_MOUNTED";
    runRenderLoop: "" | "xstate.stop";
    setCameraArcRotate: "CANVAS_MOUNTED";
    toggle: "TOGGLE";
    turnMeshOff: "";
    turnMeshOn: "";
    updateData: "UPDATE_DATA";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    isOn: "";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "creatingScene"
    | "initializing"
    | "mountingCanvas"
    | "ready"
    | "ready.off"
    | "ready.on"
    | "ready.syncingScene"
    | { ready?: "off" | "on" | "syncingScene" };
  tags: never;
}
