export function removeMarkdown(text: string) {
  return text.replace(/(?:__|[*#])|\[(.*?)\]\(.*?\)/g, "$1");
}
