import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import visualizer from 'rollup-plugin-visualizer';

import { name, version } from './package.json';

import BabelConfig from './babel.config';


export default {
    input: 'src/index.js',
    output: {
        dir: "dist",
        file: 'bundle.js',
        format: 'cjs',
        banner: `/* ${name}  (v${version}) */`,
        globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
        },
        sourceMap: true,
        sourceMapFile: "./dist/bundle.js.map",
    },
    plugins: [
        resolve({
            modulesOnly: true,
        }),
        babel(BabelConfig),
        postcss({
            extensions: ['css', 'scss'],
            modules: true,
            extract: './dist/bundle.css',
            minimize: true,
        }),
        visualizer({
            filename: './build_artifacts/bundle_dependencies.html',
        }),
        terser(),
    ],
    external: [
        'react',
        'react-dom',
        'prop-types',
        'semantic-ui-react',
        'uuid',
    ],
};
