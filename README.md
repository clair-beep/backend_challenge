# A/B Testing

## Requirements

```bash
Node
```

## Installation

```bash
#Install
$ npm install
```

## Running the App

```bash
# Development
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## Demo

Visit the [A/B Testing Demo](https://ab-testing.adaptable.app/)

## A/B Test Instructions

### Control Variation

In the `index.hbs` file, locate the following section:

```html
<!-- Control variation -->
<div>Meet the app that revolutionized reading.</div>
```

For the control variation, update the content within the `<div>` tags to represent the promotional message for the app that revolutionized reading.

### Test Variation

In the `index.hbs` file, locate the following section:

```html
<!-- Test variation -->
<div>Meet the app that has 18 million users.</div>
```

For the test variation, update the content within the `<div>` tags to represent the promotional message for the app that has 18 million users.

## Running the Project

1. Ensure all changes are saved in the `index.hbs` file.
2. Deploy the updated code to your development or testing environment.
3. Conduct A/B testing, collect data, and analyze the results.
