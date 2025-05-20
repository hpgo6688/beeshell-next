import React from 'react'
import {
  Image,
  ImageStyle,
  ImageSourcePropType
} from 'react-native'
import variables from '../../common/styles/variables'

export interface IconProps {
  style?: ImageStyle
  type?: string
  size?: number | string | null | undefined
  tintColor?: string | null | undefined // Android 平台无效
  source?: ImageSourcePropType
}

export const Icon: React.FC<IconProps> = ({
  type = 'angle-down',
  size = 14,
  style = {},
  tintColor = variables.mtdBrandPrimaryDark,
  source = null
}) => {
  const mainStyle = {
    tintColor,
    width: size,
    height: size
  }

  if (size == null) {
    delete mainStyle.width
    delete mainStyle.height
  }

  if (!source) {
    source = require(`../../common/images/icons/${type}.png`)
  }

  return (
    <Image
      style={[
        style,
        {
          ...mainStyle
        }
      ]}
      source={source}
    />
  )
}

Icon.displayName = 'Icon'