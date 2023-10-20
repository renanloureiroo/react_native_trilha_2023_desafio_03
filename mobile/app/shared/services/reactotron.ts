import Reactotron from "reactotron-react-native";

export interface ReactotronConfig {
  /** The name of the app. */
  name?: string;
  /** The host to connect to: default 'localhost'. */
  host?: string;
  /** Should we use async storage */
  useAsyncStorage?: boolean;
  /** Should we clear Reactotron when load? */
  clearOnLoad?: boolean;
  /** log the initial data that we put into the state on startup? */
  logInitialState?: boolean;
  /** log snapshot changes. */
  logSnapshots?: boolean;
}

/**
 * The default Reactotron configuration.
 */
export const DEFAULT_REACTOTRON_CONFIG: ReactotronConfig = {
  clearOnLoad: true,
  host: "localhost",
  useAsyncStorage: true,
  logInitialState: true,
  logSnapshots: false,
};

const noop = () => undefined;

/**
 * Fake no-op version of Reactotron, so nothing breaks if a console.tron.*
 * gets through our conditionals.
 */
export const fakeReactotron = {
  benchmark: noop,
  clear: noop,
  close: noop,
  configure: noop,
  connect: noop,
  display: noop,
  error: noop,
  image: noop,
  log: noop,
  logImportant: noop,
  onCustomCommand: noop,
  overlay: noop,
  reportError: noop,
  send: noop,
  startTimer: noop,
  storybookSwitcher: noop,
  use: noop,
  useReactNative: noop,
  warn: noop,
};

declare global {
  interface Console {
    /**
     * Reactotron client for logging, displaying, measuring performance,
     * and more. See https://github.com/infinitered/reactotron for more!
     */
    tron: typeof Reactotron;
  }
}

// in dev, we attach Reactotron, in prod we attach a interface-compatible mock.
if (__DEV__) {
  console.tron = Reactotron; // attach reactotron to `console.tron`
} else {
  // attach a mock so if things sneak by our __DEV__ guards, we won't crash.
  console.tron = fakeReactotron as unknown as typeof Reactotron;
}

const config = DEFAULT_REACTOTRON_CONFIG;

// Avoid setting up Reactotron multiple times with Fast Refresh
let _reactotronIsSetUp = false;

/**
 * Configure reactotron based on the the config settings passed in, then connect if we need to.
 */
export function setupReactotron(customConfig: ReactotronConfig = {}) {
  // only run this in dev... metro bundler will ignore this block: 🎉
  if (__DEV__) {
    // only setup once.
    if (_reactotronIsSetUp) return;

    // merge the passed in config with our default config
    Object.assign(config, customConfig);

    // configure reactotron
    Reactotron.configure({
      name: config.name || require("../../../package.json").name,
      host: config.host,
    });

    Reactotron.useReactNative({
      asyncStorage: config.useAsyncStorage ? undefined : false,
    });
  }

  // connect to the app
  Reactotron.connect();

  /**
   * Reactotron allows you to define custom commands that you can run
   * from Reactotron itself, and they will run in your app.
   *
   * Define them in the section below with `onCustomCommand`. Use your
   * creativity -- this is great for development to quickly and easily
   * get your app into the state you want.
   */
}
