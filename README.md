[![npm](https://img.shields.io/npm/v/awesome-logging?color=%2300d26a&style=for-the-badge)](https://www.npmjs.com/package/awesome-logging)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/loaderb0t/awesome-logging/awesome-logging-CI/main?style=for-the-badge)](https://github.com/LoaderB0T/awesome-logging/actions/workflows/build.yml)
[![LGTM Grade](https://img.shields.io/lgtm/grade/javascript/github/LoaderB0T/awesome-logging?label=Code%20Quality&style=for-the-badge)](https://lgtm.com/projects/g/LoaderB0T/awesome-logging/?mode=list)
[![LGTM Alerts](https://img.shields.io/lgtm/alerts/github/LoaderB0T/awesome-logging?style=for-the-badge)](https://lgtm.com/projects/g/LoaderB0T/awesome-logging/?mode=list)

# awesome-logging

An awesome set of logging and prompting utilities for Node.js.

## Motivation 💥

**awesome-logging** is a collection of fancy text outputs and inputs for CLI tools written in NodeJS.
No matter what you want to log to the terminal or what information you need from the user, **awesome-logging** will help you do so.

- You want to show the progress of a certain task while also logging messages to the terminal while keeping everything nice and formatted? No problem.
- You want the user to select one or multiple options of a given list? Sure thing!
- You want to log messages in the background while showing a fancy animation or a prompt to the user? Go for it!

## Features 🔥

✅ Written in TypeScript (Strongly typed)

✅ Live-update logging messages in a reliable way

✅ Multi-line logging

✅ Flicker-free output, even on Windows

✅ Loading animations and progress bars

✅ Interactive prompts to get user input

✅ Interrupt currently playing animations with regular log entries

✅ Extendable design (add your own loggers / prompts)

One example of a multiline logger with many different logger types: (Not particularly pretty, but shows the idea)

![multiline example](https://user-images.githubusercontent.com/37637338/124401662-e6793480-dd2a-11eb-9a8d-c09328b19259.gif)

## Built With 🔧

- [TypeScript](https://www.typescriptlang.org/)

## Installation 📦

```console
yarn add awesome-logging
// or
npm i awesome-logging
```

## Docs 📃

Find a bit of documentation [here](https://github.com/LoaderB0T/awesome-logging/blob/main/DOCS.md).

## Usage Example 🚀

```typescript
import { AwesomeLogger } from 'awesome-logger';
```

```typescript
// Example: Simple text logging
AwesomeLogger.log('Welcome to awesome-logging!');
const logControl = AwesomeLogger.log('Is this a logging library?');
setTimeout(() => logControl.setText('This is an awesome-logging library!'), 1500);
setTimeout(() => logControl.setText('Cool!'), 3000);
```

![simple text logging](https://user-images.githubusercontent.com/37637338/124401295-e8da8f00-dd28-11eb-8b46-4efbfba30008.gif)

```typescript
// Example: Simple text logging (with line breaks)
const textA = 'One line of text...';
const textB = 'Multiple\nLines\nof Text!';
let state = true;
const logControl = AwesomeLogger.log(textA);
setInterval(() => {
  state = !state;
  logControl.setText(state ? textA : textB);
}, 1000);
```

![text linebreak logging](https://user-images.githubusercontent.com/37637338/124401381-78803d80-dd29-11eb-8407-f3c462a455fc.gif)

```typescript
// Example: Progress Bar
const logProgressControl = AwesomeLogger.log('progress', {
  totalProgress: 100,
  text: 'Very important progress:'
});

let i = 0;
const interval = setInterval(() => {
  logProgressControl.setProgress(i++);
  if (i === 100) {
    clearInterval(interval);
  }
}, 500);
```

![progress logging](https://user-images.githubusercontent.com/37637338/124401404-a9607280-dd29-11eb-9956-8378f54ffe0f.gif)

## Contributing 🧑🏻‍💻

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 🔑

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Contact 📧

Janik Schumacher - [@LoaderB0T](https://twitter.com/LoaderB0T) - [linkedin](https://www.linkedin.com/in/janikschumacher/)

Project Link: [https://github.com/LoaderB0T/awesome-logging](https://github.com/LoaderB0T/awesome-logging)
