# Docs

## Logger types

### Text

The simplest of all loggers; logs any printable string, no matter if one, or multiple lines.

**LoggerOptions**

| Option | type   | description                     | default |
| ------ | ------ | ------------------------------- | ------- |
| text   | string | The text that should be logged. | ''      |

**LoggerControl**

| Method                | returnType | description                    |
| --------------------- | ---------- | ------------------------------ |
| setText(text: string) | void       | Sets a new text to the logger. |

---

### Spinner

Logs a loading spinner with a custom loading animation and text.

**LoggerOptions**

| Option        | type     | description                                           | default                     |
| ------------- | -------- | ----------------------------------------------------- | --------------------------- |
| text          | string   | The description text of the loading spinner.          | ''                          |
| spinnerFrames | string[] | The array of strings that are used for the animation. | ['. ', '.. ', '...', '.. '] |
| spinnerDelay  | number   | The amount of ms between each spinnerframe.           | 500                         |

**LoggerControl**

| Method                                                                      | returnType | description                                                                    |
| --------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------ |
| stop(options: { succeeded?: boolean; removeLine?: boolean; text?: string }) | void       | Stops the spinner and changes the logging accordingly to the provided options. |

---

### Progress

Loggs a progressbar with optional text.

**LoggerOptions**

| Option        | type               | description                                                           | default        |
| ------------- | ------------------ | --------------------------------------------------------------------- | -------------- |
| totalProgress | number             | The maximum number the progress can reach.                            | 100            |
| text          | string             | The text that is displayed in front of the bar.                       | ''             |
| completedText | string             | The text that is displayed when the progress reaches 100%.            | ''             |
| unfilledChar  | string             | The character that is pronted for the uncompleted section of the bar. | '·'            |
| filledChar    | string             | The character that is pronted for the completed section of the bar.   | '■'            |
| borderChar    | string             | The caharter that is printed on the left and right of the bar.        | '■'            |
| maxWidth      | number             | The maximum cound characters the progressbar can have can.            | Terminal Width |
| borderColor   | AwesomeLoggerColor | The color of the border chars.                                        | 'GRAY'         |
| unfilledColor | AwesomeLoggerColor | The color of the uncompleted part of the bar.                         | 'GRAY'         |
| filledColor   | AwesomeLoggerColor | The color of the completed part of the bar.                           | 'WHITE'        |

**Note:** For performance reasons do not specify the colors of unfilled or filled characters directly in the string option, but by the dedicated color option.

**LoggerControl**

| Method                                       | returnType | description                                          |
| -------------------------------------------- | ---------- | ---------------------------------------------------- |
| setProgress(progress: number, text?: string) | void       | Sets the current progress and optionally a new text. |

---

### Checklist

Logs a list of items that have a certain state like 'pending', 'inProgress', 'succeeded' and more.

**LoggerOptions**

| Option | type                       | description                               | default |
| ------ | -------------------------- | ----------------------------------------- | ------- |
| items  | AwesomeChecklistLoggerItem | All items that are part of the checklist. | []      |

**LoggerControl**

| Method                                                                           | returnType | description                                                                                 |
| -------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------- |
| changeState(index: number, state: AwesomeChecklistLoggerState, newText?: string) | void       | Changes the state of one item based on the index. Optionally sets a new text for that item. |

---

### Multi

Combines multiple loggers that were created previously and loggs them below each other.

**LoggerOptions**

| Option   | type                | description                                        | default |
| -------- | ------------------- | -------------------------------------------------- | ------- |
| children | AwesomeLoggerBase[] | The array of loggers that were created previously. | []      |

**LoggerControl**

| Method                                                 | returnType | description                                                                                                                    |
| ------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| getChild\<T extends AwesomeLoggerBase\>(index: number) | T          | Returns the child at the given index. Be cautious as you have to be sure what kind of logger is present at the provided index. |

---
