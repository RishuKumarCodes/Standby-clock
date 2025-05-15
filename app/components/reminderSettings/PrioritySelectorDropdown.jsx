import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import {MdTxt} from '../CustomText';

const PrioritySelectorDropdown = ({
  color,
  setColor,
  options,
  defaultLabel = 'Priority',
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // determine label to display
  const label = !color || color === '#c9d5d6'
    ? defaultLabel
    : options.find(o => o.value === color)?.label;

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowDropdown(v => !v)}
      >
        <View style={[styles.dropdownDot, { backgroundColor: color }]} />
        <MdTxt style={styles.dropdownButtonText}>{label}</MdTxt>
        <Entypo name="chevron-small-down" size={24} color="white" />
      </TouchableOpacity>

      {showDropdown && (
        <Modal
          transparent
          animationType="none"
          onRequestClose={() => setShowDropdown(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
            <View style={styles.dropdownBackdrop} />
          </TouchableWithoutFeedback>

          <View style={styles.dropdownList}>
            {options.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={styles.dropdownItem}
                onPress={() => {
                  setColor(opt.value);
                  setShowDropdown(false);
                }}
              >
                <View
                  style={[
                    styles.dropdownDot,
                    { backgroundColor: opt.value.toString() },
                  ]}
                />
                <MdTxt style={styles.dropdownItemText}>{opt.label}</MdTxt>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 5,
  },
  dropdownDot: {
    height: 10,
    width: 10,
    borderRadius: 10,
    marginRight: 6,
  },
  dropdownButtonText: {
    color: '#fff',
    paddingTop: 4,
  },
  dropdownBackdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownList: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: '#2b4a40',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: 140,
    zIndex: 100,
  },
  dropdownItem: {
    paddingVertical: 2,
    gap: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownItemText: {
    paddingTop: 4,
    color: '#fff',
  },
});

export default PrioritySelectorDropdown;
