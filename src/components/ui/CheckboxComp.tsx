import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import CheckBox from '@react-native-community/checkbox';
import Typography from './Typography';
import { Colors } from '../../constant/colors';

type Props = {
  title: string,
  setCheckedCities: (b: {
    city: string;
    checked: boolean;
  }[]) => void,
  checkedCities: {
    city: string;
    checked: boolean;
  }[],
  isSelected?: boolean
}

const CheckBoxComp = ({ title, setCheckedCities, checkedCities, isSelected }: Props) => {

  const [checked, setChecked] = useState(isSelected);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <CheckBox
        disabled={false}
        value={checked}
        onFillColor={Colors.PRIMARY_COLOR}
        onValueChange={(newValue) => {
          setChecked(newValue)
          if (newValue) {
            if (checkedCities) {
              setCheckedCities([...checkedCities, {
                checked: newValue,
                city: title
              }])
            }
          } else {
            setCheckedCities(checkedCities.filter(obj => obj.city != title))
          }
        }}
      />
      <Typography variant='h3'>{title}</Typography>
    </View>
  )

}

export default CheckBoxComp