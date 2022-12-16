import { OrbitControls } from '@react-three/drei'
import { Debug, Physics } from '@react-three/rapier'
import Lights from './Lights.js'
// import { Level } from './Level.js'
import Player from './Player.js'
import Sandbox from './Sandbox.js'
import useGame from './stores/useGame.js'
import Effects from './Effects.js'
import Course from './Course.js'

export default function Experience()
{

    // if you only retrieve info you need, you prevent unnecessary rerender
    // const blocksCount = useGame(state => state.blocksCount)
    // const blocksSeed = useGame(state => state.blocksSeed)

    return <>

    <OrbitControls />

    <color args={ [ 'lightblue' ] } attach="background"></color>

    <Physics>
        <Course />
        {/* <Debug /> */}
        <Lights />
        {/* <Sandbox /> */}
        {/* <Level count={ blocksCount } seed={ blocksSeed } /> */}
        <Player />
    </Physics>
    <Effects />

    </>
}