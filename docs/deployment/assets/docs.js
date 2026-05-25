/* Eureka deployment docs — diagram enhancer.
 *
 * Loaded as a CLASSIC script (not an ES module) on purpose: Chrome blocks
 * `<script type="module">` from file:// origins (CORS, origin "null"), which
 * made the mermaid diagrams show up as raw text when the docs are opened as
 * local files. A classic script + the UMD mermaid build renders reliably from
 * file:// and over http.
 *
 * For each `.diagram` panel it:
 *   1. captures the raw mermaid source (before mermaid replaces it with SVG),
 *   2. renders the diagram (default view),
 *   3. adds a Diagram/Source toggle and a Copy-source button.
 */
(function () {
  if (typeof mermaid === "undefined") {
    console.error("mermaid failed to load");
    return;
  }

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: "base",
    fontFamily: "'IBM Plex Mono', monospace",
    themeVariables: {
      darkMode: true,
      background: "#0e131c",
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: "14px",
      primaryColor: "#18212f",
      primaryBorderColor: "#c9f24e",
      primaryTextColor: "#e9eef5",
      secondaryColor: "#121927",
      secondaryBorderColor: "#5fd5ee",
      secondaryTextColor: "#e9eef5",
      tertiaryColor: "#0e131c",
      tertiaryBorderColor: "#7e8da0",
      tertiaryTextColor: "#b9c4d2",
      lineColor: "#5fd5ee",
      textColor: "#b9c4d2",
      mainBkg: "#18212f",
      nodeBorder: "#c9f24e",
      clusterBkg: "rgba(95,213,238,0.05)",
      clusterBorder: "rgba(150,180,220,0.25)",
      titleColor: "#e9eef5",
      edgeLabelBackground: "#0a0e14",
      actorBkg: "#18212f",
      actorBorder: "#b69cff",
      actorTextColor: "#e9eef5",
      actorLineColor: "#7e8da0",
      signalColor: "#5fd5ee",
      signalTextColor: "#b9c4d2",
      labelBoxBkgColor: "#121927",
      labelBoxBorderColor: "#5fd5ee",
      labelTextColor: "#e9eef5",
      loopTextColor: "#b9c4d2",
      noteBkgColor: "rgba(255,180,84,0.12)",
      noteBorderColor: "#ffb454",
      noteTextColor: "#e9eef5",
      activationBkgColor: "#18212f",
      activationBorderColor: "#c9f24e",
      nodeTextColor: "#e9eef5",
    },
    flowchart: { curve: "basis", htmlLabels: true, padding: 14 },
    sequence: { actorMargin: 46, messageAlign: "center", mirrorActors: false, useMaxWidth: true },
  });

  function enhance(panel) {
    var pre = panel.querySelector("pre.mermaid");
    if (!pre) return;

    var source = pre.textContent.replace(/^\s*\n/, "").replace(/\s+$/, "");

    // Views: rendered graph (holds the mermaid <pre>) and a raw-source view.
    var graph = document.createElement("div");
    graph.className = "dgm-graph";
    graph.appendChild(pre);

    var srcView = document.createElement("pre");
    srcView.className = "dgm-source";
    srcView.hidden = true;
    var code = document.createElement("code");
    code.textContent = source;
    srcView.appendChild(code);

    var body = document.createElement("div");
    body.className = "dgm-body";
    body.appendChild(graph);
    body.appendChild(srcView);

    // Toolbar: segmented toggle + copy.
    var bar = document.createElement("div");
    bar.className = "dgm-bar";
    bar.innerHTML =
      '<div class="dgm-seg" role="tablist">' +
      '<button class="dgm-tab is-active" data-view="graph" aria-selected="true">Diagram</button>' +
      '<button class="dgm-tab" data-view="source" aria-selected="false">Source</button>' +
      "</div>" +
      '<button class="dgm-copy" type="button" aria-label="Copy Mermaid source">Copy</button>';

    var cap = panel.querySelector(".cap");
    if (cap) cap.appendChild(bar);
    else panel.insertBefore(bar, panel.firstChild);
    panel.appendChild(body);

    var tabs = bar.querySelectorAll(".dgm-tab");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var view = tab.getAttribute("data-view");
        tabs.forEach(function (t) {
          var active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", active ? "true" : "false");
        });
        graph.hidden = view !== "graph";
        srcView.hidden = view !== "source";
      });
    });

    var copy = bar.querySelector(".dgm-copy");
    copy.addEventListener("click", function () {
      var done = function () {
        copy.textContent = "Copied";
        copy.classList.add("ok");
        setTimeout(function () {
          copy.textContent = "Copy";
          copy.classList.remove("ok");
        }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(source).then(done, fallback);
      } else {
        fallback();
      }
      function fallback() {
        var range = document.createRange();
        range.selectNodeContents(code);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        try { document.execCommand("copy"); } catch (e) { /* ignore */ }
        sel.removeAllRanges();
        done();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".diagram").forEach(enhance);
    // Render every mermaid block (now nested inside .dgm-graph). Pass an
    // explicit querySelector — some mermaid builds throw if run() is given an
    // options object without `nodes`/`querySelector` instead of defaulting.
    mermaid.run({ querySelector: ".dgm-graph pre.mermaid" }).catch(function (err) {
      console.error("mermaid render error:", err);
    });
  });
})();
