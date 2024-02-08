const esbuild = require("esbuild");
const { solidPlugin } = require('./esbuild-solid');
const fs = require("fs-extra");

(async () => {

    await fs.emptyDir("async-esbuild/lib");
    await fs.emptyDir("async-esbuild/public");
    await fs.copy("shared/static", "async-esbuild/public");
    
    // client
    await esbuild.build({
        entryPoints: ['shared/src/index.js'],
        bundle: true,
        splitting: true,
        external: [],
        loader: { '.js': 'jsx' },
        outdir: "async-esbuild/public/js",
        platform: "browser",
        conditions: ["solid"],
        sourcemap: false,
        jsx: "preserve",
        write: true,
        minify: true,
        format: "esm",
        plugins: [solidPlugin({ solid: { generate: "dom", hydratable: true } })],
    });

    // server
    await esbuild.build({
        entryPoints: ['async-esbuild/index.js'],
        bundle: true,
        external: [],
        loader: { '.js': 'jsx' },
        outfile: "async-esbuild/lib/index.js",
        platform: "node",
        sourcemap: false,
        conditions: ["solid"],
        jsx: "preserve",
        write: true,
        minify: false,
        format: "cjs",
        plugins: [solidPlugin({ solid: { generate: "ssr", hydratable: true } })],
    });
})()