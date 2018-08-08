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
    }
});
