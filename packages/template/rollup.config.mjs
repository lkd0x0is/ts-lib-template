import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import esbuild from "rollup-plugin-esbuild";

import pkg from "./package.json" with { type: "json" };

const external = [
	...Object.keys(pkg.dependencies ?? {}),
	...Object.keys(pkg.peerDependencies ?? {}),
];

export default [
	{
		input: "src/index.ts",
		external,
		output: [
			{ file: pkg.module, format: "es", sourcemap: true },
			{ file: pkg.main, format: "cjs", sourcemap: true, exports: "auto" },
		],
		plugins: [
			alias({ entries: [{ find: "@", replacement: "src" }] }),
			nodeResolve({ preferBuiltins: true }),
			commonjs(),
			esbuild({ target: "es2022", minify: false, sourcemap: true }),
			terser({
				compress: true,
				mangle: true,
				format: {
					comments: false,
				},
			}),
		],
	},
];
