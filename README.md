

# Awesome Logging

  

**awesome-logging** is a collection of fancy text outputs and inputs for CLI tools written in NodeJS.
No matter what you want to log to the terminal or what information you need from the user, **awesome-logging** will help you do so. 
- You want to show the progress of a certain task while also logging messages to the terminal while keeping everythign nice and formatted? No problem.
- You want the user to select one or multiple options of a given list? No problem!
- You want to log messages in the background while showing a fancy animation or a prompt to the user? No problem! 
## Key functionality
- Written in TypeScript (Strongly typed)
- Live-update logging messages in a reliable way
- Multi-line logging
- Loading animations and progress bars
- Interactive prompts to get user input
- Interrupt currently playing animations with regular log entries
- Extendable design (add your own loggers / prompts)

![multiline example](https://user-images.githubusercontent.com/37637338/124401662-e6793480-dd2a-11eb-9a8d-c09328b19259.gif)

## Installation
```console
yarn add awesome-logging
// or
npm i awesome-logging
```
## Examples
```typescript
import { AwesomeLogger } from  'awesome-logger';
```
```typescript
// Example: Simple text logging
AwesomeLogger.log('Welcome to awesome-logging!');
const  logControl = AwesomeLogger.log('Is this a logging library?');
setTimeout(() =>  logControl.setText('This is an awesome-logging library!'), 1500);
setTimeout(() =>  logControl.setText('Cool!'), 3000);
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
const  logProgressControl = AwesomeLogger.log('progress', {
  totalProgress:  100,
  text:  'Very important progress:'
});

let  i = 0;
const  interval = setInterval(() => {
  logProgressControl.setProgress(i++);
  if (i === 100) {
    clearInterval(interval);
  }
}, 500);
```
![progress logging](https://user-images.githubusercontent.com/37637338/124401404-a9607280-dd29-11eb-9956-8378f54ffe0f.gif)

## AwesomeLogger Methods
```typescript
AwesomeLogger.create(loggerType, loggerOptions): LoggerControl

AwesomeLogger.log(text): LoggerControl
AwesomeLogger.log(logger): LoggerControl
AwesomeLogger.log(loggerType, loggerOptions): LoggerControl

AwesomeLogger.prompt(promptType, promptOptions): PromptControl
AwesomeLogger.interrupt(text): void
```
## Logger types
### Text
The simplest of all loggers; logs any printable string, no matter if one, or multiple lines.
#### Options
