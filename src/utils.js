const dateformat = require(`dateformat`)

exports.makeBlogPath = ({ date, slug }) => {
  const createdAt = new Date(date)
  const formattedDate = dateformat(createdAt, `yyyy-mm-dd`)
  return `/${formattedDate}-${slug}`
}
