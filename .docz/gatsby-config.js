const { mergeWith } = require('docz-utils')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/',

  siteMetadata: {
    title: 'Clienttree',
    description: 'My awesome app using docz',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {},
        src: './',
        gatsbyRoot: null,
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
        menu: [],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [],
        typescript: false,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: null,
        o: null,
        open: null,
        'open-browser': null,
        root: '/Users/joshuapittman/Desktop/clienttree/.docz',
        base: '/',
        source: './',
        'gatsby-root': null,
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: '.docz/dist',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'Clienttree',
        description: 'My awesome app using docz',
        host: 'localhost',
        port: 3000,
        p: 3000,
        separator: '-',
        paths: {
          root: '/Users/joshuapittman/Desktop/clienttree',
          templates:
            '/Users/joshuapittman/Desktop/clienttree/node_modules/docz-core/dist/templates',
          docz: '/Users/joshuapittman/Desktop/clienttree/.docz',
          cache: '/Users/joshuapittman/Desktop/clienttree/.docz/.cache',
          app: '/Users/joshuapittman/Desktop/clienttree/.docz/app',
          appPackageJson:
            '/Users/joshuapittman/Desktop/clienttree/package.json',
          appTsConfig: '/Users/joshuapittman/Desktop/clienttree/tsconfig.json',
          gatsbyConfig:
            '/Users/joshuapittman/Desktop/clienttree/gatsby-config.js',
          gatsbyBrowser:
            '/Users/joshuapittman/Desktop/clienttree/gatsby-browser.js',
          gatsbyNode: '/Users/joshuapittman/Desktop/clienttree/gatsby-node.js',
          gatsbySSR: '/Users/joshuapittman/Desktop/clienttree/gatsby-ssr.js',
          importsJs:
            '/Users/joshuapittman/Desktop/clienttree/.docz/app/imports.js',
          rootJs: '/Users/joshuapittman/Desktop/clienttree/.docz/app/root.jsx',
          indexJs:
            '/Users/joshuapittman/Desktop/clienttree/.docz/app/index.jsx',
          indexHtml:
            '/Users/joshuapittman/Desktop/clienttree/.docz/app/index.html',
          db: '/Users/joshuapittman/Desktop/clienttree/.docz/app/db.json',
        },
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
