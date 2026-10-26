/**
 * Creates a DOM element. Children always go in as text, never as HTML.
 *
 * @param {string} tagName
 * @param {Record<string, unknown>} attributes  `class`, `onclick`-style listeners, or plain attributes
 * @param {...(Node|string|number|null|false|Array)} children
 */
export function createElement(tagName, attributes = {}, ...children) {
  const element = document.createElement(tagName);

  for (const [attributeName, attributeValue] of Object.entries(attributes ?? {})) {
    if (attributeValue == null || attributeValue === false) continue;

    if (attributeName === "class") {
      element.className = attributeValue;
    } else if (attributeName.startsWith("on")) {
      element.addEventListener(attributeName.slice(2), attributeValue);
    } else {
      element.setAttribute(attributeName, attributeValue === true ? "" : attributeValue);
    }
  }

  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    element.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }

  return element;
}

export function getRequiredElement(elementId) {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Missing element #${elementId}`);
  return element;
}
