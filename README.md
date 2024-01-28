# Subroutines for BrainFuck

As the name implies this project adds subroutines for [BrainFuck (BF)](https://esolangs.org/wiki/Brainfuck).

## Building and Running

This project is written in [Typescript](https://www.typescriptlang.org/) and must be compiled before it can be used.

To compile this project run the following command:

```shell
pnpm run build
# or
npm run build
# or
yarn build
```

Once the compilation has finished a new folder named `dist` will appear. Then you can run the app with the command:

```shell
node ./dist/app.js
```

## Usage

This interpreter can execute regular BrainFuck files (`.bf`) and BrainFuck files with subroutines (`.subf`).

To execute a file run the following command:

```shell
node ./dist/app.js <file>
```

where:

- `file` - Is the path to the file to be interpreted.

Calling it without an input file will throw an error.
