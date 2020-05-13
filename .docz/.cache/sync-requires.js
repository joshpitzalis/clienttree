const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---cache-dev-404-page-js": hot(preferDefault(require("/Users/joshuapittman/Desktop/clienttree/.docz/.cache/dev-404-page.js"))),
  "component---readme-md": hot(preferDefault(require("/Users/joshuapittman/Desktop/clienttree/README.md"))),
  "component---src-features-people-components-person-card-person-card-mdx": hot(preferDefault(require("/Users/joshuapittman/Desktop/clienttree/src/features/people/components/PersonCard/personCard.mdx"))),
  "component---src-pages-404-js": hot(preferDefault(require("/Users/joshuapittman/Desktop/clienttree/.docz/src/pages/404.js")))
}

