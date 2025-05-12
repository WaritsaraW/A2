/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure PostCSS to ignore Tailwind CSS references
  // Comment this section out if you experience any issues
  webpack: (config) => {
    const oneOfRule = config.module.rules.find(
      (rule) => typeof rule.oneOf === 'object'
    );

    if (oneOfRule) {
      const cssLoaderWithModules = oneOfRule.oneOf.find(
        (rule) => rule.test?.toString().includes('\\.module\\.css')
      );

      if (cssLoaderWithModules) {
        // Remove PostCSS plugins that might reference Tailwind
        if (cssLoaderWithModules.use) {
          cssLoaderWithModules.use = cssLoaderWithModules.use.map((rule) => {
            if (rule.loader?.includes('postcss-loader')) {
              return {
                ...rule,
                options: {
                  ...rule.options,
                  postcssOptions: {
                    plugins: [],
                  },
                },
              };
            }
            return rule;
          });
        }
      }
    }

    return config;
  },
  
  // Add this to ignore build errors
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  
  // Ignore ESLint errors
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 