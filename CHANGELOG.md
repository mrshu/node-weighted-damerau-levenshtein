# Change Log

All notable changes to this project will be documented in this file. The format
is based on [Keep a Changelog](https://keepachangelog.com/). This project
adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.2.0] - 2026-02-21

### Added

- Added comprehensive edge-case test coverage using the Node.js built-in test runner.
- Added strict runtime validation for inputs and options, plus TypeScript declarations in `index.d.ts`.
- Added GitHub Actions workflows for CI and npm publishing with provenance.

### Changed

- Modernized package metadata (`exports`, `types`, `files`, `engines`, `bugs`, `homepage`, `publishConfig`) for current npm conventions.
- Replaced legacy Travis CI setup with script-driven CI (`npm run ci`) and automated tag-based publish flow.
- Improved README structure and npm-facing wording/keywords to improve discoverability in package and search contexts.
- Upgraded tooling to modern lint + coverage stack (`eslint@10`, `node:test` with built-in coverage) with strict 100% coverage thresholds.

## [0.1.0] - 2019-10-01

### Added

- First released version.
