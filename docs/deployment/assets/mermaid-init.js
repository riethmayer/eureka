// Mermaid 11 (ESM) initialised with a custom theme that matches the
// "deployment console / blueprint" palette used across these docs.
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

mermaid.initialize({
  startOnLoad: true,
  securityLevel: 'loose',
  theme: 'base',
  fontFamily: "'IBM Plex Mono', monospace",
  themeVariables: {
    darkMode: true,
    background: '#0e131c',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '14px',

    primaryColor: '#18212f',
    primaryBorderColor: '#c9f24e',
    primaryTextColor: '#e9eef5',
    secondaryColor: '#121927',
    secondaryBorderColor: '#5fd5ee',
    secondaryTextColor: '#e9eef5',
    tertiaryColor: '#0e131c',
    tertiaryBorderColor: '#7e8da0',
    tertiaryTextColor: '#b9c4d2',

    lineColor: '#5fd5ee',
    textColor: '#b9c4d2',
    mainBkg: '#18212f',
    nodeBorder: '#c9f24e',
    clusterBkg: 'rgba(95,213,238,0.05)',
    clusterBorder: 'rgba(150,180,220,0.25)',
    titleColor: '#e9eef5',
    edgeLabelBackground: '#0a0e14',

    // sequence diagrams
    actorBkg: '#18212f',
    actorBorder: '#b69cff',
    actorTextColor: '#e9eef5',
    actorLineColor: '#7e8da0',
    signalColor: '#5fd5ee',
    signalTextColor: '#b9c4d2',
    labelBoxBkgColor: '#121927',
    labelBoxBorderColor: '#5fd5ee',
    labelTextColor: '#e9eef5',
    loopTextColor: '#b9c4d2',
    noteBkgColor: 'rgba(255,180,84,0.12)',
    noteBorderColor: '#ffb454',
    noteTextColor: '#e9eef5',
    activationBkgColor: '#18212f',
    activationBorderColor: '#c9f24e',

    // state / flowchart accents
    nodeTextColor: '#e9eef5',
  },
  flowchart: { curve: 'basis', htmlLabels: true, padding: 14 },
  sequence: { actorMargin: 46, messageAlign: 'center', mirrorActors: false, useMaxWidth: true },
});
