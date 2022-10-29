const DEFAULT_CONTEXT = {
  pitchSize: {
    width: 5,
    height: 2,
  },
  lastPitch: {
    color: '',
    position: {
      x: 0,
      y: 0,
    },
  },
  pitchLines: {
    offset: {
      x: 70,
      y: 50,
    },
    baseDistance: 300,
    highestOnTop: true,
  },
}

const context = { value: DEFAULT_CONTEXT }

export const setContext = newContext => {
  context.value = newContext
}

export const getContext = () => context.value
