/* eslint-disable no-continue */
function matchPaths(templatePath: string, actualPath: string): boolean {
  // separamos los segmentos del endpoint
  const templateSegments = templatePath.split('/').filter((a) => a !== '');
  const actualSegments = actualPath.split('/').filter((a) => a !== '');

  // sel endpoint template termina con un * lo eliminamos
  if (templateSegments[templateSegments.length - 1] === '*') {
    templateSegments.pop();
  }

  // recorremos los segmentos del endpoint template y comparamos con los segmentos del endpoint actual
  const results = templateSegments.map((segment, index) => {
    return segment === '*' || actualSegments[index] === segment;
  });

  return results.every((a) => a === true);
}

export default matchPaths;
