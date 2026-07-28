import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const SvgComponent = () => (
  <Svg
    width={40}
    height={40}
    fill="none"
    viewBox="0 0 24 24"
  >
    <Path
      fill="#0055ff"
      fillRule="evenodd"
      d="M13 3a1 1 0 1 0-2 0v1.062A8.004 8.004 0 0 0 4.062 11H3a1 1 0 1 0 0 2h1.062A8.004 8.004 0 0 0 11 19.938V21a1 1 0 1 0 2 0v-1.062A8.004 8.004 0 0 0 19.938 13H21a1 1 0 1 0 0-2h-1.062A8.004 8.004 0 0 0 13 4.062V3Zm-3 9a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm2-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
      clipRule="evenodd"
    />
  </Svg>
)
const MyLocationIcon = memo(SvgComponent)
export default MyLocationIcon
