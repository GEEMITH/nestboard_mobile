import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import { memo } from "react"
const SvgComponent = () => (
  <Svg width={32} height={42} fill="none">
    <G clipPath="url(#a)">
      <Path
        fill="#E8652A"
        d="M16 0C7.168 0 0 7.168 0 16c0 12 16 26 16 26s16-14 16-26c0-8.832-7.168-16-16-16Z"
      />
      <Path fill="#fff" d="M16 25a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <Path fill="#E8652A" d="M16 21a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h32v42H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
const MapPinIcon = memo(SvgComponent)
export default MapPinIcon
