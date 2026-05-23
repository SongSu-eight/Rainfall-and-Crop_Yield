// ============================================================
// DSC 106 Final Project story controller
// Current version: story skeleton with placeholders.
// Next step: replace placeholder panels with D3 visualizations.
// ============================================================

const scenarioLabels = {
  ssp126: "Low emissions",
  ssp245: "Medium emissions",
  ssp585: "High emissions",
};

const metricLabels = {
  tas_change_from_2020_c: "Average temperature change from 2020",
  hot_days_35c_change_from_2020: "Additional 35°C+ days compared with 2020",
  hot_days_35c: "Total 35°C+ days",
};

const stepSettings = [
  {
    year: 2020,
    scenario: "ssp245",
    metric: "tas_change_from_2020_c",
    title: "Start with average temperature",
    subtitle:
      "The map starts at 2020 as a baseline. Future values will be compared with this starting point.",
    placeholder: "[ US choropleth placeholder: 2020 baseline average temperature change ]",
    note: "Baseline view: no change yet, because 2020 is the comparison year.",
  },
  {
    year: 2070,
    scenario: "ssp245",
    metric: "tas_change_from_2020_c",
    title: "Average temperature change by 2070",
    subtitle:
      "By 2070, average warming becomes visible across many states under medium emissions.",
    placeholder: "[ US choropleth placeholder: 2070 average warming under medium emissions ]",
    note: "Big-picture view: average warming is broad, but still abstract.",
  },
  {
    year: 2070,
    scenario: "ssp585",
    metric: "tas_change_from_2020_c",
    title: "Higher emissions, stronger average warming",
    subtitle:
      "The same year can look different under different emissions futures.",
    placeholder: "[ US choropleth placeholder: 2070 average warming under high emissions ]",
    note: "Scenario view: higher emissions make the average-warming pattern stronger.",
  },
  {
    year: 2070,
    scenario: "ssp585",
    metric: "tas_change_from_2020_c",
    title: "But averages hide daily experience",
    subtitle:
      "People do not experience climate as an annual average. They experience individual days of heat.",
    placeholder: "[ Transition placeholder: average map pauses before switching metric ]",
    note: "Story turn: the map is about to switch from average warming to daily heat thresholds.",
  },
  {
    year: 2070,
    scenario: "ssp245",
    metric: "hot_days_35c_change_from_2020",
    title: "Count extreme hot days instead",
    subtitle:
      "This map counts how many more days exceed 35°C compared with 2020.",
    placeholder: "[ US choropleth placeholder: additional 35°C+ days under medium emissions ]",
    note: "Metric switch: daily hot-day counts make the risk easier to see and feel.",
  },
  {
    year: 2070,
    scenario: "ssp245",
    metric: "hot_days_35c_change_from_2020",
    title: "Extreme heat does not rise evenly",
    subtitle:
      "Some states gain many more extreme hot days than others, even when average warming looks broad.",
    placeholder: "[ US choropleth placeholder: top states highlighted for additional 35°C+ days ]",
    note: "Highlight view: the largest increases would be emphasized here.",
  },
  {
    year: 2070,
    scenario: "ssp585",
    metric: "hot_days_35c_change_from_2020",
    title: "High emissions sharpen the daily-risk story",
    subtitle:
      "Under higher emissions, the change can mean more days crossing an extreme heat threshold.",
    placeholder: "[ US choropleth placeholder: additional 35°C+ days under high emissions ]",
    note: "Daily-risk view: high emissions make the hot-day story stronger.",
  },
  {
    year: 2070,
    scenario: "ssp585",
    metric: "hot_days_35c_change_from_2020",
    title: "Explore the map yourself",
    subtitle:
      "Use the controls to compare year, scenario, and metric. Later, hover over states to see details.",
    placeholder: "[ Interactive US choropleth placeholder: user-controlled year, scenario, and metric ]",
    note: "Explore mode: controls are now visible.",
  },
];

