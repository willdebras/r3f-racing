import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(subscribeWithSelector((set) => 
{
    return {
        blocksCount: 10,
        // provide to useMemo to generate new level on restart
        blocksSeed: 0,
        startTime: 0,
        endTime: 0,
        phase: 'ready',
        boost: 0,
        // creates a method corresponding with the start property that calls that set function i.e. returns new state
        // here we return an update to phase
        start: () => {
            set((state) => {
                // dont always change start, i.e. dont change state to itself if not needed
                // can also save the start time so we can calculate game time
                if(state.phase === 'ready') return { phase: 'playing', startTime: Date.now() }
                // return nothing default
                return {}
            })
        },
        restart: () => {
            set((state) => {
                if(state.phase === 'playing' || state.phase === 'ended') return {phase: 'ready', blocksSeed: Math.random() }
                // return nothing default
                return {}
            })
        },
        end: () => {
            set((state) => {
                if(state.phase === 'playing') return {phase: 'ended', endTime: Date.now() }
                return {}
            })
        },
        setBoost: (value) => {
            set((state) => {
                return({boost: value})
            })
        }
    }
}))