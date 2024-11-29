import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigator from "./TabNavigator";
import Settings from "../screens/Settings";
import Events from "../screens/Events";
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();


export default DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: '#ffffff',
                    width: 300,
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    paddingTop: 20,
                },
                drawerItemStyle: {
                    borderRadius: 10,
                    paddingVertical: 4,
                    marginHorizontal: 12,
                },
                drawerLabelStyle: {
                    fontSize: 16,
                    fontWeight: '500',
                    marginLeft: -16,
                    paddingVertical: 6,
                },
                drawerActiveBackgroundColor: '#e7f3ff',
                drawerActiveTintColor: '#131313',
                drawerInactiveTintColor: '#5f6368',
            }}
            initialRouteName="MainTabs"
        >
            <Drawer.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{
                    title: 'Home',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons
                            name="home"
                            size={size}
                            color={color}
                            style={{ marginLeft: 4, marginRight: 8 }}
                        />
                    ),
                }}
            />
            <Drawer.Screen
                name="Settings"
                component={Settings}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons
                            name="settings"
                            size={size}
                            color={color}
                            style={{ marginLeft: 4, marginRight: 8 }}
                        />
                    ),
                }}
            />
            <Drawer.Screen
                name="Events"
                component={Events}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons
                            name="calendar"
                            size={size}
                            color={color}
                            style={{ marginLeft: 4, marginRight: 8 }}
                        />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
};