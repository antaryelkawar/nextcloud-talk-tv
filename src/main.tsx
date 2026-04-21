/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import AppContainer from './App.tsx'

const root = document.getElementById('root')

render(() => <AppContainer />, root!)
