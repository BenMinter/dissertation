import App from './App.svelte'
import RootStore from './model/RootStore'

const store = new RootStore()

const app = new App({
  props: { store },
  target: document.body,
})

export default app
