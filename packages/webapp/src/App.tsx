import Calculator from 'components/Calculator'
import { XStateInspectLoader } from 'xstate-helpers/react/XStateInspectLoader'

function App() {
    return (
        <XStateInspectLoader options={{ url: 'https://stately.ai/viz?inspect', iframe: false }}>
            <div className="p-5">
                <span className="text-2xl">Calculator</span>
            </div>

            <div className="m-5">
                <Calculator />
            </div>
        </XStateInspectLoader>
    )
}

export default App
