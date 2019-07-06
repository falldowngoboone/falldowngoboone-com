export function fluidSizeBetween(minSize, maxSize, minV, maxV) {
  return `calc(${minSize}px + (${maxSize} - ${minSize}) * ((100vw - ${minV}px) / (${maxV} - ${minV})))`;
}
