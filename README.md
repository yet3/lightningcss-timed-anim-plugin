# lightningcss-anim-plugin

A lightingcss custom rules for making precisely timed keyframe animations.

### Installation
```
npm install --save-dev lightningcss
```

### Usage

`vite.config.ts`
```ts
import { composeVisitors } from "lightningcss";
import * as timedAnim from "@yet3/lightningcss-timed-anim-plugin";

export default defineConfig({
  css: {
    transformer: "lightningcss",
    lightningcss: {
      ...
      customAtRules: {
        ...timedAnim.customAtRules,
      },
      visitor: composeVisitors([timedAnim.visitor()]),
    },
  },
  ...
})
```

@step usage
```css
  @anim anim-1 {
    @step 1s {
      background-color: red;
    }
    @step 0.5s, 2s {
      background-color: blue;
    }
    @step 1s {
      background-color: red;
    }
  }
```

@anim-step/use-step usage
```css
  @anim-step step-red {
      background-color: red;
  }

  @anim-step step-blue {
      background-color: blue;
  }

  @anim anim-2 {
    @use-step step-red 1s;
    @use-step step-blue 0.5s, 2s;
    @use-step step-red 1s;
  }
```

@use-anim usage
```css
  ...

  @anim anim-3 {
    @step 1s, 1s {
      background-color: red;
    }
    @use-anim step-anim-2;
    @use-step step-red 1s;
  }
```
