import { createDocumentation } from '@hitomihiumi/micro-docgen';
import { version } from './package.json';

async function main() {
    const docs = await createDocumentation({
        tsconfigPath: './tsconfig.json',
        input: ['src'],
        markdown: false,
        output: 'public',
        jsonName: 'docs.json',
        packageVersion: version,
        clean: true,
    });

    console.log(`Took ${docs.metadata.generationMs}ms to generate the documentation!`);
}

main();