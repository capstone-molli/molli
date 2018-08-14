import { StyleSheet } from "react-native"

export default StyleSheet.create({
    maxScreenView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    text: {
        marginTop: 40,
        color: "#000000",
        fontWeight: "bold",
        fontSize: 30,
        textDecorationLine: "underline",
        textAlign: "center"
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 2,
        borderColor: "#000000",
        marginBottom: 10,
    },
    centeredInputText: {
        textAlign: "center",
        justifyContent: 'center'
    },
    searchPanel: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        flex: 1,
        backgroundColor: "#fff",
    },
    searchPanelSuper: {
        flex: 3 / 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchPanelSub: {
        flex: 7 / 10,
        flexDirection: "column"
    },
    container: {
        flex: 1,
        backgroundColor: "#ffffff",

    },
    card: {
        flex: 2 / 3,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#E8E8E8",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    text: {
        textAlign: "center",
        fontSize: 50,
        // backgroundColor: "transparent"
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    drawerHeader: {
        height: 200,
        backgroundColor: '#fff'
    },
    drawerImage: {
        height: 150,
        width: 150,
        borderRadius: 75
    }
});
