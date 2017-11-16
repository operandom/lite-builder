/**
 *
 * @param {TemplateStringsArray} parts
 * @param {any[]} args
 * @return {HTMLElement[]}
 */
export function html(parts, ...args) {
  // @TODO use template
  const element = document.createElement('div');

  element.innerHTML = args.reduce((previous, value, index) => {
    return previous + parts.raw[index] + value;
  }, '') + parts.raw[parts.raw.length - 1];

  return Array.prototype.slice.call(element.children);
}