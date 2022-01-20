# amCharts Editor 4 Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.3] - 2022-01-20
### Fixed
- generating full-page code for charts with non-Latin data resulted in an exception

## [4.0.2] - 2021-04-22
### Fixed
- lists of simple object resulted in an exception (eg. gridIntervals).
- empty objects added to output config in some cases.
- ChartElementReferenceList config parsing was throwing exceptions.
- elelement reference list wasn't displayed for XYCursor.snapToSeries.

### Changed
- updated amCharts to v4.10.18

## [4.0.1] - 2021-03-01
### Added
- start/endAngle properties to `PieSeries`.

### Changed
- update amCharts libraries to current versions.

## [4.0.0] - 2020-11-30
### Fixed
- false positives on the console chart creation error message.

## [4.0.0-rc.1] - 2020-11-17
### Added
- More content in class reference documentation.
- In a common misconfiguration scenario, a helpful message is logged into console.

### Fixed
- `fillModifier` and `strokModifier` properties were showing up as unsupported in some areas.
- not passing custom templates while disallowing the default ones resulted in a crash.

## [4.0.0-rc.0] - 2020-10-26
### Changed
- Updated core internal and external dependencies to the newest versions

## [4.0.0-beta.5] - 2020-10-15
### Added
- Better handling of external data source set on the chart
- Ability to set custom data field name

### Fixed
- Crash when changing data field to "(not set)" and switching to Code module

## [4.0.0-beta.4] - 2020-10-02
### Added
- Language switching to Vue and React demos.
- State of the home page is now preserved when switching to/from Desing, etc.

### Changed
- Switched routing to hash-style for wider compatibility and server-side independence.

### Fixed
- Added missing type declaration files for language packs.
- There were no scrollbars in Data editor for larger datasets.
- Minor language file fixes.

## [4.0.0-beta.3] - 2020-09-17
### Added
- Localization system. English, Lithuanian (UI-only) and Russian (UI-only) localizations included.

### Fixed
- Multi-type scalar properties were never rendered as numbers (caused issues with fields that weren't cast by the charts - eg, ValueAxis.min/max)

## [4.0.0-beta.2] - 2020-09-02
### Fixed
- Date type fields were stripped from data breaking all date-based charts

## [4.0.0-beta.1] - 2020-08-27
### Added
- CSV file import
- Color editor with color picker for Color-type fields

## [4.0.0-alpha.15] - 2020-08-03
### Added
- Sankey Diagram template
- Support for fill and stroke modifiers
- Support for filters
- Basic support for patterns

### Changed
- hide series in Gauge and TreeMap charts as not making sense in the context

### Fixed
- Exception when dummyData was an object
- Theme changes weren't reflected in preview
- adding series in Radar chart wasn't working properly

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

[4.0.3]: https://github.com/amcharts/editor4/releases/tag/v4.0.3
[4.0.2]: https://github.com/amcharts/editor4/releases/tag/v4.0.2
[4.0.1]: https://github.com/amcharts/editor4/releases/tag/v4.0.1
[4.0.0]: https://github.com/amcharts/editor4/releases/tag/v4.0.0
[4.0.0-rc.1]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-rc.1
[4.0.0-rc.0]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-rc.0
[4.0.0-beta.5]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-beta.5
[4.0.0-beta.4]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-beta.4
[4.0.0-beta.3]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-beta.3
[4.0.0-beta.2]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-beta.2
[4.0.0-beta.1]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-beta.1
[4.0.0-alpha.15]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-alpha.15
[4.0.0-alpha.14]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-alpha.14
[4.0.0-alpha.13]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-alpha.13
[4.0.0-alpha.12]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-alpha.12
[4.0.0-alpha.11]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-alpha.11
[4.0.0-alpha.10]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-alpha.10
[4.0.0-alpha.9]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-alpha.9
[4.0.0-alpha.8]: https://github.com/amcharts/editor4/releases/tag/v4.0.0-alpha.8