import { Platform, Pressable, StyleSheet, View } from "react-native";
import { SCREEN_WIDTH } from "../../constant/dimentions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../constant/colors";
import { Tabs } from "./TabScreens";

export const BottomTabView = ({ state, navigation }: any) => {

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {
      marginBottom: insets.bottom + 10
    }]}>
      {/* // 0 - 4 */}
      {state.routes.map((route: any, index: number) => {

        const isFocused = state.index === index;
        // {2}

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            android_ripple={
              {
                color: '#0000003a',
                borderless: true,
                radius: 24
              }
            }
            style={[styles.pressable, {
              backgroundColor: (isFocused) ? Colors.PRIMARY_COLOR : Colors.WHITE
            }]}
          >
            {isFocused ? Tabs[index].selectedIcon : Tabs[index].defaultIcon}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: Colors.WHITE,
    marginHorizontal: 20,
    borderRadius: 100,
    elevation: 2,
    position: 'absolute',
    bottom: (Platform.OS == 'android') ? 0 : -20,
    padding: 16,
    width: SCREEN_WIDTH - 40,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  pressable: {
    width: 48,
    height: 48,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
