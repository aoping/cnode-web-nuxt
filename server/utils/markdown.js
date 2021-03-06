const MarkdownIt = require('markdown-it')
const validator = require('validator')
const jsxss = require('xss')
const bcrypt = require('bcryptjs')


// Set default options
const md = new MarkdownIt()

md.set({
  html: false, // Enable HTML tags in source
  xhtmlOut: false, // Use '/' to close single tags (<br />)
  breaks: false, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URL-like text to links
  typographer: true, // Enable smartypants and other sweet transforms
})

md.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx]
  let language = (token.info && 'language-' + token.info) || ''
  language = validator.escape(language)

  return (
    '<pre class="prettyprint ' +
    language +
    '">' +
    '<code>' +
    validator.escape(token.content) +
    '</code>' +
    '</pre>'
  )
}

md.renderer.rules.code_block = (tokens, idx /* , options */ ) => {
  const token = tokens[idx]

  return (
    '<pre class="prettyprint">' +
    '<code>' +
    validator.escape(token.content) +
    '</code>' +
    '</pre>'
  )
}

const myxss = new jsxss.FilterXSS({
  onIgnoreTagAttr(tag, name, value) {
    // 让 prettyprint 可以工作
    if (tag === 'pre' && name === 'class') {
      return name + '="' + jsxss.escapeAttrValue(value) + '"'
    }
  },
})

export const markdown = text => {
  return (
    '<div class="markdown-text">' +
    myxss.process(md.render(text || '')) +
    '</div>'
  )
}
