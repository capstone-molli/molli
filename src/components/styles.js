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
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
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
        backgroundColor: "#F5FCFF"
    },
    card: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#E8E8E8",
        justifyContent: "center",
        backgroundColor: "white"
    },
    text: {
        textAlign: "center",
        fontSize: 50,
        backgroundColor: "transparent"
    }
});
