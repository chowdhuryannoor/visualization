export enum chart {
    barchart = "barchart",
    histogram = "histogram",
    scatterplot = "scatterplot",
    none = "none",
}

export interface attribute {
    type: chart;
    x: string;
    y?: string;
}
