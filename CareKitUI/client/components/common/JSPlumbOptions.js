export const ENDPOINT_COMMON = {
  connector: ['Flowchart', {cornerRadius: 10}],
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