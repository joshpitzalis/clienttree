// prefer default export if available
const preferDefault = m => m && m.default || m

exports.components = {
  "component---cache-dev-404-page-js": () => import("./dev-404-page.js" /* webpackChunkName: "component---cache-dev-404-page-js" */),
  "component---readme-md": () => import("./../../README.md" /* webpackChunkName: "component---readme-md" */),
  "component---src-features-people-components-person-card-person-card-mdx": () => import("./../../src/features/people/components/PersonCard/personCard.mdx" /* webpackChunkName: "component---src-features-people-components-person-card-person-card-mdx" */),
  "component---src-pages-404-js": () => import("./../src/pages/404.js" /* webpackChunkName: "component---src-pages-404-js" */)
}

