# Lottie to GIF Converter

A command-line tool to convert Lottie JSON animations to GIF format.

## Overview

This tool converts Lottie animations (exported from After Effects via Bodymovin) into GIF files. It uses Puppeteer to render animations with the official lottie-web library, ensuring accurate rendering.

## Features

- Convert Lottie JSON files to animated GIFs
- Configurable frame rate, dimensions, and quality
- Progress indicators for long conversions
- Accurate rendering using lottie-web in a headless browser

## Installation

```bash
npm install -g lottie-to-gif
```

Or use locally:

```bash
git clone https://github.com/marciorodrigues/lottie-tools.git
cd lottie-tools
npm install
npm run build
```

## Usage

```bash
# Basic usage
lottie-to-gif input.json -o output.gif

# With custom options
lottie-to-gif input.json -o output.gif --fps 30 --width 800 --height 600 --quality 90

# Show help
lottie-to-gif --help
```

## Options

- `-o, --output <path>` - Output GIF file path (default: input filename with .gif extension)
- `--fps <number>` - Frames per second (default: uses animation's original FPS)
- `--width <number>` - Output width in pixels (default: animation's original width)
- `--height <number>` - Output height in pixels (default: animation's original height)
- `--quality <number>` - Quality level 1-100 (default: 80)
- `-v, --verbose` - Enable verbose logging
- `-h, --help` - Display help information

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

## Project Structure

```
lottie-tools/
├── src/
│   ├── cli.ts              # CLI interface
│   ├── converter.ts        # Main conversion orchestrator
│   ├── lottie-parser.ts    # Lottie JSON parser
│   ├── renderer.ts         # Puppeteer-based renderer
│   ├── gif-encoder.ts      # GIF encoding
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── templates/          # HTML templates for rendering
├── tests/
│   ├── unit/               # Unit tests
│   └── integration/        # Integration tests
├── examples/               # Example Lottie files
└── bin/                    # Executable scripts
```

## Requirements

- Node.js >= 14.0.0
- Sufficient memory for rendering frames (varies by animation complexity)

## Limitations

- GIF format supports only 256 colors per frame
- Large or complex animations may take time to convert
- Very long animations may result in large GIF files

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- [lottie-web](https://github.com/airbnb/lottie-web) - Animation rendering
- [Puppeteer](https://pptr.dev/) - Headless browser automation
- [gif-encoder-2](https://www.npmjs.com/package/gif-encoder-2) - GIF encoding

## Status

This project is currently under development. See [PLAN.md](PLAN.md) for the implementation roadmap.
