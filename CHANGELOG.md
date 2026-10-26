# Changelog

## [1.0.6](https://github.com/alrayyes/bun-with-git/compare/1.0.5...1.0.6) (2026-10-26)


### Bug Fixes

* **deps:** bump oven/bun from 1.4.2-alpine to 1.4.3-alpine ([#77](https://github.com/alrayyes/bun-with-git/issues/77)) ([95db828](https://github.com/alrayyes/bun-with-git/commit/95db8283fd9bb7b82166d61b9303bc307591cab6))
* **deps:** bump oven/bun from 1.4.3-alpine to 1.4.4-alpine ([#79](https://github.com/alrayyes/bun-with-git/issues/79)) ([b7afdce](https://github.com/alrayyes/bun-with-git/commit/b7afdce4a51161753f05c36413ef62e563131c7a))
* **lint:** leave markdown to prettier in biome ([#83](https://github.com/alrayyes/bun-with-git/issues/83)) ([8dedaf6](https://github.com/alrayyes/bun-with-git/commit/8dedaf60c7ca1dafd350a558850dd01ac457f832)), closes [#82](https://github.com/alrayyes/bun-with-git/issues/82)

## [1.0.5](https://github.com/alrayyes/bun-with-git/compare/1.0.4...1.0.5) (2026-10-15)


### Bug Fixes

* **ci:** run release-auto-merge when the autorelease label is added ([#70](https://github.com/alrayyes/bun-with-git/issues/70)) ([0ccb89e](https://github.com/alrayyes/bun-with-git/commit/0ccb89e35117c125528947292c4d4a0e9071200c)), closes [#69](https://github.com/alrayyes/bun-with-git/issues/69)

## [1.0.4](https://github.com/alrayyes/bun-with-git/compare/1.0.3...1.0.4) (2026-10-09)


### Bug Fixes

* **hooks:** drop docker build from pre-commit ([#65](https://github.com/alrayyes/bun-with-git/issues/65)) ([363c558](https://github.com/alrayyes/bun-with-git/commit/363c558d6a94069fe26c056435fb18dcc0d69ac4))

## [1.0.3](https://github.com/alrayyes/bun-with-git/compare/1.0.2...1.0.3) (2026-10-05)


### Bug Fixes

* **deps:** clear fast-uri and braces audit failures ([#62](https://github.com/alrayyes/bun-with-git/issues/62)) ([87c9fec](https://github.com/alrayyes/bun-with-git/commit/87c9fec012c3bd20b16646c408b7db8b9e19999d)), closes [#61](https://github.com/alrayyes/bun-with-git/issues/61)

## [1.0.2](https://github.com/alrayyes/bun-with-git/compare/1.0.1...1.0.2) (2026-09-14)


### Bug Fixes

* **ci:** use GITHUB_TOKEN for Dependabot auto-merge, not RELEASE_TOKEN ([#54](https://github.com/alrayyes/bun-with-git/issues/54)) ([f574452](https://github.com/alrayyes/bun-with-git/commit/f574452083f340e4d7523cf0c58356138293556b)), closes [#53](https://github.com/alrayyes/bun-with-git/issues/53)

## [1.0.1](https://github.com/alrayyes/bun-with-git/compare/1.0.0...1.0.1) (2026-09-11)


### Bug Fixes

* **ci:** use RELEASE_TOKEN for dependabot auto-merge ([#50](https://github.com/alrayyes/bun-with-git/issues/50)) ([320465b](https://github.com/alrayyes/bun-with-git/commit/320465baea2ef466ddd11f1b2e535a8bb1b970d0)), closes [#47](https://github.com/alrayyes/bun-with-git/issues/47)
* **deps:** bump js-yaml and ignore unfixable smol-toml advisory ([#49](https://github.com/alrayyes/bun-with-git/issues/49)) ([5337547](https://github.com/alrayyes/bun-with-git/commit/53375475593d882efcdaff2dc4272ded62331ab2)), closes [#48](https://github.com/alrayyes/bun-with-git/issues/48)
* **deps:** bump oven/bun from 1.4.0-alpine to 1.4.2-alpine ([#44](https://github.com/alrayyes/bun-with-git/issues/44)) ([34f35ab](https://github.com/alrayyes/bun-with-git/commit/34f35ab11efa31f096a7651fc6d2141f1535f63f))

## [1.0.0](https://github.com/alrayyes/bun-with-git/compare/0.1.5...1.0.0) (2026-09-02)


### Miscellaneous Chores

* relicense to MIT and graduate to 1.0.0 ([#34](https://github.com/alrayyes/bun-with-git/issues/34)) ([801fd39](https://github.com/alrayyes/bun-with-git/commit/801fd395f4419d8216ae9d69ef9f5aee3468a0ad)), closes [#33](https://github.com/alrayyes/bun-with-git/issues/33)

## [0.1.5](https://github.com/alrayyes/bun-with-git/compare/0.1.4...0.1.5) (2026-09-02)


### Bug Fixes

* add dependency-review-action now that the repo is public ([#28](https://github.com/alrayyes/bun-with-git/issues/28)) ([580921e](https://github.com/alrayyes/bun-with-git/commit/580921e5190102434cfe01d32520ccfe3b3f1366))

## [0.1.4](https://github.com/alrayyes/bun-with-git/compare/0.1.3...0.1.4) (2026-09-02)


### Bug Fixes

* run bun audit in CI and pre-push ([#26](https://github.com/alrayyes/bun-with-git/issues/26)) ([d3b15e2](https://github.com/alrayyes/bun-with-git/commit/d3b15e2c44e1e6f2f85f7b160619ef61f5a0811d))

## [0.1.3](https://github.com/alrayyes/bun-with-git/compare/0.1.2...0.1.3) (2026-09-02)


### Bug Fixes

* run docker build in pre-commit and pre-push, not just CI ([#24](https://github.com/alrayyes/bun-with-git/issues/24)) ([ccc7a4e](https://github.com/alrayyes/bun-with-git/commit/ccc7a4ee740b551b45c2265e6eaf7fe9e723442a))
* run hadolint with docker run instead of compose ([#21](https://github.com/alrayyes/bun-with-git/issues/21)) ([c9ecc2e](https://github.com/alrayyes/bun-with-git/commit/c9ecc2e9664322fdd190744fd3c52a3b583fd8f3))

## [0.1.2](https://github.com/alrayyes/bun-with-git/compare/0.1.1...0.1.2) (2026-09-01)


### Bug Fixes

* **deps:** bump oven/bun from 1.3.14-alpine to 1.4.0-alpine ([#5](https://github.com/alrayyes/bun-with-git/issues/5)) ([e760a5a](https://github.com/alrayyes/bun-with-git/commit/e760a5a7f6034fa1c93f3f22fe91887eab0f808f))

## [0.1.1](https://github.com/alrayyes/bun-with-git/compare/0.1.0...0.1.1) (2026-08-20)


### Bug Fixes

* use an obvious placeholder for the example digest ([#3](https://github.com/alrayyes/bun-with-git/issues/3)) ([b2daed7](https://github.com/alrayyes/bun-with-git/commit/b2daed72c59761ca5f4306ad4bd7c1bd4e659098))
