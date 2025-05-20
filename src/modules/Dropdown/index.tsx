import React, { ReactElement, useRef, useMemo, useCallback } from 'react'
import {
  ViewStyle,
  ScrollView,
  Animated,
  StyleProp
} from 'react-native'
import { SlideModal, SlideModalProps } from '../../components/SlideModal'
import { Radio } from '../../components/Radio'
import dropdownStyles from './styles'
import variables from '../../common/styles/variables'
import { SlideAnimated } from '../../common/animations'

type Direction = 'up' | 'down'

interface OptionItem {
  label: string
  value: any
  testID?: string
  [key: string]: any
}

export interface DropdownProps extends Omit<SlideModalProps, 'direction'> {
  testID?: string
  style?: StyleProp<ViewStyle>
  direction?: Direction
  data: OptionItem[]
  value: any
  checkedIcon?: ReactElement
  uncheckedIcon?: ReactElement
  onChange: (value: any) => void
  cancelable?: boolean
  fullScreenPatch?: boolean[] | null
}

const getFullScreenPatch = (direction: Direction): boolean[] => 
  direction === 'down' ? [true, false, false] : [false, false, true]

const DropdownContent: React.FC<{
  data: OptionItem[]
  value: any
  onChange: (value: any) => void
  checkedIcon?: ReactElement
  uncheckedIcon?: ReactElement
  style?: StyleProp<ViewStyle>
  animatedStyle?: any
  onClose: () => void
}> = ({
  data,
  value,
  onChange,
  checkedIcon,
  uncheckedIcon,
  style,
  animatedStyle,
  onClose
}) => (
  <ScrollView style={[dropdownStyles.container, style]}>
    <Animated.View style={animatedStyle}>
      <Radio
        checkedIcon={checkedIcon}
        uncheckedIcon={uncheckedIcon}
        value={value}
        onChange={(newValue) => {
          onClose()
          onChange(newValue)
        }}>
        {data.map((item, index) => (
          <Radio.Item
            testID={item.testID}
            key={index}
            label={item.label}
            value={item.value}
          />
        ))}
      </Radio>
    </Animated.View>
  </ScrollView>
)

export const Dropdown: React.FC<DropdownProps> = ({
  direction = 'down',
  fullScreenPatch,
  offsetX,
  offsetY,
  cancelable = false,
  data = [],
  value,
  onChange,
  checkedIcon,
  uncheckedIcon,
  style,
  ...restProps
}) => {
  const slideModalRef = useRef<any>(null)
  const animatedRef = useRef<SlideAnimated | null>(null)

  const animatedStyle = useMemo(() => {
    if (!animatedRef.current) return {}
    
    return {
      transform: [
        { translateX: animatedRef.current.getState().translateX },
        { translateY: animatedRef.current.getState().translateY }
      ],
      opacity: animatedRef.current.getState().opacity
    }
  }, [])

  useMemo(() => {
    if (variables.dropdownEnableAnimated) {
      animatedRef.current = new SlideAnimated({
        directionType: ['vertical'],
        duration: 1000,
        translateYList: [
          direction === 'down' ? -20 : 20,
          0,
        ]
      })
    }
  }, [direction])

  const open = useCallback(() => {
    animatedRef.current?.toIn()
    return slideModalRef.current?.open()
  }, [])

  const close = useCallback(() => {
    return slideModalRef.current?.close()
  }, [])

  const computedFullScreenPatch = fullScreenPatch || getFullScreenPatch(direction)

  return (
    <SlideModal
      ref={slideModalRef}
      fullScreenPatch={computedFullScreenPatch}
      direction={direction}
      offsetX={offsetX}
      offsetY={offsetY}
      cancelable={cancelable}
      {...restProps}>
      <DropdownContent
        data={data}
        value={value}
        onChange={onChange}
        checkedIcon={checkedIcon}
        uncheckedIcon={uncheckedIcon}
        style={style}
        animatedStyle={animatedStyle}
        onClose={close}
      />
    </SlideModal>
  )
}