let currentStep = 0;
let currentState = {
  year: 2070,
  scenario: "ssp245",
  metric: "tas_change_from_2020_c",
};

const title = d3.select("#chart-title");
const subtitle = d3.select("#chart-subtitle");
const stickyViz = d3.select(".sticky-viz");
const mapPlaceholder = d3.select("#main-map-placeholder span");
const mapPlaceholderSub = d3.select("#main-map-placeholder small");
const mapNote = d3.select("#map-note");
const legend = d3.select("#legend");
const stateCard = d3.select("#state-card");

const scenarioSelect = d3.select("#scenario-select");
const yearSlider = d3.select("#year-slider");
const yearLabel = d3.select("#year-label");
const metricSelect = d3.select("#metric-select");

setupControls();
setupScroll();
updateStep(0);

function setupControls() {
  scenarioSelect.on("change", (event) => {
    currentState.scenario = event.target.value;
    updateExploreView();
  });

  yearSlider.on("input", (event) => {
    currentState.year = +event.target.value;
    yearLabel.text(currentState.year);
    updateExploreView();
  });

  metricSelect.on("change", (event) => {
    currentState.metric = event.target.value;
    updateExploreView();
  });
}

function setupScroll() {
  const scroller = scrollama();

  scroller
    .setup({
      step: ".step",
      offset: 0.55,
      debug: false,
    })
    .onStepEnter((response) => {
      d3.selectAll(".step").classed("is-active", false);
      d3.select(response.element).classed("is-active", true);

      const step = +response.element.dataset.step;
      updateStep(step);
    });

  window.addEventListener("resize", scroller.resize);
}

function updateStep(step) {
  currentStep = step;
  const setting = stepSettings[step];
  if (!setting) return;

  currentState = {
    year: setting.year,
    scenario: setting.scenario,
    metric: setting.metric,
  };

  title.text(setting.title);
  subtitle.text(setting.subtitle);
  mapPlaceholder.text(setting.placeholder);
  mapPlaceholderSub.text(
    `${scenarioLabels[setting.scenario]} · ${setting.year} · ${metricLabels[setting.metric]}`
  );
  mapNote.text(setting.note);
  legend.text(`[ legend: ${metricLabels[setting.metric]} ]`);

  d3.select("body").classed("explore-mode", step === 7);

  syncControls();
  updateStateCard();
  pulseViz();
}

function syncControls() {
  scenarioSelect.property("value", currentState.scenario);
  yearSlider.property("value", currentState.year);
  yearLabel.text(currentState.year);
  metricSelect.property("value", currentState.metric);
}

function updateExploreView() {
  if (currentStep !== 7) return;

  title.text(`${metricLabels[currentState.metric]} in ${currentState.year}`);
  subtitle.text(
    `${scenarioLabels[currentState.scenario]} scenario. Later, this view will update the choropleth map directly.`
  );
  mapPlaceholder.text("[ Interactive US choropleth placeholder ]");
  mapPlaceholderSub.text(
    `${scenarioLabels[currentState.scenario]} · ${currentState.year} · ${metricLabels[currentState.metric]}`
  );
  mapNote.text("Explore mode: these controls are wired and ready for the real D3 map.");
  legend.text(`[ legend: ${metricLabels[currentState.metric]} ]`);
  updateStateCard();
}

function updateStateCard() {
  const scenario = scenarioLabels[currentState.scenario];
  const metric = metricLabels[currentState.metric];

  stateCard.html(`
    <h3>State detail</h3>
    <p><strong>${scenario}</strong>, ${currentState.year}</p>
    <p>Current metric: <strong>${metric}</strong></p>
    <p>Later, hovering or clicking a state will show average warming, additional 35°C+ days, and a daily-life sentence.</p>
  `);
}

function pulseViz() {
  if (stickyViz.empty()) return;

  stickyViz.classed("step-pulse", false);
  void stickyViz.node().offsetWidth;
  stickyViz.classed("step-pulse", true);
}