# ellie.js
[![passing tests](https://img.shields.io/badge/dynamic/json?color=success&label=Tests&query=stats.passes&suffix=%20passing&url=https%3A%2F%2Fellieproject.github.io%2Fellie.js%2Ftest.json&logo=github&logoColor=white)](https://github.com/ellieproject/ellie.js/actions/workflows/node.js.yml)
[![failing tests](https://img.shields.io/badge/dynamic/json?color=critical&label=Tests&query=stats.failures&suffix=%20failing&url=https%3A%2F%2Fellieproject.github.io%2Fellie.js%2Ftest.json&logo=github&logoColor=white)](https://github.com/ellieproject/ellie.js/actions/workflows/node.js.yml)
[![coverage lines](https://img.shields.io/badge/dynamic/json?color=informational&label=Coverage&query=total.lines.pct&suffix=%25%20lines&url=https%3A%2F%2Fellieproject.github.io%2Fellie.js%2Fcoverage%2Fcoverage-summary.json&logo=github&logoColor=white)](https://ellieproject.github.io/ellie.js/coverage)
[![coverage statements](https://img.shields.io/badge/dynamic/json?color=informational&label=Coverage&query=total.statements.pct&suffix=%25%20statements&url=https%3A%2F%2Fellieproject.github.io%2Fellie.js%2Fcoverage%2Fcoverage-summary.json&logo=github&logoColor=white)](https://ellieproject.github.io/ellie.js/coverage)
[![coverage functions](https://img.shields.io/badge/dynamic/json?color=informational&label=Coverage&query=total.functions.pct&suffix=%25%20functions&url=https%3A%2F%2Fellieproject.github.io%2Fellie.js%2Fcoverage%2Fcoverage-summary.json&logo=github&logoColor=white)](https://ellieproject.github.io/ellie.js/coverage)
[![coverage branches](https://img.shields.io/badge/dynamic/json?color=informational&label=Coverage&query=total.branches.pct&suffix=%25%20branches&url=https%3A%2F%2Fellieproject.github.io%2Fellie.js%2Fcoverage%2Fcoverage-summary.json&logo=github&logoColor=white)](https://ellieproject.github.io/ellie.js/coverage)

A generic LLE (Low Level Emulation) environment written entirely in JavaScript

## TODO

- Rework the Register internals? I don't like how alias and bit/bitSet read...
- [More](https://ellieproject.github.io/ellie.js/test)/[more robust testing?](https://ellieproject.github.io/ellie.js/coverage/)
- Find a different [AVA](https://github.com/avajs/ava) to TAP to HTML test formatter? Currently using [Taplet](https://github.com/Richienb/taplet) (like [Istanbul/NYC's](https://github.com/istanbuljs/nyc) [HTML Reporter](https://istanbul.js.org/docs/advanced/alternative-reporters/)).
