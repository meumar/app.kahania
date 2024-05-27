import { Modal, View, Text, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

function CustomModal({ heading, children, modalVisible }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalTopbar}>
            <Text style={styles.modalTopbarText}>{heading}</Text>
          </View>
          <View style={styles.modalBody}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}

export default CustomModal;

const styles = StyleSheet.create({
  modalBody: {
    padding: 12,
  },
  modalTopbar: {
    padding: 12,
    borderBottomColor: colors.subText,
    borderBottomWidth: 0.4,
  },
  modalTopbarText: {
    size: 16,
    fontFamily: "Inter_600SemiBold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "100%",
    shadowColor: "#000",
    shadowRadius: 4,
    elevation: 6,
    borderColor: colors.subText,
    borderWidth: 1,
  },
});
