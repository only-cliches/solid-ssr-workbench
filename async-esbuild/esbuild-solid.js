// File was copied from https://www.npmjs.com/package/esbuild-plugin-solid
// with some minor changes

const { parse } = require("path");
const { Plugin } = require("esbuild");
const { readFile } = require("fs/promises");
const { transformAsync } = require("@babel/core");
const solid = require("babel-preset-solid");


module.exports.solidPlugin = function (options) {
    return {
        name: "esbuild:solid",
        setup(build) {
            build.onLoad({ filter: /\.(t|j)sx?$/ }, async (args) => {
                const source = await readFile(args.path, { encoding: "utf-8" });

                const { name, ext } = parse(args.path);
                const filename = name + ext;

                const result = await transformAsync(source, {
                    presets: [[solid, options?.solid ?? {}]],
                    filename,
                    sourceMaps: "inline",
                    ...(options?.babel ?? {})
                });

                if (result?.code === undefined || result.code === null) {
                    throw new Error("No result was provided from Babel");
                }

                return { contents: result.code, loader: "js" };
            });
        },
    };
}