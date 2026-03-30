require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
});

const router = require("./src/SitemapRoutes").default;
const Sitemap = require("react-router-sitemap").default;

function generateSitemap() {
  return new Sitemap(router)
    .build("https://theluxurychessstaunton.com") // Replace with your domain
    .save("./public/sitemap.xml"); // Save to public folder
}

generateSitemap();
console.log("Sitemap generated in ./public/sitemap.xml");
