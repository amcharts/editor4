# amCharts Editor 4 Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0-alpha.14] - 2020-07-23
### Added 
- editing `numberFormatter` property across the board
- transform values in data editor from string to number and vice versa
- editing of Container's `children` property

### Fixed
- Crash when dropdown value was `undefined`
- Exception when boolean or number property was `undefined`

## [4.0.0-alpha.13] - 2020-07-09
### Added
- Displaying series names instead of just type in the lists
- Data type dection in CSV imports
- Handling of more chart property types
- Developers can use `dummyData` chart property to store any serializable information in the chart config

### Fixed
- Handling of function type property values (eg. easing)
- Specifying cursor in a template resulted in a crash in some instances

### Changed
- Replaced CSV parsing engine with Papaparse


## [4.0.0-alpha.12] - 2020-06-15
### Added
- Data field names are kept in sync when column names in data are changed via the data editor or import

### Fixed
- Added missing "vanilla" JavaScript and Angluar sample links to readme

## [4.0.0-alpha.11] - 2020-06-04
### Added
- Spinner indicator during template loading
- Auto-refresh controls for the chart preview

### Fixed
- Uncontrolled/controlled component switching errors in the property grid
- Design module rendering inefficiencies

### Changed
- Data module toolbar layout

## [4.0.0-alpha.10] - 2020-05-21
### Added
- Basic support for hierarchical chart types (TreeMap, etc.)
- Column and row removal in the data module

### Changed
- Data module toolbar layout and workflow

## [4.0.0-alpha.9] - 2020-05-12
### Added
- `launcher.addLicense()` method to simplify adding a license number.
- editor version is now imprinted into code and can be viewed in dev tools.

### Changed
- Property configuration information extracted from the main editor code to
be fetched on the client for both compilation and runtime performance.

## [4.0.0-alpha.8] - 2020-04-23
### Added
- Initial public release.

[4.0.0-alpha.14]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-alpha.14
[4.0.0-alpha.13]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-alpha.13
[4.0.0-alpha.12]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-alpha.12
[4.0.0-alpha.11]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-alpha.11
[4.0.0-alpha.10]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-alpha.10
[4.0.0-alpha.9]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-alpha.9
[4.0.0-alpha.8]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-alpha.8