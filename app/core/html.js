/**
 *
 * @param {TemplateStringsArray} parts
 * @param {any[]} args
 * @return {DocumentFragment}
 */
export function html(parts, ...args) {
  const element = document.createElement('template');

  element.innerHTML = args.reduce((previous, value, index) => {
    return previous + parts.raw[index] + value;
  }, '') + parts.raw[parts.raw.length - 1];

  return document.importNode(element.content, true);
}