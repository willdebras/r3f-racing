import { forwardRef } from 'react'
import motionBlurEffect from './Motionblur.js'

export default forwardRef(function Motion(props, ref) {

    const effect = new motionBlurEffect(props)

    return <primitive ref={ ref } object={ effect } />
})