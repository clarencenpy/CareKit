export const ENDPOINT_COMMON = {
  connector: ['Flowchart', {cornerRadius: 10}],
  connectionType: 'basic'
}

export const ENDPOINT_SOURCE = {
  ...ENDPOINT_COMMON,
  isSource: true,
  isTarget: false,
  anchor: 'Right',
  endpoint: 'Rectangle',
  deleteEndpointsOnDetach: false
}

export const ENDPOINT_TARGET = {
  ...ENDPOINT_COMMON,
  isSource: false,
  isTarget: true,
  anchor: 'Continuous',
  endpoint: 'Dot',
  deleteEndpointsOnDetach: true
}

export const CONNECTION_STYLE = {
  overlays: [
    ["PlainArrow", {width: 12, length: 12, location: 0.9}]
  ],
  paintStyle: {strokeWidth: 3},
  hoverPaintStyle: {stroke: 'blue', strokeWidth: 5}
}